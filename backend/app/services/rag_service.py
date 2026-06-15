import os
from langchain_openai import ChatOpenAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from app.services.qdrant_service import get_vector_store
from app.schemas.ai import ChatResponse, SearchResult

class RAGService:
    def __init__(self):
        self.vector_store = get_vector_store()
        self.retriever = self.vector_store.as_retriever(search_kwargs={"k": 4})
        
        # OpenAI LLM for generating answers
        # Ensure OPENAI_API_KEY is set in environment
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant for Piyu Vault AI. Use the following context to answer the user's question.\n\nContext:\n{context}"),
            ("user", "{input}")
        ])
        
        self.document_chain = create_stuff_documents_chain(self.llm, self.prompt)
        self.retrieval_chain = create_retrieval_chain(self.retriever, self.document_chain)

    def search(self, query: str, limit: int = 5) -> list[SearchResult]:
        """
        Performs a semantic search returning the raw chunks.
        """
        docs = self.vector_store.similarity_search(query, k=limit)
        # Note: Langchain Qdrant similarity_search doesn't natively return scores in the base method
        # To get scores, use similarity_search_with_score
        docs_with_scores = self.vector_store.similarity_search_with_score(query, k=limit)
        
        results = []
        for doc, score in docs_with_scores:
            results.append(SearchResult(
                content=doc.page_content,
                score=score,
                metadata=doc.metadata
            ))
        return results

    def chat(self, question: str) -> ChatResponse:
        """
        Performs the RAG flow: retrieve relevant chunks, and pass them to the LLM to generate an answer.
        """
        response = self.retrieval_chain.invoke({"input": question})
        
        sources = [
            SearchResult(
                content=doc.page_content,
                score=1.0, # Retrieval chain hides scores, set to 1.0 or modify to use similarity_search_with_score manually
                metadata=doc.metadata
            )
            for doc in response["context"]
        ]
        
        return ChatResponse(
            answer=response["answer"],
            sources=sources
        )

rag_service = RAGService()
