# Engineering Intelligence Hub

An AI workspace for indexing engineering documents and GitHub repositories, then asking grounded questions over that private knowledge base.

## Architecture

React/Vite provides the Clerk-authenticated user interface. FastAPI serves the API, PostgreSQL (or SQLite locally) stores user-scoped application data, and ChromaDB stores user-scoped vector embeddings. Gemini powers the current embedding and answer pipeline.

                                    ┌─────────────────────────┐
                                    │         USER            │
                                    └───────────┬─────────────┘
                                                │
                                                ▼
                             ┌─────────────────────────────────┐
                             │        React + Vite UI          │
                             │                                 │
                             │ • Clerk Authentication          │
                             │ • Dashboard                     │
                             │ • Chat Interface                │
                             │ • Document Manager              │
                             │ • GitHub Import                │
                             │ • Settings (BYOK)              │
                             └──────────────┬──────────────────┘
                                            │
                              HTTPS REST API│
                                            ▼
                    ┌────────────────────────────────────────────┐
                    │            FastAPI Backend                 │
                    │                                            │
                    │  Authentication Middleware (Clerk JWT)     │
                    │                                            │
                    │  Routes                                    │
                    │  ├── Chat                                 │
                    │  ├── Documents                            │
                    │  ├── GitHub                               │
                    │  ├── Dashboard                            │
                    │  └── Settings                             │
                    └───────┬───────────────┬────────────────────┘
                            │               │
                ┌───────────┘               └───────────────┐
                ▼                                           ▼
     ┌───────────────────────┐                 ┌─────────────────────────┐
     │   PostgreSQL          │                 │      ChromaDB           │
     │      (Supabase)       │                 │     Vector Database     │
     │                       │                 │                         │
     │ Users                 │                 │ Document Embeddings     │
     │ Chats                 │                 │ Metadata               │
     │ Messages              │                 │ Semantic Search Index  │
     │ Documents             │                 └───────────┬────────────┘
     │ GitHub Metadata       │                             │
     └───────────────────────┘                             │
                                                           ▼
                                            ┌─────────────────────────┐
                                            │     Search Service      │
                                            │                         │
                                            │ Embed Query             │
                                            │ Similarity Search       │
                                            │ Retrieve Top-k Chunks   │
                                            └───────────┬────────────┘
                                                        │
                                                        ▼
                                           ┌──────────────────────────┐
                                           │      LLM Service         │
                                           │                          │
                                           │ Gemini API (BYOK)        │
                                           │ Prompt Construction      │
                                           │ Context + User Query     │
                                           └───────────┬──────────────┘
                                                       │
                                                       ▼
                                            ┌─────────────────────────┐
                                            │   AI Generated Answer   │
                                            └─────────────────────────┘



                ─────────────── Document Ingestion Pipeline ───────────────


          PDF / PPTX / TXT / Markdown / GitHub Repository
                              │
                              ▼
                  Generic Document Loaders
                              │
                              ▼
                   LangChain Text Splitter
                              │
                              ▼
                  Generate Embeddings (Gemini)
                              │
                              ▼
                  Store Vectors in ChromaDB

## Features

- Clerk authentication with Google and email/password sign-in
- Per-user chats, documents, API keys, GitHub connections, indexed files, and vector retrieval
- PDF, PPTX, Markdown, and text ingestion
- GitHub repository import with incremental SHA-based sync
- BYOK model-provider settings (Gemini is active; OpenAI, Anthropic, Groq, and OpenRouter keys are retained for future support)
- Dashboard API for document, repository, chunk, and chat activity

## Installation

1. Copy `backend/.env.example` to `backend/.env` and set the values.
2. Copy `frontend/.env.example` to `frontend/.env` and set your Clerk publishable key.
3. Install backend dependencies: `pip install -r backend/requirements.txt`.
4. Install frontend dependencies: `cd frontend && npm install`.
5. Start the API with `uvicorn app.main:app --reload` from `backend`.
6. Start the UI with `npm run dev` from `frontend`.

## Environment variables

Backend: `DATABASE_URL`, `CLERK_ISSUER_URL`, `CLERK_JWKS_URL`, `APP_SECRET_KEY`, `CORS_ORIGINS`, GitHub OAuth credentials, and Gemini credentials.

Frontend: `VITE_API_BASE_URL` and `VITE_CLERK_PUBLISHABLE_KEY`.

## Deployment

Deploy `frontend` to Vercel and configure both Vite environment variables. Deploy `backend` to Railway or Render with PostgreSQL/Supabase, set `DATABASE_URL`, and set `CORS_ORIGINS` to the Vercel URL. Configure the Clerk allowed origins and GitHub callback URL to match the deployed API.

## Tech stack

Frontend
---------
• React
• Vite
• Tailwind CSS
• Clerk Authentication
• Axios

Backend
--------
• FastAPI
• SQLModel
• SQLAlchemy
• PostgreSQL (Supabase)
• ChromaDB

AI
---
• Gemini API (Bring Your Own API Key)
• LangChain Text Splitter
• Semantic Search (RAG)

Document Processing
-------------------
• PDF Loader
• PPTX Loader
• Markdown Loader
• TXT Loader
• GitHub Repository Import & Incremental Sync

Deployment
----------
Frontend → Vercel
Backend  → Render
Database → Supabase
Vector DB → Chroma Persistent Storage

## Folder structure

`backend/app` contains routes, services, database models, connectors, and RAG modules. `frontend/src` contains pages, components, routes, and API services.

## Screenshots

Add production screenshots here before launch.

## Future improvements

Add provider-specific inference adapters, database migrations, background ingestion jobs, encrypted API-key storage, and usage analytics.
