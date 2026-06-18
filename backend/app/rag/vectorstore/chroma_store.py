import chromadb

client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_or_create_collection(
    name = "engineering_docs"
)

def get_collection():
    return collection

