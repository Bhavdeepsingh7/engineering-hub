from multiprocessing import connection
import os
import base64
from urllib.parse import urlencode
from app.rag.loaders.document_loader import load_document
from app.rag.chunking.text_chunker import chunk_text
from app.rag.pipelines.ingestion_pipeline import ingest_chunks
from sqlmodel import Session, select
from app.db.models import GitHubConnection
import httpx
from dotenv import load_dotenv
from app.connectors.github.ingest import filter_files
import tempfile
from pathlib import Path
from fastapi.responses import RedirectResponse


load_dotenv()

class GitHubService:

    @staticmethod
    def get_login_url():

        params = {
            "client_id": os.getenv("GITHUB_CLIENT_ID"),
            "redirect_uri": os.getenv("GITHUB_CALLBACK_URL"),
            "scope": "repo read:user",
        }

        return {
            "url": f"https://github.com/login/oauth/authorize?{urlencode(params)}"
        }
    

    @staticmethod
    async def exchange_code(code: str, session: Session):

        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                headers = {
                    "Accept": "application/json"
                },
                data = {
                    "client_id": os.getenv("GITHUB_CLIENT_ID"),
                    "client_secret": os.getenv("GITHUB_CLIENT_SECRET"),
                    "code": code,
                }
            )

            token_data = token_response.json()

            if "access_token" not in token_data:
                raise Exception(f"GitHub OAuth failed: {token_data}")

            access_token  = token_data["access_token"]

            user_response = await client.get(
                "https://api.github.com/user",
                headers = {
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json"
                },
            )

            user_data = user_response.json()

            existing = session.exec(
                select(GitHubConnection).where(
                    GitHubConnection.github_id == user_data["id"]
                )
            ).first()


            if existing:
                existing.github_username = user_data["login"]
                existing.access_token = access_token
                session.add(existing)
                session.commit()

                return {
                    "message": "Github account updated successfully",
                    "github_username": existing.github_username,
                }
                

            connection = GitHubConnection(
                github_id = user_data["id"],
                github_username = user_data["login"],
                access_token = access_token
            )

            session.add(connection)
            session.commit()
            session.refresh(connection)

            return RedirectResponse(
                url = "http://localhost:5173/github"
            )

    @staticmethod
    async def get_repositories(session: Session):

        connection = session.exec(
            select(GitHubConnection)
        ).first()

        if not connection:
            return {
                "message": "Github account not connected"
            }

        async with httpx.AsyncClient() as client:

            response = await client.get(
                "https://api.github.com/user/repos",
                headers = {
                    "Authorization": f"Bearer {connection.access_token}",
                    "Accept": "application/vnd.github+json"
                },
                params = {
                    "sort": "updated",
                    "per_page": 100,
                }
            )

        
        repos = response.json()

        return [
            {
                "id": repo["id"],
                "name": repo["name"],
                "full_name": repo["full_name"],
                "private": repo["private"],
                "language": repo["language"],
                "default_branch": repo["default_branch"],
                "updated_at": repo["updated_at"],
            }
            for repo in repos
        ]


    @staticmethod
    async def get_repository_tree(
        session: Session,
        owner: str,
        repo: str,
    ):
        connection = session.exec(
            select(GitHubConnection)
        ).first()

        if not connection: 
            raise Exception("GitHub account not connected")
        
        async with httpx.AsyncClient() as client:

            repo_response = await client.get(
                f"https://api.github.com/repos/{owner}/{repo}",
                headers = {
                    "Authorization": f"Bearer {connection.access_token}",
                    "Accept": "application/vnd.github+json",
                },
            )

            repo_data = repo_response.json()

            default_branch = repo_data["default_branch"]

            tree_response = await client.get(
                f"https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}",
                headers = {
                    "Authorization" : f"Bearer {connection.access_token}",
                    "Accept": "application/vnd.github+json",
                },
                params = {
                    "recursive": 1
                },
            )
        
            tree = tree_response.json()["tree"]

            filtered = filter_files(tree)

            return filtered
        
    
    @staticmethod
    async def download_file(
        owner: str,
        repo: str,
        path: str,
        access_token: str
    ):
        async with httpx.AsyncClient() as client:

            response = await client.get(
                f"https://api.github.com/repos/{owner}/{repo}/contents/{path}",
                headers = {
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json",
                },
            )

        response.raise_for_status()

        data = response.json()

        content = base64.b64decode(
            data["content"]
        ).decode("utf-8", errors="ignore")

        return content
    

    @staticmethod
    async def download_repository(
        session: Session,
        owner: str,
        repo: str
    ):
        connection = session.exec(
            select(GitHubConnection)
        ).first()

        if not connection:
            raise Exception("GitHub not connected")
        
        files = await GitHubService.get_repository_tree(session , owner , repo,)

        documents = []

        temp_dir = tempfile.mkdtemp()

        for file in files:

            content = await GitHubService.download_file(
                owner, 
                repo, 
                file["path"],
                connection.access_token,
            )

            local_path = Path(temp_dir)/file["path"]

            local_path.parent.mkdir(parents = True, exist_ok = True)

            with open(
                local_path ,
                "w",
                encoding = "utf-8",
                errors= "ignore", 
            ) as f:
                f.write(content)

            text = load_document(str(local_path))

            if not text:
                continue

            chunks = chunk_text(text)

            ingest_chunks(chunks , file["path"])

            metadata = {
                "source": file["path"],
                "connector": "github",
                "repo": repo,
                "owner": owner,
            }
                
            documents.append(
                {
                    "text": text,
                    "source": file["path"],
                    "metadata": metadata,
                }
            )

        return documents

    
    @staticmethod
    def get_status(session: Session):
        connection = session.exec(
            select(GitHubConnection)
        ).first()

        if not connection:
            return {
                "connected": False,
                "github_username": None,
            }

        return {
            "connected": True,
            "github_username": connection.github_username,
        }