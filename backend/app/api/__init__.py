from fastapi import APIRouter
from .notes import router as notes_router
from .files import router as files_router
from .activity_logs import router as activity_logs_router

api_router = APIRouter()

api_router.include_router(notes_router)
api_router.include_router(files_router)
api_router.include_router(activity_logs_router)
