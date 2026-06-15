from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ActivityLogRead(BaseModel):
    id: str
    user_id: str
    action: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
