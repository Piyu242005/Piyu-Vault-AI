"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, UserRoundCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SecurityCenterPage() {
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) setError("Please sign in to view security information.");
      else {
        setEmail(data.user.email ?? "");
        setVerified(Boolean(data.user.email_confirmed_at));
      }
      setLoading(false);
    };
    void load();
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] p-6 text-[#F5F5F5] lg:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vault-primary">Account security</p>
          <h1 className="mt-2 text-3xl font-bold">Security Center</h1>
          <p className="mt-2 text-gray-400">Live status from Supabase Auth. No fabricated security score.</p>
        </div>
        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <ShieldCheck className="text-emerald-400" />
            <h2 className="mt-4 text-lg font-semibold">Email verification</h2>
            <p className="mt-2 text-sm text-gray-400">{loading ? "Loading…" : verified ? "Your email is verified." : "Your email still needs verification."}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <UserRoundCheck className="text-vault-primary" />
            <h2 className="mt-4 text-lg font-semibold">Authenticated account</h2>
            <p className="mt-2 break-all text-sm text-gray-400">{loading ? "Loading…" : email || "Not signed in"}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
