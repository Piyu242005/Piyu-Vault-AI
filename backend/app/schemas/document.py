from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class DocumentRead(BaseModel):
    id: str
    user_id: str
    name: str
    file_type: str
    size: int
    storage_path: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
