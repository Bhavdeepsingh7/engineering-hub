import logging

from app.services.search_service import SearchService
from app.services.llm_service import LLMService
from app.db import session
from app.schemas import chat
from sqlmodel import Session

from app.db.models import Chat, Message

logger = logging.getLogger(__name__)


class ChatService:

    @staticmethod
    def chat(question, user_id: str):

        results = SearchService.retrieve(question, user_id)

        documents = results["documents"][0]

        context = "\n\n".join(documents)
        logger.info(
            "rag.context user_id=%s retrieved_chunks=%d context_characters=%d",
            user_id, len(documents), len(context),
        )

        answer = LLMService.generate_response(
            question ,
            context, user_id
        )

        return {
            
            "answer": answer,
            "sources":list(
                set(
                    metadata["source"] for metadata in results["metadatas"][0]
                )
            )
        }
    

    @staticmethod
    def process_message(chat_id: int, question: str, session: Session, user_id: str):

        chat = session.get(Chat, chat_id)
        if not chat or chat.user_id != user_id:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Chat not found")

    # Rename only if it's still the default title
        title = question.strip()

        if len(title) > 40:
            title = title[:40] + "..."

        if chat.title == "New Chat":
            chat.title = title

    # Save the title change
        session.add(chat)

        user_message = Message(
            chat_id = chat_id,
            user_id=user_id,
            role= "user",
            content= question,
        )

        session.add(user_message)
        session.commit()

        results = SearchService.retrieve(question, user_id)

        documents = results["documents"][0]

        context = "\n\n".join(documents)
        logger.info(
            "rag.context user_id=%s retrieved_chunks=%d context_characters=%d",
            user_id, len(documents), len(context),
        )

        answer = LLMService.generate_response(
            question ,
            context, user_id
        )

        sources = list(
            set(
                metadata["source"]
                for metadata in results["metadatas"][0]
            )
        )

        assistant_message = Message(
            chat_id= chat_id,
            user_id=user_id,
            role="assistant",
            content=answer,
        )

        session.add(assistant_message)
        session.commit()

        return{
            "answer": answer,
            "sources": sources,
        }
