from fastapi import APIRouter, Depends
from sqlmodel import Session, func, select

from app.core.auth import get_current_user_id
from app.db.models import Chat, Document, GitHubIndexedFile
from app.db.session import get_session

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def get_summary(session: Session = Depends(get_session), user_id: str = Depends(get_current_user_id)):
    documents = session.exec(select(Document).where(Document.user_id == user_id).order_by(Document.created_at.desc())).all()
    chats = session.exec(select(Chat).where(Chat.user_id == user_id).order_by(Chat.updated_at.desc())).all()
    indexed_files = session.exec(select(GitHubIndexedFile).where(GitHubIndexedFile.user_id == user_id)).all()
    repositories = {(item.owner, item.repo) for item in indexed_files}
    return {
        "total_documents": len(documents),
        "total_repositories": len(repositories),
        "total_indexed_chunks": sum(document.chunk_count for document in documents),
        "total_chats": len(chats),
        "last_uploaded_document": documents[0] if documents else None,
        "last_imported_repository": ({"owner": indexed_files[0].owner, "repo": indexed_files[0].repo} if indexed_files else None),
        "recent_chats": chats[:5],
    }
