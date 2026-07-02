from typing import Optional
from datetime import datetime

from sqlmodel import SQLModel , Field

class Chat(SQLModel, table = True):
    id: Optional[int] = Field(default=None, primary_key = True)

    title: str

    created_at: datetime = Field(default_factory=datetime.utcnow)

    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Message(SQLModel , table = True):
    id: Optional[int] = Field(default=None, primary_key = True)

    chat_id: int = Field(foreign_key="chat.id")

    role: str

    content: str

    timestamp: datetime = Field(default_factory = datetime.utcnow)


class GitHubConnection(SQLModel , table = True):

    id: Optional[int] =  Field(default=None, primary_key = True)

    github_id: int
    github_username: str

    access_token: str

    created_at: datetime = Field(default_factory= datetime.utcnow)