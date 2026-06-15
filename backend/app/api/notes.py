from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.database import get_db
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate, NoteRead

router = APIRouter(prefix="/notes", tags=["Notes"])

@router.post("/", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
async def create_note(note_in: NoteCreate, db: AsyncSession = Depends(get_db)):
    # For now, hardcode user_id until auth is implemented
    # In reality, this would come from a Depends(get_current_user)
    MOCK_USER_ID = "mock_user_123"
    
    new_note = Note(
        user_id=MOCK_USER_ID,
        title=note_in.title,
        content=note_in.content,
        tags=note_in.tags
    )
    db.add(new_note)
    await db.commit()
    await db.refresh(new_note)
    return new_note

@router.get("/", response_model=List[NoteRead])
async def list_notes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Note))
    notes = result.scalars().all()
    return notes

@router.get("/{note_id}", response_model=NoteRead)
async def get_note(note_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.put("/{note_id}", response_model=NoteRead)
async def update_note(note_id: str, note_in: NoteUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    update_data = note_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(note, key, value)
        
    await db.commit()
    await db.refresh(note)
    return note

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(note_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
        
    await db.delete(note)
    await db.commit()
    return None
