from pathlib import Path

import pytest


def test_storage_helpers_use_safe_names(monkeypatch, tmp_path):
    monkeypatch.setenv("STORAGE_ROOT", str(tmp_path))
    from app.services import storage_service

    storage_service.STORAGE_ROOT = Path(tmp_path)
    name = storage_service.safe_storage_name("../../secret.txt")
    assert Path(name).name == name
    assert name.endswith("_secret.txt")


def test_save_delete_bytes(monkeypatch, tmp_path):
    monkeypatch.setenv("STORAGE_ROOT", str(tmp_path))
    from app.services import storage_service

    storage_service.STORAGE_ROOT = Path(tmp_path)
    stored = storage_service.save_bytes("user-1", "notes.txt", b"hello")
    path = storage_service.absolute_path("user-1", stored)
    assert path.read_bytes() == b"hello"

    storage_service.delete("user-1", stored)
    assert not path.exists()


def test_rejects_oversized_file(monkeypatch, tmp_path):
    monkeypatch.setenv("STORAGE_ROOT", str(tmp_path))
    from app.services import storage_service

    storage_service.STORAGE_ROOT = Path(tmp_path)
    storage_service.MAX_FILE_SIZE = 4
    with pytest.raises(ValueError):
        storage_service.save_bytes("user-1", "large.txt", b"12345")
