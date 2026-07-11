from app.rag.embeddings.gemini_embeddings import get_embedding_model
from app.rag.vectorstore.chroma_store import get_collection


class Retriver:

    @staticmethod
    def retrieve(
        question: str,
        k: int = 5,
    ):
        embedding_model = get_embedding_model()

        query_embedding = embedding_model.embed_query(
            question
        )

        collection = get_collection()

        results = collection.query(
            query_embedding = [query_embedding],
            n_results = k
        )

        retrieved = []

        for doc , meta in zip(
            results["documents"][0],
            results["metadata"][0],
        ):
            retrieved.append(
                {
                    "text": doc,
                    "source": meta["source"],
                }
            )

        return retrieved