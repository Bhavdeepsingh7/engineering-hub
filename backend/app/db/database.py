from sqlmodel import SQLModel , create_engine

DATABASE_URL = "sqlite:///engineering_hub.db"

engine = create_engine(
    DATABASE_URL,
    echo=True
)