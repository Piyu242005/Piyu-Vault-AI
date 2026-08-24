import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-vault-bg text-vault-text flex flex-col items-center justify-center overflow-hidden">
      <header className="absolute top-0 w-full flex justify-end items-center p-6 z-50">
        <Link href="/sign-in" className="text-sm font-medium text-vault-muted hover:text-white transition-colors">
          Sign In
        </Link>
      </header>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        <div className="mb-8 inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-200 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
          Enterprise-Grade Architecture
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
          <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">Piyu Vault </span>
          <span className="text-red-600">AI</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-zinc-300 mb-6 tracking-tight">
          Private Knowledge. Secure Intelligence.
        </h2>
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-12 leading-relaxed">
          Store documents, notes, projects and research in one secure AI-powered vault.
        </p>
        <Link href="/dashboard" className="group relative inline-flex items-center justify-center px-8 py-4 font-mono text-sm font-semibold text-white transition-all duration-300 ease-out rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] overflow-hidden">
          <span className="relative z-10 flex items-center tracking-widest uppercase">
            [ Enter Vault ]
            <svg className="w-4 h-4 ml-3 opacity-70 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </Link>
      </div>
    </main>
  );
}
