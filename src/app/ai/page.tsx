"use client";

import { FormEvent, useState } from "react";
import { Bot, Search, Sparkles } from "lucide-react";

type SearchResult = { content: string; score: number; metadata: Record<string, unknown> };
type ChatResponse = { answer: string; sources: SearchResult[] };

export default function AIPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<SearchResult[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  async function ask(event: FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;
    setLoading(true); setError(""); setAnswer(""); setSources([]);
    try {
      const res = await fetch("/api/backend/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: question.trim() }) });
      if (!res.ok) throw new Error((await res.json()).detail || "AI request failed");
      const data: ChatResponse = await res.json();
      setAnswer(data.answer); setSources(data.sources || []);
    } catch (err) { setError(err instanceof Error ? err.message : "AI request failed"); }
    finally { setLoading(false); }
  }

  async function semanticSearch() {
    if (!question.trim()) return;
    setSearching(true); setError("");
    try {
      const res = await fetch("/api/backend/ai/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: question.trim(), limit: 8 }) });
      if (!res.ok) throw new Error((await res.json()).detail || "Search failed");
      setSearchResults(await res.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Search failed"); }
    finally { setSearching(false); }
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-6">
      <section className="rounded-3xl border border-vault-border bg-vault-card p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-vault-primary/10 p-3 text-vault-primary"><Bot /></div><div><h1 className="text-2xl font-bold text-white">Vault Intelligence</h1><p className="text-sm text-vault-muted">Ask questions against your indexed knowledge.</p></div></div>
        <form onSubmit={ask} className="space-y-3">
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask your vault anything…" className="min-h-32 w-full rounded-2xl border border-vault-border bg-vault-bg p-4 text-white outline-none focus:border-vault-primary" />
          <div className="flex flex-wrap gap-3"><button disabled={loading} className="flex items-center gap-2 rounded-xl bg-vault-primary px-5 py-3 font-semibold text-white disabled:opacity-50"><Sparkles size={18} />{loading ? "Thinking…" : "Ask AI"}</button><button type="button" onClick={() => void semanticSearch()} disabled={searching} className="flex items-center gap-2 rounded-xl border border-vault-border px-5 py-3 font-semibold text-white disabled:opacity-50"><Search size={18} />{searching ? "Searching…" : "Semantic Search"}</button></div>
        </form>
        {error && <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
      </section>

      {answer && <section className="rounded-3xl border border-vault-border bg-vault-card p-6"><h2 className="mb-3 font-semibold text-white">Answer</h2><p className="whitespace-pre-wrap leading-7 text-zinc-200">{answer}</p>{sources.length > 0 && <div className="mt-6 space-y-2"><h3 className="text-sm font-semibold text-vault-muted">Sources</h3>{sources.map((source, index) => <div key={index} className="rounded-xl border border-vault-border/60 bg-vault-bg/50 p-3 text-sm text-zinc-300"><span className="mr-2 text-vault-primary">{source.score.toFixed(2)}</span>{source.content}</div>)}</div>}</section>}

      {searchResults.length > 0 && <section className="rounded-3xl border border-vault-border bg-vault-card p-6"><h2 className="mb-4 font-semibold text-white">Semantic Results</h2><div className="space-y-3">{searchResults.map((result, index) => <article key={index} className="rounded-2xl border border-vault-border/60 p-4"><div className="mb-2 text-xs text-vault-primary">Relevance {result.score.toFixed(3)}</div><p className="text-sm leading-6 text-zinc-300">{result.content}</p></article>)}</div></section>}
    </main>
  );
}
