import os
from functools import lru_cache
from typing import BinaryIO

from supabase import Client, create_client


@lru_cache(maxsize=1)
def get_supabase() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
    return create_client(url, key)


SUPABASE_BUCKET = os.getenv("SUPABASE_STORAGE_BUCKET", "vault-files")


def upload_file(path: str, content: bytes, content_type: str | None = None) -> None:
    options = {"upsert": "true"}
    if content_type:
        options["content-type"] = content_type
    get_supabase().storage.from_(SUPABASE_BUCKET).upload(path, content, options)


def delete_file(path: str) -> None:
    get_supabase().storage.from_(SUPABASE_BUCKET).remove([path])


def create_signed_url(path: str, expires_in: int = 300) -> str:
    result = get_supabase().storage.from_(SUPABASE_BUCKET).create_signed_url(path, expires_in)
    return result["signedURL"]
