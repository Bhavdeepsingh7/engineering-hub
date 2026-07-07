import os
from openai import OpenAI
from app.services.api_key_service import APIKeyService

client = OpenAI(
    api_key = APIKeyService.get_api_key("gemini"),
    base_url= "https://generativelanguage.googleapis.com/v1beta/openai/"
)

class LLMService:
    @staticmethod
    def generate_response(question , context):

        response = client.chat.completions.create(
            model = "gemini-2.5-flash",
            messages = [
                {
                    "role": "system",
                    "content": """
You are an engineering documentation assistant.

The following context was retrieved from uploaded documents.

Answer the user's question based on the context.

If the context contains relevant information, summarize it.

Only say "I could not find that information in the uploaded documents"
when the context is completely unrelated.
"""
                },
                {
                    "role": "user",
                    "content": f"""
context: 
{context}

Question:
{question}

"""

                }
            ]
        )

        return response.choices[0].message.content