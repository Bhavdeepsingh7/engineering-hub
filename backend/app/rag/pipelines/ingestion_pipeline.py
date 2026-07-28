import hashlib
import logging

from app.rag.embeddings.gemini_embeddings import get_embedding_model
from app.rag.vectorstore.chroma_store import get_collection

logger = logging.getLogger(__name__)


def ingest_chunks(chunks, filename, user_id: str):
    if not chunks:
        return 0

    embedding_model = get_embedding_model(user_id)
    collection = get_collection()

    embeddings = embedding_model.embed_documents(chunks)

    # Chroma IDs are collection-wide.  A filename alone collides when two users
    # upload identically named files (and with legacy pre-authentication data).
    # Keep the readable source in metadata and scope only the storage ID.
    source_key = hashlib.sha256(f"{user_id}:{filename}".encode("utf-8")).hexdigest()
    ids = [f"chunk_{source_key}_{i}" for i in range(len(chunks))]

    logger.info(
        "rag.ingestion.add collection=%s source=%s user_id=%s chunks=%d embedding_dimensions=%d id_prefix=%s",
        collection.name,
        filename,
        user_id,
        len(chunks),
        len(embeddings[0]) if embeddings else 0,
        ids[0].rsplit("_", 1)[0],
    )

    collection.add(
        ids=ids, 
        documents = chunks ,
        embeddings = embeddings,
        metadatas = [{"source": filename, "user_id": user_id} for _ in chunks]
    )

    return len(chunks)
