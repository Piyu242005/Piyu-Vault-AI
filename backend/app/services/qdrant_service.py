import os
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from langchain_qdrant import QdrantVectorStore
from app.services.embedding_service import get_embedding_model

def get_qdrant_client() -> QdrantClient:
    """
    Initializes the Qdrant client.
    """
    url = os.getenv("QDRANT_URL", "http://localhost:6333")
    return QdrantClient(url=url)

def initialize_qdrant_collection():
    """
    Creates the collection in Qdrant if it does not exist.
    """
    client = get_qdrant_client()
    collection_name = os.getenv("COLLECTION_NAME", "piyu_vault")
    
    # Check if collection exists
    if not client.collection_exists(collection_name):
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE), # 384 is size of all-MiniLM-L6-v2
        )
        print(f"Created Qdrant collection: {collection_name}")

def get_vector_store() -> QdrantVectorStore:
    """
    Returns the LangChain Qdrant vector store interface.
    """
    client = get_qdrant_client()
    collection_name = os.getenv("COLLECTION_NAME", "piyu_vault")
    embeddings = get_embedding_model()
    
    return QdrantVectorStore(
        client=client,
        collection_name=collection_name,
        embedding=embeddings
    )
