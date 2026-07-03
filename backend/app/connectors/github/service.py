import os
from urllib.parse import urlencode
from sqlmodel import Session, select
from app.db.models import GitHubConnection
import httpx
from dotenv import load_dotenv

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

            return{
                "message": "GitHub account connected successfully",
                "github_username": connection.github_username,
            }


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