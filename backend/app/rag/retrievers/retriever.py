from app.rag.embeddings.gemini_embeddings import get_embedding_model
from app.rag.vectorstore.chroma_store import get_collection


class Retriver:

    @staticmethod
    def retrieve(
        question: str,
        user_id: str,
        k: int = 5,
    ):
        embedding_model = get_embedding_model(user_id)

        query_embedding = embedding_model.embed_query(
            question
        )

        collection = get_collection()

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=k,
            where={"user_id": user_id},
        )

        retrieved = []

        for doc , meta in zip(
            results["documents"][0],
            results["metadatas"][0],
        ):
            retrieved.append(
                {
                    "text": doc,
                    "source": meta["source"],
                }
            )

        return retrieved
