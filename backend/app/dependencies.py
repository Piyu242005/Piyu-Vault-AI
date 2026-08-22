from fastapi import Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


async def get_current_user(
    x_clerk_user_id: str | None = Header(default=None),
    db: AsyncSession = None,
) -> User:
    if not x_clerk_user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authenticated user")
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database session unavailable")

    result = await db.execute(select(User).where(User.clerk_id == x_clerk_user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User is not synchronized from Clerk")
    return user
