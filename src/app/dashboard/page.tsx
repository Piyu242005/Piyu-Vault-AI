"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Files, Search, HardDrive, ShieldCheck, UploadCloud, PlusSquare, Wand2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Stats = { files: number; notes: number; searches: number; storage: number };

type Activity = { id: string; action: string; item: string | null; created_at: string };

export default function DashboardPage() {
  const [firstName, setFirstName] = useState("Vault User");
  const [stats, setStats] = useState<Stats>({ files: 0, notes: 0, searches: 0, storage: 0 });
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData.user) {
        setError("Please sign in to access your vault.");
        setLoading(false);
        return;
      }
      const metadata = userData.user.user_metadata;
      setFirstName(metadata?.first_name || metadata?.full_name || metadata?.name || userData.user.email?.split("@")[0] || "Vault User");

      const [files, notes, searchLogs, logs, storageRows] = await Promise.all([
        supabase.from("vault_files").select("id", { count: "exact", head: true }),
        supabase.from("notes").select("id", { count: "exact", head: true }),
        supabase.from("activity_logs").select("id", { count: "exact", head: true }).eq("action", "ai_search"),
        supabase.from("activity_logs").select("id, action, item, created_at").order("created_at", { ascending: false }).limit(6),
        supabase.from("vault_files").select("size_bytes"),
      ]);

      const queryErrors = [files.error, notes.error, searchLogs.error, logs.error, storageRows.error].filter(Boolean);
      if (queryErrors.length) setError("Some live vault metrics could not be loaded.");

      const storage = (storageRows.data ?? []).reduce((total, row) => total + Number(row.size_bytes ?? 0), 0);
      setStats({ files: files.count ?? 0, notes: notes.count ?? 0, searches: searchLogs.count ?? 0, storage });
      setActivity((logs.data ?? []) as Activity[]);
      setLoading(false);
    };
    void load();
  }, []);

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
  };

  const statsList = [
    { label: "Total Files", value: loading ? "—" : String(stats.files), icon: Files, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Notes", value: loading ? "—" : String(stats.notes), icon: FileText, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "AI Searches", value: loading ? "—" : String(stats.searches), icon: Search, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Storage", value: loading ? "—" : formatBytes(stats.storage), icon: HardDrive, color: "text-orange-400", bg: "bg-orange-400/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="relative overflow-hidden rounded-3xl border border-vault-border bg-vault-card/50 p-8 lg:p-12">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-vault-primary/20 blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-vault-primary">Live Vault</p>
          <h1 className="mb-2 text-3xl font-bold text-white lg:text-4xl">Welcome back, {firstName} 👋</h1>
          <p className="mb-8 max-w-2xl text-lg text-vault-muted">Your dashboard is connected to your authenticated Supabase data.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/files" className="flex items-center gap-2 rounded-xl bg-vault-text px-6 py-3 font-semibold text-vault-bg hover:bg-zinc-200"><UploadCloud className="h-5 w-5" />Upload File</Link>
            <Link href="/notes" className="flex items-center gap-2 rounded-xl border border-vault-border bg-vault-card px-6 py-3 font-medium text-white hover:bg-vault-border/50"><PlusSquare className="h-5 w-5 text-emerald-400" />Create Note</Link>
            <Link href="/ai" className="flex items-center gap-2 rounded-xl border border-vault-primary/30 bg-vault-primary/10 px-6 py-3 font-medium text-vault-primary hover:bg-vault-primary/20"><Wand2 className="h-5 w-5" />AI Search</Link>
          </div>
        </div>
      </section>

      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statsList.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="rounded-2xl border border-vault-border bg-vault-card p-5"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}><Icon className={`h-5 w-5 ${stat.color}`} /></div><p className="mb-1 text-sm font-medium text-vault-muted">{stat.label}</p><h3 className="text-2xl font-bold text-white">{stat.value}</h3></div>; })}
        <div className="rounded-2xl border border-vault-border bg-vault-card p-5"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10"><ShieldCheck className="h-5 w-5 text-emerald-400" /></div><p className="mb-1 text-sm font-medium text-vault-muted">Auth</p><h3 className="text-2xl font-bold text-white">Verified</h3></div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-vault-border bg-vault-card p-6">
          <div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold text-white">Recent Activity</h2><Link href="/analytics" className="text-sm font-medium text-vault-primary hover:text-vault-accent">View Analytics</Link></div>
          <div className="space-y-3">{activity.length === 0 ? <p className="rounded-2xl border border-dashed border-vault-border p-6 text-center text-sm text-vault-muted">No activity yet. Upload a file, create a note or run an AI search to start building your history.</p> : activity.map((log) => <div key={log.id} className="flex items-center justify-between gap-4 rounded-2xl border border-vault-border/50 bg-vault-bg/50 p-4"><div className="flex min-w-0 items-center gap-4"><div className="h-2 w-2 shrink-0 rounded-full bg-vault-primary" /><div className="min-w-0"><p className="text-sm font-medium text-white">{log.action}</p><p className="truncate text-xs text-vault-muted">{log.item || "Vault activity"}</p></div></div><span className="shrink-0 text-xs text-vault-muted">{new Date(log.created_at).toLocaleString()}</span></div>)}</div>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-vault-border bg-gradient-to-b from-vault-card to-vault-bg p-6 text-center"><ShieldCheck className="mx-auto mb-4 h-16 w-16 text-vault-primary" /><h3 className="mb-2 text-lg font-bold text-white">Vault Protection</h3><p className="mb-6 text-sm text-vault-muted">Authenticated access and row-level security protect your personal data.</p><Link href="/security" className="relative z-10 inline-flex rounded-xl border border-vault-border px-5 py-2.5 text-sm font-medium text-white hover:bg-vault-border/50">Open Security</Link></div>
      </section>
    </div>
  );
}
