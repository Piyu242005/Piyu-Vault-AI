"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData.user) {
        setError("Please sign in to manage settings.");
        return;
      }
      setEmail(userData.user.email ?? "");
      setFullName(userData.user.user_metadata?.full_name ?? userData.user.user_metadata?.name ?? "");
    };
    void load();
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true); setMessage(""); setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    if (authError) {
      setError(authError.message);
      setSaving(false);
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      await supabase.from("profiles").upsert({ id: userData.user.id, full_name: fullName, updated_at: new Date().toISOString() });
    }
    setMessage("Profile updated successfully.");
    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-[#050505] p-6 text-[#F5F5F5] lg:p-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vault-primary">Account</p>
          <h1 className="mt-2 text-3xl font-bold">Settings</h1>
          <p className="mt-2 text-gray-400">Manage the profile information stored in Supabase Auth and your profile record.</p>
        </div>
        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}
        {message && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div>}
        <form onSubmit={save} className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div><label className="mb-2 block text-sm text-gray-400">Email</label><input value={email} disabled className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-gray-400" /></div>
          <div><label className="mb-2 block text-sm text-gray-400">Full name</label><input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-vault-primary" /></div>
          <button disabled={saving} className="rounded-xl bg-vault-primary px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Save changes"}</button>
        </form>
      </div>
    </main>
  );
}
