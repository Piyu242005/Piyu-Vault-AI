import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-vault-bg text-vault-text p-8">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-xl text-vault-muted mb-8">Page not found</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
