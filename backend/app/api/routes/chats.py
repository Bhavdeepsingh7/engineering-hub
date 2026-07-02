from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db.models import Chat, Message
from app.db.session import get_session
from app.schemas.chat import ChatRequest
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chats", tags=["Chats"])

@router.post("/")
def create_chat(session: Session = Depends(get_session)):
    chat = Chat(
        title= "New Chat"
    )

    session.add(chat)
    session.commit()
    session.refresh(chat)

    return chat

@router.get("/")
def get_all_chats(session: Session = Depends(get_session)):
    chats = session.exec(
        select(Chat)
        .order_by(Chat.updated_at.desc())
    ).all()

    return chats

@router.get("/{chat_id}")
def get_chats(chat_id: int, session: Session = Depends(get_session)):

    chat = session.get(Chat, chat_id)

    if not chat:
        raise HTTPException(status_code=404, details="chat not found")
    
    messages = session.exec(
        select(Message)
        .where(Message.chat_id == chat_id)
        .order_by(Message.timestamp)
    ).all()

    return {
        "id": chat.id,
        "title": chat.title,
        "messages": messages
    }


@router.post("/{chat_id}/message")
def send_message(chat_id: int,request: ChatRequest,  session: Session = Depends(get_session)):
    return ChatService.process_message(
        chat_id=chat_id,
        question= request.question,
        session=session
    )


@router.delete("/{chat_id}")
def delete_chat(chat_id: int , session: Session = Depends(get_session)):
    chat = session.get(Chat, chat_id)

    if not chat:
        raise HTTPException(
            status_code=404, 
            detail="Chat not found"
        )
    
    messages = session.exec(
        select(Message)
        .where(Message.chat_id == chat_id)
    ).all()

    for message in messages:
        session.delete(message)

    session.delete(chat)
    session.commit()

    return {
        "message": "chat deleted successfully"
    }