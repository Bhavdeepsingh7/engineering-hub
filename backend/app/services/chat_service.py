from turtle import title

from app.services.search_service import SearchService
from app.services.llm_service import LLMService
from app.db import session
from app.schemas import chat
from sqlmodel import Session

from app.db.models import Chat, Message


class ChatService:

    @staticmethod
    def chat(question):

        results = SearchService.retrieve(question)

        documents = results["documents"][0]

        context = "\n\n".join(documents)

        print("QUESTION:")
        print(question)

        print("\nCONTEXT:")
        print(context)
        answer = LLMService.generate_response(
            question ,
            context
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
    def process_message(chat_id: int , question: str, session: Session):

        chat = session.get(Chat, chat_id)

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
            role= "user",
            content= question,
        )

        session.add(user_message)
        session.commit()

        results = SearchService.retrieve(question)

        documents = results["documents"][0]

        context = "\n\n".join(documents)

        answer = LLMService.generate_response(
            question ,
            context
        )

        sources = list(
            set(
                metadata["source"]
                for metadata in results["metadatas"][0]
            )
        )

        assistant_message = Message(
            chat_id= chat_id,
            role="assistant",
            content=answer,
        )

        session.add(assistant_message)
        session.commit()

        return{
            "answer": answer,
            "sources": sources,
        }