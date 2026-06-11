import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans">
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF3366] to-[#7C3AED] shadow-[0_0_15px_rgba(255,51,102,0.5)] flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Piyu Vault AI</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
              <Link href="/dashboard" className="text-white hover:text-[#FF3366] transition-colors">Dashboard</Link>
              <Link href="/notes" className="hover:text-[#FF3366] transition-colors">Notes</Link>
              <Link href="/files" className="hover:text-[#FF3366] transition-colors">Files</Link>
              <Link href="/knowledge" className="hover:text-[#FF3366] transition-colors">Knowledge Base</Link>
            </nav>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border border-white/20 hover:border-[#FF3366] transition-colors"
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-gray-400">Here's an overview of your personal knowledge base.</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Documents", value: "0", color: "from-[#FF3366] to-pink-600" },
              { label: "Knowledge Notes", value: "0", color: "from-[#7C3AED] to-purple-600" },
              { label: "AI Conversations", value: "0", color: "from-blue-500 to-cyan-500" },
              { label: "Security Status", value: "Secure", color: "from-emerald-500 to-green-600" },
            ].map((stat, i) => (
              <div key={i} className="relative group rounded-2xl border border-white/10 bg-white/5 p-6 overflow-hidden hover:bg-white/10 transition-colors">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity -mr-10 -mt-10`} />
                <p className="text-sm font-medium text-gray-400 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity & AI Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="flex flex-col items-center justify-center h-48 text-gray-500 border-2 border-dashed border-white/10 rounded-xl">
                <p>No recent activity found.</p>
                <p className="text-sm">Upload a document or create a note to get started.</p>
              </div>
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-black/40 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#FF3366]/10 to-[#7C3AED]/10 blur-xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#FF3366] animate-pulse" />
                  <h3 className="text-xl font-semibold">Piyu AI Insights</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-black/50 border border-white/5 backdrop-blur-sm">
                    <p className="text-sm text-gray-300">Your knowledge base is currently empty. I can help you summarize PDFs or extract key concepts once you upload them!</p>
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-medium transition-colors backdrop-blur-sm flex items-center justify-center gap-2">
                    Ask Piyu AI
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
