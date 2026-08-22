from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.user import User


async def get_current_user(
    x_clerk_user_id: str | None = Header(default=None),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not x_clerk_user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authenticated user")

    result = await db.execute(select(User).where(User.clerk_id == x_clerk_user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User is not synchronized from Clerk")
    return user
