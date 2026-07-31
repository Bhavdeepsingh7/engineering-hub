from sqlmodel import Session , select
from app.db.session import engine

from  app.db.models import APIKey

class APIKeyService:

    @staticmethod
    def has_valid_api_key(user_id: str, provider: str) -> bool:
        """Return whether a user has a non-blank key for the provider."""
        with Session(engine) as session:
            key = session.exec(
                select(APIKey).where(
                    APIKey.provider == provider,
                    APIKey.user_id == user_id,
                )
            ).first()

        return bool(key and key.api_key and key.api_key.strip())

    @staticmethod
    def get_available_api_keys(user_id: str, providers: tuple[str, ...]) -> dict[str, str]:
        """Return the configured model-provider keys for one authenticated user."""
        with Session(engine) as session:
            keys = session.exec(
                select(APIKey).where(
                    APIKey.user_id == user_id,
                    APIKey.provider.in_(providers),
                )
            ).all()

        return {key.provider: key.api_key for key in keys}

    @staticmethod
    def get_api_key(
        provider: str, user_id: str,
    ):
        with Session(engine) as session:

            key = session.exec(
                select(APIKey).where(
                    APIKey.provider == provider, APIKey.user_id == user_id
                )
            ).first()

            if not key:
                raise Exception(
                    f"{provider} API Key not found"
                )
            
            return key.api_key
