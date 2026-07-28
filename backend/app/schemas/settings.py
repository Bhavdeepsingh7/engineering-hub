from typing import Literal
from pydantic import BaseModel, Field

class APIkeyRequest(BaseModel):
    provider: Literal["gemini", "openai", "anthropic", "groq", "openrouter"]
    api_key: str = Field(min_length=1, max_length=1024)
