from pathlib import Path
import os
import uuid

from app.services.supabase_service import upload_file, delete_file as supabase_delete

MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", str(25 * 1024 * 1024)))


def safe_storage_name(original_name: str) -> str:
    name = Path(original_name).name.replace("..", "_")
    stem = Path(name).stem[:80] or "file"
    suffix = Path(name).suffix.lower()[:20]
    return f"{uuid.uuid4().hex}_{stem}{suffix}"


def validate_size(size: int) -> None:
    if size > MAX_FILE_SIZE:
        raise ValueError(f"File exceeds the {MAX_FILE_SIZE // (1024 * 1024)} MB limit")


def storage_path(user_id: str, storage_name: str) -> str:
    # User IDs are used as the first path segment so files remain isolated per user.
    clean_user_id = Path(user_id).name
    clean_name = Path(storage_name).name
    return f"{clean_user_id}/{clean_name}"


def save_bytes(user_id: str, filename: str, content: bytes, content_type: str | None = None) -> str:
    validate_size(len(content))
    storage_name = safe_storage_name(filename)
    upload_file(storage_path(user_id, storage_name), content, content_type)
    return storage_name


def delete(user_id: str, storage_name: str) -> None:
    supabase_delete(storage_path(user_id, storage_name))
