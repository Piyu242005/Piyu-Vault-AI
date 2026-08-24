"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Download, FileText, RefreshCw, Trash2, UploadCloud } from "lucide-react";

type Document = { id: string; name: string; file_type: string; size: number; created_at: string };
const API = "/api/backend/files";

export default function FilesPage() {
  const [files, setFiles] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadFiles() {
    setLoading(true); setError("");
    try {
      const res = await fetch(API, { cache: "no-store" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.detail || "Unable to load files");
      setFiles(body);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load files"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void loadFiles(); }, []);

  async function uploadFile(file?: File) {
    if (!file) return;
    setUploading(true); setError("");
    try {
      const form = new FormData(); form.append("file", file);
      const res = await fetch(`${API}/upload`, { method: "POST", body: form });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.detail || "Upload failed");
      setFiles((current) => [body, ...current]);
    } catch (err) { setError(err instanceof Error ? err.message : "Upload failed"); }
    finally { setUploading(false); }
  }
  function onInput(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; event.target.value = ""; void uploadFile(file); }
  function onDrop(event: React.DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(false); void uploadFile(event.dataTransfer.files?.[0]); }
  async function remove(id: string) {
    if (!window.confirm("Delete this file permanently?")) return;
    setError("");
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) { setError(body.detail || "Unable to delete file"); return; }
    setFiles((current) => current.filter((file) => file.id !== id));
  }
  const formatSize = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1024 ** 2 ? `${(bytes / 1024).toFixed(1)} KB` : bytes < 1024 ** 3 ? `${(bytes / 1024 ** 2).toFixed(1)} MB` : `${(bytes / 1024 ** 3).toFixed(1)} GB`;

  return <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
    <section className="rounded-3xl border border-vault-border bg-vault-card p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-vault-primary">Private storage</p><h1 className="mt-2 text-3xl font-bold text-white">Your Files</h1><p className="mt-1 text-sm text-vault-muted">Upload documents to your private vault and make them available to AI.</p></div><button onClick={() => inputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 rounded-xl bg-vault-primary px-5 py-3 font-semibold text-white shadow-lg shadow-vault-primary/20 disabled:opacity-60"><UploadCloud size={18}/>{uploading ? "Uploading…" : "Upload file"}</button><input ref={inputRef} type="file" className="hidden" onChange={onInput} disabled={uploading}/></div>
      <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop} onClick={() => inputRef.current?.click()} className={`mt-6 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${dragging ? "border-vault-primary bg-vault-primary/10" : "border-vault-border hover:border-vault-primary/50 hover:bg-vault-bg/40"}`}><UploadCloud className="mx-auto mb-3 text-vault-primary" size={32}/><p className="font-medium text-white">Drop a file here or click to browse</p><p className="mt-1 text-xs text-vault-muted">Private storage • authenticated access • AI indexing</p></div>
    </section>
    {error && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}
    <section className="rounded-3xl border border-vault-border bg-vault-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold text-white">Vault documents</h2><p className="text-xs text-vault-muted">{loading ? "Loading…" : `${files.length} document${files.length === 1 ? "" : "s"}`}</p></div><button aria-label="Refresh files" onClick={() => void loadFiles()} className="rounded-xl border border-vault-border p-2.5 text-vault-muted hover:bg-vault-bg hover:text-white"><RefreshCw size={18}/></button></div>
      {loading ? <div className="space-y-3">{[1,2,3].map((n) => <div key={n} className="h-16 animate-pulse rounded-2xl bg-vault-bg/70" />)}</div> : files.length === 0 ? <div className="rounded-2xl border border-dashed border-vault-border p-12 text-center"><FileText className="mx-auto mb-3 text-vault-muted"/><p className="font-medium text-white">Your vault is empty</p><p className="mt-1 text-sm text-vault-muted">Upload your first document to start building your private knowledge base.</p></div> : <div className="divide-y divide-vault-border/60">{files.map((file) => <div key={file.id} className="flex items-center justify-between gap-4 py-4"><div className="flex min-w-0 items-center gap-3"><div className="rounded-xl bg-vault-primary/10 p-3 text-vault-primary"><FileText size={18}/></div><div className="min-w-0"><p className="truncate font-medium text-white">{file.name}</p><p className="text-xs text-vault-muted">{file.file_type} · {formatSize(file.size)}</p></div></div><div className="flex shrink-0 gap-1"><a href={`${API}/${file.id}/download`} className="rounded-xl p-2.5 text-vault-muted hover:bg-vault-bg hover:text-white" title="Download"><Download size={18}/></a><button onClick={() => void remove(file.id)} className="rounded-xl p-2.5 text-red-300 hover:bg-red-500/10" title="Delete"><Trash2 size={18}/></button></div></div>)}</div>}
    </section>
  </main>;
}
