from fastapi import APIRouter , Depends
from app.connectors.github.service import GitHubService
from sqlmodel import Session
from app.db.session import get_session

router  = APIRouter(
    prefix = "/github",
    tags = ["GitHub"]
)

@router.get("/login")
def github_login():
    return GitHubService.get_login_url()


@router.get("/callback")
async def github_callback(code:str , session: Session = Depends(get_session)):
    

    return await GitHubService.exchange_code(code,session)


@router.get("/repos")
async def get_repositories(session: Session = Depends(get_session)):

    return await GitHubService.get_repositories(session)


@router.get("/repos/{owner}/{repo}/tree")
async def get_repository_tree(
    owner: str,
    repo:  str,
    session:  Session = Depends(get_session),
):
    return await GitHubService.get_repository_tree(session , owner, repo)


@router.get("/repos/{owner}/{repo}/download")
async def download_repository(
    owner: str,
    repo: str,
    session: Session = Depends(get_session),
):
    return await GitHubService.download_repository(
        session ,
        owner,
        repo,
    )

@router.get("/status")
def github_status(session: Session = Depends(get_session)):
    return GitHubService.get_status(session)