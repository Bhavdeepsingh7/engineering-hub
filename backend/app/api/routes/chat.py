from fastapi import APIRouter
from app.services.chat_service import ChatService

router = APIRouter()

@router.get("/")
async def chat(question:str):
    return ChatService.chat(question)

