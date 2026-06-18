from pathlib import Path

from app.rag.loaders.pdf_loader import extract_pdf_text
from app.rag.chunking.text_chunker import chunk_text
from app.rag.pipelines.ingestion_pipeline import ingest_chunks

class DocumentService:

    @staticmethod
    def extract_document(filename: str):
        file_path = Path("uploads") / filename

        text = extract_pdf_text(str(file_path))

        chunks = chunk_text(text)

        return {
            "total_chunks": len(chunks),
            "chunks": chunks[:3]
        }
