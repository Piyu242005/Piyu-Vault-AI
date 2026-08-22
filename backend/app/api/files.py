from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import Response, RedirectResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.dependencies import get_current_user
from app.models.activity_log import ActivityLog
from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentRead
from app.services.ingestion_service import ingestion_service
from app.services.storage_service import delete as delete_storage, save_bytes, storage_path
from app.services.supabase_service import create_signed_url, get_supabase, SUPABASE_BUCKET

router = APIRouter(prefix="/files", tags=["Files"])
TEXT_EXTENSIONS = {".txt", ".md", ".csv", ".json", ".py", ".ts", ".tsx", ".js", ".jsx"}


@router.post("/upload", response_model=DocumentRead, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty files are not allowed")
    original_name = Path(file.filename or "file").name
    try:
        storage_name = save_bytes(user.id, original_name, content, file.content_type)
    except ValueError as exc:
        raise HTTPException(status_code=413, detail=str(exc)) from exc

    document = Document(
        user_id=user.id,
        name=original_name,
        file_type=file.content_type or "application/octet-stream",
        size=len(content),
        storage_path=storage_name,
    )
    db.add(document)
    db.add(ActivityLog(user_id=user.id, action=f"Uploaded file: {original_name}"))
    await db.commit()
    await db.refresh(document)

    if Path(original_name).suffix.lower() in TEXT_EXTENSIONS:
        try:
            text = content.decode("utf-8", errors="ignore")
            if text.strip():
                ingestion_service.ingest_text(
                    text,
                    {"user_id": user.id, "document_id": document.id, "source": original_name},
                )
        except Exception:
            pass
    return document


@router.get("/", response_model=list[DocumentRead])
async def list_files(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(
        select(Document).where(Document.user_id == user.id).order_by(Document.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{file_id}/download")
async def download_file(
    file_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Document).where(Document.id == file_id, Document.user_id == user.id)
    )
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        signed_url = create_signed_url(storage_path(user.id, document.storage_path))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Storage error: {exc}") from exc
    return RedirectResponse(signed_url, status_code=307)


@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(
    file_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Document).where(Document.id == file_id, Document.user_id == user.id)
    )
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        delete_storage(user.id, document.storage_path)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Storage delete failed: {exc}") from exc
    db.add(ActivityLog(user_id=user.id, action=f"Deleted file: {document.name}"))
    await db.delete(document)
    await db.commit()
    return None
