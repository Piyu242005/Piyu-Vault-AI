"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setError(""); setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  }

  async function forgotPassword() {
    if (!email.trim()) { setError("Enter your email first."); return; }
    setLoading(true); setError(""); setMessage("");
    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${siteUrl}/reset-password` });
    if (error) setError(error.message);
    else setMessage("Password reset instructions have been sent to your email.");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-black/60 p-8 shadow-2xl backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF3366]">Piyu Vault AI</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-400">Sign in to your private knowledge vault.</p>
        <div className="mt-8 space-y-4">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7C3AED]" />
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7C3AED]" />
        </div>
        {error && <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        {message && <p className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-[#FF3366] px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? "Working…" : "Sign in"}</button>
        <div className="mt-5 flex items-center justify-between text-sm">
          <button type="button" onClick={() => void forgotPassword()} className="text-gray-400 hover:text-white">Forgot password?</button>
          <Link href="/sign-up" className="text-[#9D68FF]">Create account</Link>
        </div>
      </form>
    </div>
  );
}
