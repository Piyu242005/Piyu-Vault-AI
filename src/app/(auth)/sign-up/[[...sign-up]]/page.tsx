"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const getSiteUrl = () => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:3000";
};

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/confirm?next=/dashboard`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }
    setMessage("Account created. Check your email to verify your address and activate your vault.");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-white/10 bg-black/50 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-white">Create your vault</h1>
        <p className="mt-2 text-sm text-gray-400">Start your private knowledge workspace.</p>
        <div className="mt-8 space-y-4">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7C3AED]" />
          <input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (8+ characters)" className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7C3AED]" />
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-lg bg-[#FF3366] px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? "Creating..." : "Create account"}</button>
        <p className="mt-6 text-center text-sm text-gray-400">Already registered? <a href="/sign-in" className="text-[#9D68FF]">Sign in</a></p>
      </form>
    </div>
  );
}
