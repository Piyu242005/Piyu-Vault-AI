from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.database import get_db
from app.models.activity_log import ActivityLog
from app.schemas.activity_log import ActivityLogRead

router = APIRouter(prefix="/activity-logs", tags=["Activity Logs"])

@router.get("/", response_model=List[ActivityLogRead])
async def list_activity_logs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ActivityLog).order_by(ActivityLog.created_at.desc()))
    logs = result.scalars().all()
    return logs
