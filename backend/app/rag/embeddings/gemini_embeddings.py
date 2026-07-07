import os 
from sqlmodel import Session
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.services.api_key_service import APIKeyService


def get_embedding_model():
    
    api_key = APIKeyService.get_api_key(
        "gemini",
    )

    return GoogleGenerativeAIEmbeddings(
        model = "gemini-embedding-001",
        google_api_key = api_key
    )

