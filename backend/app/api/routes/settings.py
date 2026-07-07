from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.db.session import get_session
from app.schemas.settings import APIkeyRequest
from app.services.settings import SettingsService

router  = APIRouter(
    prefix ="/settings",
    tags = ["Settings"],
)

@router.post("/api-key")
def save_api_key(
    request: APIkeyRequest,
    session : Session = Depends(get_session),
):
    return SettingsService.save_api_key(
        session,
        request.provider,
        request.api_key,
    )


@router.get("/api-key/{provider}")
def get_api_key_status(
    provider: str,
    session: Session = Depends(get_session),
):
    return SettingsService.get_api_key_status(
        session,
        provider,
    )