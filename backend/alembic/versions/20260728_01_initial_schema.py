"""Create the application schema.

Revision ID: 20260728_01
Revises:
"""
from alembic import op
import sqlalchemy as sa

revision = "20260728_01"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("chat", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("title", sa.String(), nullable=False), sa.Column("user_id", sa.String(), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False), sa.Column("updated_at", sa.DateTime(), nullable=False))
    op.create_index("ix_chat_user_id", "chat", ["user_id"])
    op.create_table("message", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("chat_id", sa.Integer(), sa.ForeignKey("chat.id", ondelete="CASCADE"), nullable=False), sa.Column("user_id", sa.String(), nullable=False), sa.Column("role", sa.String(), nullable=False), sa.Column("content", sa.String(), nullable=False), sa.Column("timestamp", sa.DateTime(), nullable=False))
    op.create_index("ix_message_user_id", "message", ["user_id"])
    op.create_table("githubconnection", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("github_id", sa.Integer(), nullable=False), sa.Column("user_id", sa.String(), nullable=False), sa.Column("github_username", sa.String(), nullable=False), sa.Column("access_token", sa.String(), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False))
    op.create_index("ix_githubconnection_user_id", "githubconnection", ["user_id"])
    op.create_table("apikey", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("provider", sa.String(), nullable=False), sa.Column("user_id", sa.String(), nullable=False), sa.Column("api_key", sa.String(), nullable=False), sa.UniqueConstraint("user_id", "provider", name="uq_api_key_user_provider"))
    op.create_index("ix_apikey_user_id", "apikey", ["user_id"])
    op.create_table("githubindexedfile", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("owner", sa.String(), nullable=False), sa.Column("user_id", sa.String(), nullable=False), sa.Column("repo", sa.String(), nullable=False), sa.Column("path", sa.String(), nullable=False), sa.Column("sha", sa.String(), nullable=False), sa.Column("indexed_at", sa.DateTime(), nullable=False), sa.UniqueConstraint("user_id", "owner", "repo", "path", name="uq_github_indexed_file"))
    op.create_index("ix_githubindexedfile_user_id", "githubindexedfile", ["user_id"])
    op.create_table("document", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.String(), nullable=False), sa.Column("filename", sa.String(), nullable=False), sa.Column("stored_filename", sa.String(), nullable=False), sa.Column("chunk_count", sa.Integer(), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False))
    op.create_index("ix_document_user_id", "document", ["user_id"])


def downgrade() -> None:
    op.drop_table("document")
    op.drop_table("githubindexedfile")
    op.drop_table("apikey")
    op.drop_table("githubconnection")
    op.drop_table("message")
    op.drop_table("chat")
