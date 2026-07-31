import logging
import time
import uuid

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.api.routes import health, documents, search, chat, chats, settings, dashboard
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.connectors.github.router import router as github_router

from app.core.config import CORS_ORIGINS, UPLOAD_DIR, validate_startup_configuration
from app.core.errors import NoAPIKeyConfiguredError

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Engineering Intelligence Hub",
    version="1.0.0",
)


@app.exception_handler(NoAPIKeyConfiguredError)
async def no_api_key_error_handler(_request: Request, exc: NoAPIKeyConfiguredError):
    return JSONResponse(
        status_code=400,
        content={"error": exc.error, "message": exc.message},
    )

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        started = time.perf_counter()
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        logger.info("http.request request_id=%s method=%s path=%s status=%s duration_ms=%d", request_id, request.method, request.url.path, response.status_code, (time.perf_counter() - started) * 1000)
        return response


@app.on_event("startup")
def on_startup():
    # Schema creation is performed only through Alembic migrations.
    validate_startup_configuration()
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    logger.info("application.started")


app.add_middleware(SecurityHeadersMiddleware)


app.add_middleware(
    CORSMiddleware,
    allow_origins=list(CORS_ORIGINS),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# health check route
app.include_router(
    health.router,
    prefix="/health",
    tags= ["Health"]
)

# document upload route
app.include_router(
    documents.router,
    prefix="/documents",
    tags=["Documents"]
)

app.include_router(
    search.router,
    prefix="/search",
    tags=["Search"]
)

app.include_router(
    chat.router,
    prefix="/chat",
    tags=["Chat"]
)

app.include_router(chats.router)

app.include_router(github_router)

app.include_router(settings.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {
        "message": "Engineering Intelligence Hub API is running",
    }

