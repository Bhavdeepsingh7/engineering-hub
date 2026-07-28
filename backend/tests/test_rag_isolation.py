import chromadb

from app.rag.pipelines import ingestion_pipeline
from app.services import search_service


class DeterministicEmbeddings:
    def embed_documents(self, chunks: list[str]) -> list[list[float]]:
        return [[float(len(chunk)), 1.0] for chunk in chunks]

    def embed_query(self, query: str) -> list[float]:
        return [float(len(query)), 1.0]


def test_same_filename_is_isolated_by_user(monkeypatch):
    """Chroma IDs and metadata must isolate identically named uploads."""
    collection = chromadb.EphemeralClient().create_collection("test_documents")
    embeddings = DeterministicEmbeddings()

    monkeypatch.setattr(ingestion_pipeline, "get_collection", lambda: collection)
    monkeypatch.setattr(ingestion_pipeline, "get_embedding_model", lambda _: embeddings)
    monkeypatch.setattr(search_service, "get_collection", lambda: collection)
    monkeypatch.setattr(search_service, "get_embedding_model", lambda _: embeddings)

    ingestion_pipeline.ingest_chunks(["alpha deployment guide"], "guide.txt", "user_alpha")
    ingestion_pipeline.ingest_chunks(["beta release checklist"], "guide.txt", "user_beta")

    alpha = search_service.SearchService.retrieve("guide", "user_alpha")
    beta = search_service.SearchService.retrieve("guide", "user_beta")

    assert alpha["documents"][0] == ["alpha deployment guide"]
    assert beta["documents"][0] == ["beta release checklist"]
    assert alpha["ids"][0] != beta["ids"][0]
    assert alpha["metadatas"][0][0]["user_id"] == "user_alpha"
    assert beta["metadatas"][0][0]["user_id"] == "user_beta"
