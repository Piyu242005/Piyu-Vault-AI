from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class Note(BaseModel):
    __tablename__ = "notes"

    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    tags = Column(ARRAY(String), default=list)

    user = relationship("User", back_populates="notes")
