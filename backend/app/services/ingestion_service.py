from pathlib import Path 

from app.rag.loaders.pdf_loader import extract_pdf_text
from app.rag.chunking.text_chunker import chunk_text
from app.rag.pipelines.ingestion_pipeline import ingest_chunks
from app.rag.vectorstore.chroma_store import get_collection


class IngestionService:

    @staticmethod
    def ingest_document(filename: str):

        file_path = Path("uploads")/filename
        text = extract_pdf_text(str(file_path))
        collection = get_collection()

        existing = collection.get(
            where = {"source": filename}
        )

        if len(existing["ids"]) > 0:
            return {
                "message": "already indexed"
            }

        chunks = chunk_text(text)
        count =  ingest_chunks(chunks ,filename)


        return {
            "chunks": len(chunks),
            "stored_chunks": count
        }