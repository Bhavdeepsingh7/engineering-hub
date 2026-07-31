import logging
from datetime import datetime

from app.core.errors import NoAPIKeyConfiguredError
from app.services.search_service import SearchService
from app.services.llm_service import LLMService
from app.services.api_key_service import APIKeyService
from sqlmodel import Session

from app.db.models import Chat, Message

logger = logging.getLogger(__name__)


class ChatService:

    @staticmethod
    def ensure_gemini_api_key(user_id: str) -> None:
        if not APIKeyService.has_valid_api_key(user_id, "gemini"):
            raise NoAPIKeyConfiguredError()

    @staticmethod
    def chat(question, user_id: str):
        ChatService.ensure_gemini_api_key(user_id)

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
        ChatService.ensure_gemini_api_key(user_id)

        chat = session.get(Chat, chat_id)
        if not chat or chat.user_id != user_id:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Chat not found")

        user_message = Message(
            chat_id = chat_id,
            user_id=user_id,
            role= "user",
            content= question,
        )

        session.add(user_message)
        session.commit()

        # The first message is persisted independently from the display title.
        # Updating this metadata after the message prevents a title change from
        # replacing or removing the conversation content.
        if chat.title == "New Chat":
            title = question.strip()
            if len(title) > 40:
                title = title[:40] + "..."
            chat.title = title
            chat.updated_at = datetime.utcnow()
            session.add(chat)
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
        chat.updated_at = datetime.utcnow()
        session.add(chat)
        session.commit()

        return{
            "answer": answer,
            "sources": sources,
        }
