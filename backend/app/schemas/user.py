from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.user import Role

class UserRead(BaseModel):
    id: str
    clerk_id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    image_url: Optional[str] = None
    role: Role
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
