import os

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from qdrant_client.http.models import Filter, FieldCondition, MatchValue

from app.schemas.ai import ChatResponse, SearchResult
from app.services.qdrant_service import get_vector_store


class RAGService:
    def _get_llm(self):
        return ChatOpenAI(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            temperature=0,
            api_key=os.getenv("OPENAI_API_KEY", "dummy_key"),
        )

    def _user_filter(self, user_id: str) -> Filter:
        return Filter(must=[FieldCondition(key="user_id", match=MatchValue(value=user_id))])

    def search(self, query: str, limit: int = 5, user_id: str | None = None) -> list[SearchResult]:
        store = get_vector_store()
        kwargs = {"k": limit}
        if user_id:
            kwargs["filter"] = self._user_filter(user_id)
        docs_with_scores = store.similarity_search_with_score(query, **kwargs)
        return [SearchResult(content=doc.page_content, score=score, metadata=doc.metadata) for doc, score in docs_with_scores]

    def chat(self, question: str, user_id: str | None = None) -> ChatResponse:
        store = get_vector_store()
        kwargs = {"k": 4}
        if user_id:
            kwargs["filter"] = self._user_filter(user_id)
        docs = store.similarity_search(question, **kwargs)
        context = "\n\n---\n\n".join(doc.page_content for doc in docs)
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are Piyu Vault AI. Answer only from the supplied vault context. If the context does not contain the answer, say you do not have enough information.\n\nContext:\n{context}"),
            ("user", "{question}"),
        ])
        response = self._get_llm().invoke(prompt.format_messages(context=context, question=question))
        sources = [SearchResult(content=doc.page_content, score=1.0, metadata=doc.metadata) for doc in docs]
        return ChatResponse(answer=str(response.content), sources=sources)


rag_service = RAGService()
