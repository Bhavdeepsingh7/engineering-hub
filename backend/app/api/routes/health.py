from fastapi import APIRouter, HTTPException, status
from sqlalchemy import text

from app.db.database import engine
from app.rag.vectorstore.chroma_store import get_collection

router = APIRouter()

@router.get("/")
def health_check():
    return {
        "status": "running",
        "service": "Engineering Intelligence hub"
    }


@router.get("/ready")
def readiness_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        get_collection().count()
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Dependency unavailable: {type(exc).__name__}") from exc
    return {"status": "ready"}
