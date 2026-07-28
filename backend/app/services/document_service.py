from app.rag.loaders.pdf_loader import extract_pdf_text
from app.rag.chunking.text_chunker import chunk_text
from app.rag.pipelines.ingestion_pipeline import ingest_chunks
from app.rag.vectorstore.chroma_store import get_collection
from app.core.config import UPLOAD_DIR

class DocumentService:

    @staticmethod
    def extract_document(filename: str):
        file_path = UPLOAD_DIR / filename

        text = extract_pdf_text(str(file_path))

        chunks = chunk_text(text)

        return {
            "total_chunks": len(chunks),
            "chunks": chunks[:3]
        }

    @staticmethod
    def delete_document(stored_filename: str, source_name: str, user_id: str):
        file_path = UPLOAD_DIR / stored_filename
        collection = get_collection()

        collection.delete(
            where={"$and": [{"source": source_name}, {"user_id": user_id}]}
        )

        if file_path.exists():
            file_path.unlink()

        return{"message": "file deleted"}
