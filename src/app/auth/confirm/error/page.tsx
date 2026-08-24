import Link from "next/link";

export default function ConfirmErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-vault-bg px-6 py-12 text-vault-text">
      <section className="w-full max-w-lg rounded-3xl border border-red-500/20 bg-vault-card p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">!</div>
        <h1 className="text-3xl font-bold text-white">Email verification failed</h1>
        <p className="mt-3 text-vault-muted">This verification link is invalid, expired, or has already been used. Request a new confirmation email and try again.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/sign-up" className="rounded-xl bg-vault-primary px-5 py-3 font-semibold text-white">Create account</Link>
          <Link href="/sign-in" className="rounded-xl border border-vault-border px-5 py-3 font-semibold text-white">Sign in</Link>
        </div>
      </section>
    </main>
  );
}
