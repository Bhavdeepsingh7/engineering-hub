from fastapi import APIRouter , Depends
from app.connectors.github.service import GitHubService
from sqlmodel import Session
from app.db.session import get_session
from app.core.auth import get_current_user_id

router  = APIRouter(
    prefix = "/github",
    tags = ["GitHub"]
)

@router.get("/login")
def github_login(user_id: str = Depends(get_current_user_id)):
    return GitHubService.get_login_url(user_id)


@router.get("/callback")
async def github_callback(code: str, state: str, session: Session = Depends(get_session)):
    

    return await GitHubService.exchange_code(code, session, GitHubService.verify_state(state))


@router.get("/repos")
async def get_repositories(session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id)):

    return await GitHubService.get_repositories(session, user_id)


@router.get("/repos/{owner}/{repo}/tree")
async def get_repository_tree(
    owner: str,
    repo:  str,
    session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id),
):
    return await GitHubService.get_repository_tree(session, owner, repo, user_id)


@router.get("/repos/{owner}/{repo}/download")
async def download_repository(
    owner: str,
    repo: str,
    session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id),
):
    return await GitHubService.download_repository(
        session ,
        owner,
        repo, user_id,
    )

@router.get("/status")
def github_status(session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id)):
    return GitHubService.get_status(session, user_id)



@router.post("/repos/{owner}/{repo}/sync")
async def sync_repository(
    owner: str,
    repo: str,
    session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id),
):
    return await GitHubService.sync_repository(
        session=session,
        owner = owner,
        repo=repo, user_id=user_id,
    )


@router.delete("/repos/{owner}/{repo}")
async def delete_repository(
    owner: str,
    repo: str,
    session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id),
):
    return await GitHubService.delete_repository(
        session = session,
        owner = owner,
        repo=repo, user_id=user_id,
    )

@router.get("/imported")
async def get_imported_repositories(
    session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id),
):
    return GitHubService.get_imported_repositories(session, user_id)
