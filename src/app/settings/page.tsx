export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-gray-400">Manage your account and preferences.</p>
          {/* UserProfile component from Clerk will go here eventually */}
        </div>
      </div>
    </div>
  );
}
