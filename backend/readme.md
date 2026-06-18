backend/
│
├── app/
│   │
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── documents.py
│   │   │   ├── chat.py
│   │   │   ├── repositories.py
│   │   │   └── health.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── constants.py
│   │
│   ├── db/
│   │   ├── database.py
│   │   ├── models.py
│   │   └── session.py
│   │
│   ├── schemas/
│   │   ├── document.py
│   │   ├── chat.py
│   │   ├── repository.py
│   │   └── user.py
│   │
│   ├── services/
│   │   ├── document_service.py
│   │   ├── chat_service.py
│   │   ├── repository_service.py
│   │   └── rag_service.py
│   │
│   ├── rag/
│   │   ├── loaders/
│   │   │   ├── pdf_loader.py
│   │   │   ├── markdown_loader.py
│   │   │   └── text_loader.py
│   │   │
│   │   ├── chunking/
│   │   │   └── text_chunker.py
│   │   │
│   │   ├── embeddings/
│   │   │   └── gemini_embeddings.py
│   │   │
│   │   ├── retrievers/
│   │   │   └── vector_retriever.py
│   │   │
│   │   ├── vectorstore/
│   │   │   └── chroma_store.py
│   │   │
│   │   └── pipelines/
│   │       ├── ingestion_pipeline.py
│   │       └── retrieval_pipeline.py
│   │
│   ├── utils/
│   │   ├── file_utils.py
│   │   ├── logger.py
│   │   └── helpers.py
│   │
│   └── main.py
│
├── uploads/
│
├── chroma_db/
│
├── tests/
│   ├── test_chat.py
│   ├── test_upload.py
│   └── test_rag.py
│
├── .env
├── requirements.txt
└── README.md