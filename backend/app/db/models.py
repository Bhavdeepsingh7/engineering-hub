from typing import Optional
from datetime import datetime

from sqlmodel import SQLModel , Field

class Chat(SQLModel, table = True):
    id: Optional[int] = Field(default=None, primary_key = True)

    title: str
    user_id: str = Field(index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)

    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Message(SQLModel , table = True):
    id: Optional[int] = Field(default=None, primary_key = True)

    chat_id: int = Field(foreign_key="chat.id")
    user_id: str = Field(index=True)

    role: str

    content: str

    timestamp: datetime = Field(default_factory = datetime.utcnow)


class GitHubConnection(SQLModel , table = True):

    id: Optional[int] =  Field(default=None, primary_key = True)
    github_id: int
    user_id: str = Field(index=True)
    github_username: str

    access_token: str

    created_at: datetime = Field(default_factory= datetime.utcnow)

class APIKey(SQLModel, table = True):
    id: int | None = Field(default=None, primary_key= True)

    provider: str
    user_id: str = Field(index=True)

    api_key : str


class GitHubIndexedFile(SQLModel, table=True):
    id: int | None = Field(default =None, primary_key = True)

    owner: str
    user_id: str = Field(index=True)
    repo: str

    path: str
    sha: str

    indexed_at: datetime = Field(default_factory = datetime.utcnow)


class Document(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    filename: str
    stored_filename: str
    chunk_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
