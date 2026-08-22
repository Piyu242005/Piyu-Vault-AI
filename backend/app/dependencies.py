import os

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from supabase import create_client

from app.db.database import get_db
from app.models.user import User


def _supabase_client():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise HTTPException(status_code=500, detail="Supabase server configuration is missing")
    return create_client(url, key)


async def get_current_user(
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")

    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid bearer token")

    try:
        result = _supabase_client().auth.get_user(token)
        auth_user = result.user
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired access token") from exc

    if not auth_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authenticated user")

    result = await db.execute(select(User).where(User.auth_id == auth_user.id))
    user = result.scalar_one_or_none()

    if not user:
        metadata = auth_user.user_metadata or {}
        user = User(
            auth_id=auth_user.id,
            email=auth_user.email or f"{auth_user.id}@local.invalid",
            first_name=metadata.get("first_name") or metadata.get("firstName"),
            last_name=metadata.get("last_name") or metadata.get("lastName"),
            image_url=metadata.get("avatar_url") or metadata.get("image_url"),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return user
