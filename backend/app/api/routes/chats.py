from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, delete, select

from app.db.models import Chat, Message
from app.db.session import get_session
from app.schemas.chat import ChatRequest
from app.services.chat_service import ChatService
from app.core.auth import get_current_user_id

router = APIRouter(prefix="/chats", tags=["Chats"])

@router.post("/")
def create_chat(session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id)):
    chat = Chat(
        title="New Chat", user_id=user_id
    )

    session.add(chat)
    session.commit()
    session.refresh(chat)

    return chat

@router.get("/")
def get_all_chats(session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id)):
    chats = session.exec(
        select(Chat).where(Chat.user_id == user_id)
        .order_by(Chat.updated_at.desc())
    ).all()

    return chats

@router.get("/{chat_id}")
def get_chats(chat_id: int, session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id)):

    chat = session.get(Chat, chat_id)

    if not chat or chat.user_id != user_id:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    messages = session.exec(
        select(Message)
        .where(Message.chat_id == chat_id, Message.user_id == user_id)
        .order_by(Message.timestamp)
    ).all()

    return {
        "id": chat.id,
        "title": chat.title,
        "messages": messages
    }


@router.post("/{chat_id}/message")
def send_message(chat_id: int,request: ChatRequest, session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id)):
    return ChatService.process_message(
        chat_id=chat_id,
        question= request.question,
        session=session, user_id=user_id
    )


@router.delete("/{chat_id}")
def delete_chat(chat_id: int, session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id)):
    chat = session.get(Chat, chat_id)

    if not chat or chat.user_id != user_id:
        raise HTTPException(
            status_code=404, 
            detail="Chat not found"
        )
    
    # Execute the child delete immediately. With no ORM relationship declared,
    # queued session.delete calls are not guaranteed to flush before the parent
    # Chat delete, which caused PostgreSQL's foreign-key violation.
    session.exec(delete(Message).where(Message.chat_id == chat_id))

    session.delete(chat)
    session.commit()

    return {
        "message": "chat deleted successfully"
    }
