from app.rag.embeddings.gemini_embeddings import get_embedding_model
from app.rag.vectorstore.chroma_store import get_collection

class SearchService:

    @staticmethod
    def retrieve(query):

        embedding_model = get_embedding_model()
        query_embedding = embedding_model.embed_query(query)
        collection = get_collection()

        results = collection.query(
            query_embeddings = [query_embedding],
            n_results = 3
        )
        return results