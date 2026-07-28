from fastapi import APIRouter, Depends
from app.core.auth import get_current_user_id

from app.rag.embeddings.gemini_embeddings import get_embedding_model
from app.rag.vectorstore.chroma_store import get_collection

router = APIRouter()


@router.get("/")
async def search(query: str, user_id: str = Depends(get_current_user_id)):

    embedding_model = get_embedding_model(user_id)

    query_embedding = embedding_model.embed_query(query)

    collection = get_collection()

    results =  collection.query(
        query_embeddings = [query_embedding],
        n_results = 3,
        where={"user_id": user_id},
    )

    return results
