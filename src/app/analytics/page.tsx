"use client";

import { useEffect, useState } from "react";
import { Activity, FileText, Search, StickyNote } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Metric = { label: string; value: number; icon: typeof Activity };

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: "Files", value: 0, icon: FileText },
    { label: "Notes", value: 0, icon: StickyNote },
    { label: "Activity events", value: 0, icon: Activity },
    { label: "AI searches", value: 0, icon: Search },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData.user) {
        setError("Please sign in to view analytics.");
        setLoading(false);
        return;
      }

      const [files, notes, activity] = await Promise.all([
        supabase.from("vault_files").select("id", { count: "exact", head: true }),
        supabase.from("notes").select("id", { count: "exact", head: true }),
        supabase.from("activity_logs").select("id", { count: "exact", head: true }),
      ]);

      const queryErrors = [files.error, notes.error, activity.error].filter(Boolean);
      if (queryErrors.length) setError("Some analytics data could not be loaded.");

      const aiCount = (await supabase.from("activity_logs").select("id", { count: "exact", head: true }).eq("action", "ai_search")).count ?? 0;
      setMetrics([
        { label: "Files", value: files.count ?? 0, icon: FileText },
        { label: "Notes", value: notes.count ?? 0, icon: StickyNote },
        { label: "Activity events", value: activity.count ?? 0, icon: Activity },
        { label: "AI searches", value: aiCount, icon: Search },
      ]);
      setLoading(false);
    };
    void load();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-6">
      <section className="rounded-3xl border border-vault-border bg-vault-card p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vault-primary">Live telemetry</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Analytics</h1>
        <p className="mt-2 text-vault-muted">Metrics are read from your authenticated Supabase data.</p>
      </section>
      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-vault-border bg-vault-card p-5">
            <Icon className="text-vault-primary" size={20} />
            <p className="mt-4 text-sm text-vault-muted">{label}</p>
            <p className="mt-1 text-3xl font-bold text-white">{loading ? "—" : value}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
