import os
from langchain_openai import ChatOpenAI
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from app.services.qdrant_service import get_vector_store
from app.schemas.ai import ChatResponse, SearchResult

class RAGService:
    def _get_llm(self):
        # OpenAI LLM for generating answers
        # Ensure OPENAI_API_KEY is set in environment
        # Return a mock or lazy init if key not set (for docs generation)
        api_key = os.getenv("OPENAI_API_KEY", "dummy_key")
        return ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=api_key)

    def _get_retrieval_chain(self):
        store = get_vector_store()
        retriever = store.as_retriever(search_kwargs={"k": 4})
        llm = self._get_llm()
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant for Piyu Vault AI. Use the following context to answer the user's question.\n\nContext:\n{context}"),
            ("user", "{input}")
        ])
        
        document_chain = create_stuff_documents_chain(llm, prompt)
        return create_retrieval_chain(retriever, document_chain)

    def search(self, query: str, limit: int = 5) -> list[SearchResult]:
        """
        Performs a semantic search returning the raw chunks.
        """
        store = get_vector_store()
        docs_with_scores = store.similarity_search_with_score(query, k=limit)
        
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
        chain = self._get_retrieval_chain()
        response = chain.invoke({"input": question})
        
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
