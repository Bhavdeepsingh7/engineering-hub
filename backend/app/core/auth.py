"""Clerk JWT authentication dependencies."""
import os
from functools import lru_cache
from pathlib import Path

import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# Keep the dependency usable in isolation (including tests and workers) and
# avoid relying on imports elsewhere in the application to load configuration.
load_dotenv(Path(__file__).resolve().parents[2] / ".env")

security = HTTPBearer(auto_error=False)


@lru_cache
def _jwks_client():
    jwks_url = os.getenv("CLERK_JWKS_URL")
    if not jwks_url:
        issuer = os.getenv("CLERK_ISSUER_URL", "").rstrip("/")
        jwks_url = f"{issuer}/.well-known/jwks.json" if issuer else ""
    if not jwks_url:
        raise RuntimeError("CLERK_JWKS_URL or CLERK_ISSUER_URL must be configured")
    return jwt.PyJWKClient(jwks_url)


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> str:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    try:
        token = credentials.credentials
        signing_key = _jwks_client().get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=os.getenv("CLERK_ISSUER_URL") or None,
            options={"verify_aud": False},
        )
        return claims["sub"]
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Authentication is not configured") from exc
    except (jwt.PyJWTError, KeyError) as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token") from exc
