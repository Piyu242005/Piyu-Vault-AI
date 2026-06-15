import os
from langchain_community.embeddings import HuggingFaceEmbeddings

def get_embedding_model() -> HuggingFaceEmbeddings:
    """
    Initializes and returns the local SentenceTransformers embedding model.
    """
    model_name = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    return HuggingFaceEmbeddings(model_name=model_name)
