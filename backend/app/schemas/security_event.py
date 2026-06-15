from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class SecurityEventRead(BaseModel):
    id: str
    user_id: str
    event_type: str
    ip_address: Optional[str] = None
    device: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
