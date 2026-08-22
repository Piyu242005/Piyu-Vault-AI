from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.ai import SearchQuery, EmbedRequest, SearchResult, ChatRequest, ChatResponse
from app.services.ingestion_service import ingestion_service
from app.services.rag_service import rag_service
from app.services.qdrant_service import initialize_qdrant_collection

router = APIRouter(prefix="/ai", tags=["AI & RAG"])

@router.on_event("startup")
async def startup_event():
    initialize_qdrant_collection()

@router.post("/embed", status_code=status.HTTP_201_CREATED)
async def embed_text(request: EmbedRequest, user: User = Depends(get_current_user)):
    try:
        metadata = dict(request.metadata or {})
        metadata["user_id"] = user.id
        doc_ids = ingestion_service.ingest_text(request.text, metadata)
        return {"message": "Text successfully embedded and stored.", "document_ids": doc_ids}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to embed text: {str(e)}")

@router.post("/search", response_model=list[SearchResult])
async def search_vectors(request: SearchQuery, user: User = Depends(get_current_user)):
    try:
        return rag_service.search(request.query, request.limit, user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat_rag(request: ChatRequest, user: User = Depends(get_current_user)):
    try:
        return rag_service.chat(request.question, user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat generation failed: {str(e)}")
