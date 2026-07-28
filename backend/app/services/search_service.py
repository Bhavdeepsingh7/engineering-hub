import logging

from app.rag.embeddings.gemini_embeddings import get_embedding_model
from app.rag.vectorstore.chroma_store import get_collection

logger = logging.getLogger(__name__)

class SearchService:

    @staticmethod
    def retrieve(query, user_id: str):

        embedding_model = get_embedding_model(user_id)
        query_embedding = embedding_model.embed_query(query)
        collection = get_collection()
        where = {"user_id": user_id}
        logger.info(
            "rag.retrieval.query collection=%s user_id=%s embedding_dimensions=%d n_results=%d where=%s",
            collection.name, user_id, len(query_embedding), 3, where,
        )

        results = collection.query(
            query_embeddings = [query_embedding],
            n_results = 3,
            where=where,
        )
        logger.info(
            "rag.retrieval.result ids=%s metadata=%s document_count=%d distances=%s",
            results.get("ids", [[]])[0],
            results.get("metadatas", [[]])[0],
            len(results.get("documents", [[]])[0]),
            results.get("distances", [[]])[0],
        )
        return results
