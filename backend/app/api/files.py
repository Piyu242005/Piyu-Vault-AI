from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.database import get_db
from app.models.document import Document
from app.schemas.document import DocumentRead

router = APIRouter(prefix="/files", tags=["Files"])

@router.get("/", response_model=List[DocumentRead])
async def list_files(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document))
    files = result.scalars().all()
    return files

@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(file_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).where(Document.id == file_id))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
        
    await db.delete(doc)
    await db.commit()
    return None
