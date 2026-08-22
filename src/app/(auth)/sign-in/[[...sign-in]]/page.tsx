"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push(searchParams.get("next") || "/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-white/10 bg-black/50 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-400">Sign in to your private vault.</p>
        <div className="mt-8 space-y-4">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7C3AED]" />
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7C3AED]" />
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-lg bg-[#FF3366] px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}</button>
        <p className="mt-6 text-center text-sm text-gray-400">New here? <a href="/sign-up" className="text-[#9D68FF]">Create an account</a></p>
      </form>
    </div>
  );
}
