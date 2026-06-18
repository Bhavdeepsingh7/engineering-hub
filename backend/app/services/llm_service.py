import os
from openai import OpenAI

client = OpenAI(
    api_key = os.environ.get("GEMINI_API_KEY"),
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
You are an Engineering Intelligence Hub.

Answer ONLY using the provided context.

If the answer is not in the context , say:
'I could not find that information in the uploaded documents.
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