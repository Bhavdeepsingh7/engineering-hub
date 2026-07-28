from sqlmodel import Session , select

from app.db.models import APIKey

class SettingsService:

    @staticmethod
    def save_api_key(
        session: Session,
        provider: str,
        api_key: str, user_id: str,
    ):
        existing = session.exec(
            select(APIKey).where(
                APIKey.provider == provider, APIKey.user_id == user_id
            )
        ).first()

        if existing:
            existing.api_key = api_key
            session.add(existing)
            session.commit()

            return {
                "message": f"{provider} API key updated successfully"
            }
        
        key = APIKey(
            provider= provider, user_id=user_id,
            api_key = api_key,
        )

        session.add(key)
        session.commit()
        session.refresh(key)

        return {
            "message": f"{provider} API key saved successfully"
        }
    


    @staticmethod
    def get_api_key_status(
        session: Session,
        provider: str, user_id: str,
    ):
        key = session.exec(
            select(APIKey).where(
                APIKey.provider == provider, APIKey.user_id == user_id
            )
        ).first()

        return {
            "provider": provider,
            "configured": key is not None,
        }
