from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class SecurityEvent(BaseModel):
    __tablename__ = "security_events"

    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    event_type = Column(String, nullable=False)
    ip_address = Column(String, nullable=True)
    device = Column(String, nullable=True)

    user = relationship("User", back_populates="security_events")
