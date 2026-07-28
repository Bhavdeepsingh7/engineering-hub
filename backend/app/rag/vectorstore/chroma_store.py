import chromadb
from app.core.config import CHROMA_PATH

CHROMA_PATH.mkdir(parents=True, exist_ok=True)
client = chromadb.PersistentClient(path=str(CHROMA_PATH))

collection = client.get_or_create_collection(
    name = "engineering_docs"
)

def get_collection():
    return collection

