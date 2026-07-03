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