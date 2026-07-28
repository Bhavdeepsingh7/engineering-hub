from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlmodel import Session, select

from app.core.auth import get_current_user_id
from app.db.models import Document
from app.db.session import get_session
from app.core.config import MAX_UPLOAD_BYTES, UPLOAD_DIR
from app.services.document_service import DocumentService
from app.services.ingestion_service import IngestionService

router = APIRouter()
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_file(file: UploadFile = File(...), session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id)):
    filename = Path(file.filename or "upload").name
    if Path(filename).suffix.lower() not in {".pdf", ".txt", ".md", ".pptx"}:
        raise HTTPException(status_code=415, detail="Supported file types are PDF, TXT, Markdown, and PPTX")
    if file.size is not None and file.size > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail=f"Files must be {MAX_UPLOAD_BYTES // (1024 * 1024)} MB or smaller")
    existing_document = session.exec(select(Document).where(Document.user_id == user_id, Document.filename == filename)).first()
    if existing_document:
        raise HTTPException(status_code=409, detail="A document with this filename is already indexed. Delete it before uploading a replacement.")

    stored_filename = f"{user_id}_{uuid4().hex}_{filename}"
    stored_path = UPLOAD_DIR / stored_filename
    bytes_written = 0
    try:
        with stored_path.open("wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                bytes_written += len(chunk)
                if bytes_written > MAX_UPLOAD_BYTES:
                    raise HTTPException(status_code=413, detail=f"Files must be {MAX_UPLOAD_BYTES // (1024 * 1024)} MB or smaller")
                buffer.write(chunk)
    except Exception:
        stored_path.unlink(missing_ok=True)
        raise
    finally:
        await file.close()
    try:
        result = IngestionService.ingest_document(stored_filename, user_id=user_id, source_name=filename)
    except (ValueError, OSError) as exc:
        stored_path.unlink(missing_ok=True)
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    session.add(Document(user_id=user_id, filename=filename, stored_filename=stored_filename, chunk_count=result.get("chunks", 0)))
    session.commit()
    return {"message": "File uploaded successfully", "filename": filename, "ingestion_result": result}


@router.get("/")
async def get_documents(session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id)):
    return session.exec(select(Document).where(Document.user_id == user_id).order_by(Document.created_at.desc())).all()


@router.get("/extract/{filename}")
async def extract_document(filename: str, session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id)):
    document = session.exec(select(Document).where(Document.filename == filename, Document.user_id == user_id)).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentService.extract_document(document.stored_filename)


@router.delete("/{filename}")
async def delete_documents(filename: str, session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id)):
    document = session.exec(select(Document).where(Document.filename == filename, Document.user_id == user_id)).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    result = DocumentService.delete_document(document.stored_filename, document.filename, user_id)
    session.delete(document)
    session.commit()
    return result
