from fastapi import APIRouter, Depends
from app.core.auth import get_current_user_id
from app.services.chat_service import ChatService



router = APIRouter()

@router.get("/")
async def chat(question: str, user_id: str = Depends(get_current_user_id)):
    
    return ChatService.chat(question, user_id)

