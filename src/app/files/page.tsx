"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Download, FileText, RefreshCw, Trash2, UploadCloud } from "lucide-react";

type Document = { id: string; name: string; file_type: string; size: number; created_at: string };
const API = "/api/backend/files";

export default function FilesPage() {
  const [files, setFiles] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function loadFiles() {
    setLoading(true); setError("");
    try {
      const res = await fetch(API, { cache: "no-store" });
      if (!res.ok) throw new Error((await res.json()).detail || "Unable to load files");
      setFiles(await res.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load files"); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadFiles(); }, []);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true); setError("");
    try {
      const form = new FormData(); form.append("file", file);
      const res = await fetch(`${API}/upload`, { method: "POST", body: form });
      if (!res.ok) throw new Error((await res.json()).detail || "Upload failed");
      const saved: Document = await res.json();
      setFiles((current) => [saved, ...current]);
    } catch (err) { setError(err instanceof Error ? err.message : "Upload failed"); }
    finally { setUploading(false); }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this file?")) return;
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok) { setError((await res.json()).detail || "Unable to delete file"); return; }
    setFiles((current) => current.filter((file) => file.id !== id));
  }

  const formatSize = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1024 ** 2 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 ** 2).toFixed(1)} MB`;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-vault-border bg-vault-card p-6">
        <div><h1 className="text-2xl font-bold text-white">Files</h1><p className="text-sm text-vault-muted">Encrypted-by-boundary user storage with optional AI indexing.</p></div>
        <div className="flex gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-vault-primary px-4 py-3 font-semibold text-white">
            <UploadCloud size={18} />{uploading ? "Uploading…" : "Upload"}<input type="file" className="hidden" onChange={upload} disabled={uploading} />
          </label>
          <button onClick={() => void loadFiles()} className="rounded-xl border border-vault-border p-3 text-vault-muted hover:text-white"><RefreshCw size={18} /></button>
        </div>
      </section>
      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
      <section className="rounded-3xl border border-vault-border bg-vault-card p-4">
        {loading ? <p className="p-6 text-vault-muted">Loading files…</p> : files.length === 0 ? <div className="p-10 text-center"><FileText className="mx-auto mb-3 text-vault-muted" /><p className="text-white">No documents found.</p></div> : <div className="divide-y divide-vault-border/60">{files.map((file) => <div key={file.id} className="flex items-center justify-between gap-4 p-4"><div className="flex min-w-0 items-center gap-3"><div className="rounded-xl bg-vault-primary/10 p-3 text-vault-primary"><FileText size={18} /></div><div className="min-w-0"><p className="truncate font-medium text-white">{file.name}</p><p className="text-xs text-vault-muted">{file.file_type} · {formatSize(file.size)}</p></div></div><div className="flex gap-1"><a href={`${API}/${file.id}/download`} className="rounded-xl p-2 text-vault-muted hover:bg-vault-bg hover:text-white" title="Download"><Download size={18} /></a><button onClick={() => void remove(file.id)} className="rounded-xl p-2 text-red-300 hover:bg-red-500/10" title="Delete"><Trash2 size={18} /></button></div></div>)}</div>}
      </section>
    </main>
  );
}
