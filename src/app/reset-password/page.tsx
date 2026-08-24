"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
      setLoading(false);
    });
    void supabase.auth.getUser().then(({ data }) => {
      setReady(Boolean(data.user));
      setLoading(false);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(""); setMessage("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else { setMessage("Password updated. Redirecting to sign in…"); setTimeout(() => router.push("/sign-in"), 1200); }
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] p-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/60 p-8 shadow-2xl backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF3366]">Piyu Vault AI</p>
        <h1 className="mt-3 text-3xl font-bold">Reset password</h1>
        <p className="mt-2 text-sm text-gray-400">Choose a new password for your vault account.</p>
        {loading ? <p className="mt-8 text-sm text-gray-400">Checking recovery session…</p> : !ready ? <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">This recovery link is invalid or expired. Request a new one from Sign In.</div> : <form onSubmit={submit} className="mt-8 space-y-4"><input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7C3AED]" /><input required minLength={8} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7C3AED]" />{error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}{message && <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}<button disabled={loading} className="w-full rounded-xl bg-[#FF3366] px-4 py-3 font-semibold disabled:opacity-60">Update password</button></form>}
        <Link href="/sign-in" className="mt-6 inline-block text-sm text-[#9D68FF]">Back to sign in</Link>
      </div>
    </main>
  );
}
