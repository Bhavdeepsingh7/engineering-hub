
from fastapi import APIRouter, UploadFile, File
from pathlib import Path
import shutil
from app.services.document_service import DocumentService
from app.services.ingestion_service import IngestionService

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok = True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR/file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = IngestionService.ingest_document(file.filename)

    return {
        "message": "file uploaded successfully",
        "filename": file.filename,
        "ingestion_result": result
    }

@router.get("/")
async def get_documents():
    files = []

    for file in UPLOAD_DIR.iterdir():
        if file.is_file():
            files.append({
                "filename": file.name
            })

    return files

@router.get("/extract/{filename}")
async def extract_document(filename: str):

    result = DocumentService.extract_document(filename)

    return result