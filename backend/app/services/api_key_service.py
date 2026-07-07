from sqlmodel import Session , select
from app.db.session import engine

from  app.db.models import APIKey

class APIKeyService:

    @staticmethod
    def get_api_key(
        provider: str,
    ):
        with Session(engine) as session:

            key = session.exec(
                select(APIKey).where(
                    APIKey.provider == provider
                )
            ).first()

            if not key:
                raise Exception(
                    f"{provider} API Key not found"
                )
            
            return key.api_key