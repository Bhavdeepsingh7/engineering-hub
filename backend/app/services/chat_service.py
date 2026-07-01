from app.services.search_service import SearchService
from app.services.llm_service import LLMService
from sqlmodel import Session

from app.db.models import Message


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