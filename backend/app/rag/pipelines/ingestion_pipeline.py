from app.rag.embeddings.gemini_embeddings import get_embedding_model
from app.rag.vectorstore.chroma_store import get_collection


def ingest_chunks(chunks, filename):
    embedding_model = get_embedding_model()
    collection = get_collection()

    embeddings = embedding_model.embed_documents(chunks)

    ids = [
        f"{filename}_{i}" for i in range(len(chunks))
    ]

    print(type(embeddings))
    print(len(embeddings))

    collection.add(
        ids=ids, 
        documents = chunks ,
        embeddings = embeddings,
        metadatas = [{"source": filename} for _ in chunks]
    )

    return len(chunks)