from sqlalchemy import Column, String, Enum
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import enum

class Role(enum.Enum):
    OWNER = "OWNER"
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"

class User(BaseModel):
    __tablename__ = "users"

    auth_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    role = Column(Enum(Role), default=Role.MEMBER, nullable=False)

    notes = relationship("Note", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")
    security_events = relationship("SecurityEvent", back_populates="user", cascade="all, delete-orphan")
