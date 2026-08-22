"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at?: string | null;
};

const API = "/api/backend/notes";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadNotes() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API, { cache: "no-store" });
      if (!res.ok) throw new Error((await res.json()).detail || "Unable to load notes");
      setNotes(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load notes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadNotes();
  }, []);

  function newNote() {
    setSelected(null);
    setTitle("");
    setContent("");
    setTags("");
    setError("");
  }

  function selectNote(note: Note) {
    setSelected(note);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(", "));
    setError("");
  }

  async function saveNote(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };
      const res = await fetch(selected ? `${API}/${selected.id}` : API, {
        method: selected ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Unable to save note");
      const saved: Note = await res.json();
      setNotes((current) => selected
        ? current.map((note) => note.id === saved.id ? saved : note)
        : [saved, ...current]);
      selectNote(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save note");
    } finally {
      setSaving(false);
    }
  }

  async function removeNote() {
    if (!selected || !window.confirm("Delete this note?")) return;
    const res = await fetch(`${API}/${selected.id}`, { method: "DELETE" });
    if (!res.ok) {
      setError((await res.json()).detail || "Unable to delete note");
      return;
    }
    setNotes((current) => current.filter((note) => note.id !== selected.id));
    newNote();
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6 lg:grid-cols-[320px_1fr]">
      <section className="rounded-3xl border border-vault-border bg-vault-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Notes</h1>
            <p className="text-sm text-vault-muted">{notes.length} saved</p>
          </div>
          <button onClick={newNote} className="rounded-xl bg-vault-primary p-2.5 text-white" aria-label="New note"><Plus size={18} /></button>
        </div>
        {loading ? <p className="p-4 text-sm text-vault-muted">Loading notes…</p> : notes.length === 0 ? <p className="p-4 text-sm text-vault-muted">No notes yet. Create your first one.</p> : (
          <div className="space-y-2">
            {notes.map((note) => (
              <button key={note.id} onClick={() => selectNote(note)} className={`w-full rounded-2xl border p-4 text-left transition ${selected?.id === note.id ? "border-vault-primary bg-vault-primary/10" : "border-vault-border/60 hover:bg-vault-bg/50"}`}>
                <p className="truncate font-medium text-white">{note.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-vault-muted">{note.content}</p>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-vault-border bg-vault-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div><p className="text-sm text-vault-muted">{selected ? "Edit note" : "New note"}</p><h2 className="text-2xl font-bold text-white">Personal Knowledge</h2></div>
          {selected && <button onClick={newNote} className="rounded-xl p-2 text-vault-muted hover:bg-vault-bg hover:text-white"><X size={18} /></button>}
        </div>
        {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
        <form onSubmit={saveNote} className="space-y-5">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" className="w-full rounded-2xl border border-vault-border bg-vault-bg px-4 py-3 text-white outline-none focus:border-vault-primary" required />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your knowledge here…" className="min-h-[360px] w-full resize-y rounded-2xl border border-vault-border bg-vault-bg px-4 py-3 text-white outline-none focus:border-vault-primary" required />
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags: machine-learning, python, ideas" className="w-full rounded-2xl border border-vault-border bg-vault-bg px-4 py-3 text-white outline-none focus:border-vault-primary" />
          <div className="flex flex-wrap gap-3">
            <button disabled={saving} className="flex items-center gap-2 rounded-xl bg-vault-primary px-5 py-3 font-semibold text-white disabled:opacity-50"><Save size={18} />{saving ? "Saving…" : "Save Note"}</button>
            {selected && <button type="button" onClick={removeNote} className="flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 font-semibold text-red-300 hover:bg-red-500/10"><Trash2 size={18} />Delete</button>}
          </div>
        </form>
      </section>
    </main>
  );
}
