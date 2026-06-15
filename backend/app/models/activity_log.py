from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class ActivityLog(BaseModel):
    __tablename__ = "activity_logs"

    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    action = Column(String, nullable=False)

    user = relationship("User", back_populates="activity_logs")
