"""Centralized, non-secret application configuration."""
from __future__ import annotations

import logging
import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///engineering_hub.db")
CHROMA_PATH = Path(os.getenv("CHROMA_PATH", str(BASE_DIR / "chroma_db"))).resolve()
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", str(BASE_DIR / "uploads"))).resolve()
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", str(5 * 1024 * 1024)))
CORS_ORIGINS = tuple(origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if origin.strip())


def validate_startup_configuration() -> None:
    """Report incomplete optional integrations without exposing secret values."""
    required_for_auth = ("CLERK_ISSUER_URL", "CLERK_JWKS_URL")
    missing_auth = [name for name in required_for_auth if not os.getenv(name)]
    if missing_auth:
        logger.warning("Clerk authentication is unavailable until %s is configured", ", ".join(missing_auth))

    github_settings = ("GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", "GITHUB_CALLBACK_URL", "APP_SECRET_KEY")
    missing_github = [name for name in github_settings if not os.getenv(name)]
    if missing_github:
        logger.warning("GitHub OAuth is unavailable until %s is configured", ", ".join(missing_github))

    if not CORS_ORIGINS:
        raise RuntimeError("CORS_ORIGINS must contain at least one allowed origin")
    if MAX_UPLOAD_BYTES <= 0:
        raise RuntimeError("MAX_UPLOAD_BYTES must be greater than zero")
