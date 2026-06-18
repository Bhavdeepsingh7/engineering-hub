import os 
from dotenv import load_dotenv

from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

embeddings = GoogleGenerativeAIEmbeddings(
    model = "gemini-embedding-001",
    google_api_key = os.environ.get("GEMINI_API_KEY")
)

def get_embedding_model():
    return embeddings

