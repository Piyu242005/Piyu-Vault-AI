"use client";

import { useEffect, useState } from "react";
import { FileText, RefreshCw, Trash2 } from "lucide-react";

type Document = { id: string; name: string; file_type: string; size: number; storage_path: string; created_at: string };

export default function FilesPage() {
  const [files, setFiles] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFiles() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/backend/files", { cache: "no-store" });
      if (!res.ok) throw new Error((await res.json()).detail || "Unable to load files");
      setFiles(await res.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load files"); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadFiles(); }, []);

  async function remove(id: string) {
    if (!window.confirm("Delete this document record?")) return;
    const res = await fetch(`/api/backend/files/${id}`, { method: "DELETE" });
    if (!res.ok) { setError((await res.json()).detail || "Unable to delete file"); return; }
    setFiles((current) => current.filter((file) => file.id !== id));
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-6">
      <section className="flex items-center justify-between rounded-3xl border border-vault-border bg-vault-card p-6"><div><h1 className="text-2xl font-bold text-white">Files</h1><p className="text-sm text-vault-muted">Documents connected to your vault.</p></div><button onClick={() => void loadFiles()} className="rounded-xl border border-vault-border p-3 text-vault-muted hover:text-white"><RefreshCw size={18} /></button></section>
      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
      <section className="rounded-3xl border border-vault-border bg-vault-card p-4">
        {loading ? <p className="p-6 text-vault-muted">Loading files…</p> : files.length === 0 ? <div className="p-10 text-center"><FileText className="mx-auto mb-3 text-vault-muted" /><p className="text-white">No documents found.</p><p className="mt-1 text-sm text-vault-muted">Upload/ingestion can be connected to the storage service next.</p></div> : <div className="divide-y divide-vault-border/60">{files.map((file) => <div key={file.id} className="flex items-center justify-between gap-4 p-4"><div className="flex min-w-0 items-center gap-3"><div className="rounded-xl bg-vault-primary/10 p-3 text-vault-primary"><FileText size={18} /></div><div className="min-w-0"><p className="truncate font-medium text-white">{file.name}</p><p className="text-xs text-vault-muted">{file.file_type} · {formatSize(file.size)}</p></div></div><button onClick={() => void remove(file.id)} className="rounded-xl p-2 text-red-300 hover:bg-red-500/10"><Trash2 size={18} /></button></div>)}</div>}
      </section>
    </main>
  );
}
