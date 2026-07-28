import os
import httpx
from openai import OpenAI
from app.services.api_key_service import APIKeyService


SYSTEM_PROMPT = """
You are an engineering documentation assistant.

The following context was retrieved from uploaded documents.

Answer the user's question based on the context.

If the context contains relevant information, summarize it.

Only say "I could not find that information in the uploaded documents"
when the context is completely unrelated.
"""


class LLMService:
    # OpenAI-compatible providers can share the OpenAI client. Anthropic uses
    # its Messages API directly, so it does not require another SDK.
    PROVIDERS = {
        "gemini": {
            "model": "gemini-2.5-flash",
            "base_url": "https://generativelanguage.googleapis.com/v1beta/openai/",
        },
        "openai": {"model": "gpt-4o-mini", "base_url": None},
        "groq": {"model": "llama-3.3-70b-versatile", "base_url": "https://api.groq.com/openai/v1"},
        "openrouter": {"model": "openai/gpt-4o-mini", "base_url": "https://openrouter.ai/api/v1"},
        "anthropic": {"model": "claude-3-5-haiku-latest", "base_url": None},
    }
    PROVIDER_ORDER = ("openai", "anthropic", "groq", "openrouter", "gemini")

    @classmethod
    def _get_provider_and_key(cls, user_id: str) -> tuple[str, str]:
        configured_keys = APIKeyService.get_available_api_keys(user_id, cls.PROVIDER_ORDER)
        requested_provider = os.getenv("LLM_PROVIDER", "").strip().lower()

        if requested_provider:
            if requested_provider not in cls.PROVIDERS:
                raise ValueError(f"Unsupported LLM_PROVIDER: {requested_provider}")
            if requested_provider not in configured_keys:
                raise ValueError(f"No {requested_provider} API key is configured for this user")
            return requested_provider, configured_keys[requested_provider]

        for provider in cls.PROVIDER_ORDER:
            if provider in configured_keys:
                return provider, configured_keys[provider]

        raise ValueError("No supported model-provider API key is configured for this user")

    @staticmethod
    def generate_response(question, context, user_id: str):
        provider, api_key = LLMService._get_provider_and_key(user_id)

        if provider == "anthropic":
            response = httpx.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": LLMService.PROVIDERS[provider]["model"],
                    "max_tokens": 1024,
                    "system": SYSTEM_PROMPT,
                    "messages": [{"role": "user", "content": f"context:\n{context}\n\nQuestion:\n{question}"}],
                },
                timeout=60,
            )
            response.raise_for_status()
            return response.json()["content"][0]["text"]

        config = LLMService.PROVIDERS[provider]
        client = OpenAI(
            api_key=api_key,
            base_url=config["base_url"],
        )

        response = client.chat.completions.create(
            model=config["model"],
            messages = [
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": f"context:\n{context}\n\nQuestion:\n{question}",

                }
            ]
        )

        return response.choices[0].message.content
