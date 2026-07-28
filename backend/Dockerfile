FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

RUN useradd --create-home appuser && mkdir -p /data/chroma /data/uploads && chown -R appuser:appuser /app /data
USER appuser

ENV CHROMA_PATH=/data/chroma \
    UPLOAD_DIR=/data/uploads

CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
