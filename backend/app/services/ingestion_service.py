from pathlib import Path 
import logging

from app.rag.loaders.document_loader import load_document
from app.rag.chunking.text_chunker import chunk_text
from app.rag.pipelines.ingestion_pipeline import ingest_chunks
from app.rag.vectorstore.chroma_store import get_collection
from app.core.config import UPLOAD_DIR


class IngestionService:

    @staticmethod
    def ingest_document(filename: str, user_id: str, source_name: str | None = None):

        file_path = UPLOAD_DIR / filename
        text = load_document(str(file_path))
        if not text or not text.strip():
            raise ValueError("No extractable text was found in the uploaded document")
        collection = get_collection()
        source = source_name or filename

        existing = collection.get(
            where={"$and": [{"source": source}, {"user_id": user_id}]}
        )

        if len(existing["ids"]) > 0:
            logging.getLogger(__name__).info(
                "rag.ingestion.skip_existing collection=%s source=%s user_id=%s chunks=%d",
                collection.name, source, user_id, len(existing["ids"]),
            )
            return {
                "message": "already indexed",
                "chunks": len(existing["ids"]),
                "stored_chunks": len(existing["ids"]),
            }

        chunks = chunk_text(text)
        if not chunks:
            raise ValueError("Document text did not produce any chunks")
        logging.getLogger(__name__).info(
            "rag.ingestion.extracted source=%s user_id=%s characters=%d chunks=%d",
            source, user_id, len(text), len(chunks),
        )
        count = ingest_chunks(chunks, source, user_id)


        return {
            "chunks": len(chunks),
            "stored_chunks": count
        }
