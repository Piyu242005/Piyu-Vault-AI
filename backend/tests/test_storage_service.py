from pathlib import Path

import pytest


def test_safe_storage_name_is_path_safe():
    from app.services import storage_service

    name = storage_service.safe_storage_name("../../secret.txt")
    assert Path(name).name == name
    assert name.endswith("_secret.txt")


def test_storage_path_is_user_scoped():
    from app.services import storage_service

    assert storage_service.storage_path("user-1", "abc.txt") == "user-1/abc.txt"
    assert storage_service.storage_path("user-1", "../abc.txt") == "user-1/abc.txt"


def test_rejects_oversized_file():
    from app.services import storage_service

    original = storage_service.MAX_FILE_SIZE
    storage_service.MAX_FILE_SIZE = 4
    try:
        with pytest.raises(ValueError):
            storage_service.validate_size(5)
    finally:
        storage_service.MAX_FILE_SIZE = original
