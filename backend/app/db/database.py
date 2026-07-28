import os
from sqlmodel import SQLModel, create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///engineering_hub.db")

engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)
