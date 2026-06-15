from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from app.services.qdrant_service import get_vector_store
from typing import List, Dict, Any

class IngestionService:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )
        self.vector_store = get_vector_store()

    def ingest_text(self, text: str, metadata: Dict[str, Any] = None) -> List[str]:
        """
        Chunks the text and stores it in the vector database.
        Returns the list of document IDs created.
        """
        if metadata is None:
            metadata = {}
            
        # 1. Chunk Text
        chunks = self.text_splitter.split_text(text)
        
        # 2. Create Documents
        documents = [Document(page_content=chunk, metadata=metadata) for chunk in chunks]
        
        # 3. Store in Qdrant
        return self.vector_store.add_documents(documents)
        
ingestion_service = IngestionService()
