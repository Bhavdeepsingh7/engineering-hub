from app.services.search_service import SearchService
from app.services.llm_service import LLMService

class ChatService:

    @staticmethod
    def chat(question):

        results = SearchService.retrieve(question)

        documents = results["documents"][0]

        context = "\n\n".join(documents)

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