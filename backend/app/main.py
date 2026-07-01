from fastapi import FastAPI
from app.api.routes import health, documents, search, chat, chats
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel


from app.db.database import engine
from app.db import models


app = FastAPI(
    title="Engineering Intelligence Hub",
    version="1.0.0",
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# health check route
app.include_router(
    health.router,
    prefix="/health",
    tags= ["Health"]
)

# document upload route
app.include_router(
    documents.router,
    prefix="/documents",
    tags=["Documents"]
)

app.include_router(
    search.router,
    prefix="/search",
    tags=["Search"]
)

app.include_router(
    chat.router,
    prefix="/chat",
    tags=["Chat"]
)

app.include_router(chats.router)


@app.get("/")
def root():
    return {
        "message": "Engineering Intelligence Hub API is running",
    }

