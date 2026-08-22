from pathlib import Path
import os
import uuid

STORAGE_ROOT = Path(os.getenv("STORAGE_ROOT", "./storage")).resolve()
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", str(25 * 1024 * 1024)))


def user_storage_dir(user_id: str) -> Path:
    directory = STORAGE_ROOT / user_id
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def safe_storage_name(original_name: str) -> str:
    name = Path(original_name).name.replace("..", "_")
    stem = Path(name).stem[:80] or "file"
    suffix = Path(name).suffix.lower()[:20]
    return f"{uuid.uuid4().hex}_{stem}{suffix}"


def validate_size(size: int) -> None:
    if size > MAX_FILE_SIZE:
        raise ValueError(f"File exceeds the {MAX_FILE_SIZE // (1024 * 1024)} MB limit")


def absolute_path(user_id: str, storage_name: str) -> Path:
    root = user_storage_dir(user_id).resolve()
    candidate = (root / Path(storage_name).name).resolve()
    if candidate.parent != root:
        raise ValueError("Invalid storage path")
    return candidate


def save_bytes(user_id: str, filename: str, content: bytes) -> str:
    validate_size(len(content))
    storage_name = safe_storage_name(filename)
    path = absolute_path(user_id, storage_name)
    path.write_bytes(content)
    return storage_name


def delete(user_id: str, storage_name: str) -> None:
    path = absolute_path(user_id, storage_name)
    if path.exists():
        path.unlink()
