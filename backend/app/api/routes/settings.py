from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.db.session import get_session
from app.schemas.settings import APIkeyRequest
from app.services.settings import SettingsService
from app.core.auth import get_current_user_id

router  = APIRouter(
    prefix ="/settings",
    tags = ["Settings"],
)

@router.post("/api-key")
def save_api_key(
    request: APIkeyRequest,
    session : Session = Depends(get_session),
    user_id: str = Depends(get_current_user_id),
):
    return SettingsService.save_api_key(
        session,
        request.provider,
        request.api_key, user_id,
    )


@router.get("/api-key/{provider}")
def get_api_key_status(
    provider: str,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user_id),
):
    return SettingsService.get_api_key_status(
        session,
        provider, user_id,
    )
