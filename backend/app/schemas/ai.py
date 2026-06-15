from pydantic import BaseModel
from typing import List, Optional, Any

class SearchQuery(BaseModel):
    query: str
    limit: int = 5

class EmbedRequest(BaseModel):
    text: str
    metadata: Optional[dict[str, Any]] = None

class SearchResult(BaseModel):
    content: str
    score: float
    metadata: dict[str, Any]

class ChatRequest(BaseModel):
    question: str
    
class ChatResponse(BaseModel):
    answer: str
    sources: List[SearchResult]
