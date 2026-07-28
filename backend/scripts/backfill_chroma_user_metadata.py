"""Backfill ownership metadata for legacy Chroma vectors.

Legacy vectors created before Clerk user scoping have no ``user_id`` metadata.
They are intentionally excluded by the authenticated retrieval filter.  Ownership
cannot be inferred safely, so this tool requires an explicit Clerk user ID and a
separate ``--apply`` opt-in.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

# Make ``python scripts/backfill_chroma_user_metadata.py`` work from backend.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.rag.vectorstore.chroma_store import get_collection


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--user-id", required=True, help="Clerk user ID that owns the selected vectors.")
    parser.add_argument(
        "--source",
        action="append",
        default=[],
        help="Legacy source to backfill. Repeat for multiple sources.",
    )
    parser.add_argument(
        "--all-unowned",
        action="store_true",
        help="Select every legacy vector without user_id metadata. Use only for a single-user collection.",
    )
    parser.add_argument("--apply", action="store_true", help="Persist the metadata update; otherwise only report it.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.source and not args.all_unowned:
        raise SystemExit("Select at least one --source, or explicitly pass --all-unowned.")

    collection = get_collection()
    records = collection.get(include=["metadatas"])
    selected: list[tuple[str, dict]] = []

    for vector_id, metadata in zip(records["ids"], records["metadatas"]):
        metadata = metadata or {}
        if metadata.get("user_id"):
            continue
        if args.all_unowned or metadata.get("source") in args.source:
            selected.append((vector_id, {**metadata, "user_id": args.user_id}))

    print(f"Selected {len(selected)} unowned vectors for Clerk user {args.user_id!r}.")
    if not args.apply:
        print("Dry run only. Re-run with --apply after confirming the ownership selection.")
        return

    if selected:
        collection.update(
            ids=[vector_id for vector_id, _ in selected],
            metadatas=[metadata for _, metadata in selected],
        )
    print("Backfill complete.")


if __name__ == "__main__":
    main()
