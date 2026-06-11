export default function SecurityCenterPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Security Center</h1>
        <div className="grid gap-6">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Security Score</h2>
              <span className="text-emerald-400 font-bold">100 / 100</span>
            </div>
            <p className="text-gray-400">Your account is highly secure.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
            <p className="text-gray-400 text-sm">No active sessions logs to display.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Login Activity</h2>
            <p className="text-gray-400 text-sm">No login activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
