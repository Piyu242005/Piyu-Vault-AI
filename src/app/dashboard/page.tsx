"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FileText, Files, Search, HardDrive, ShieldCheck, UploadCloud, PlusSquare, Wand2 } from "lucide-react";

export default function DashboardPage() {
  const [firstName, setFirstName] = useState("Piyu");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const metadata = data.user?.user_metadata;
      setFirstName(metadata?.first_name || metadata?.name || data.user?.email?.split("@")[0] || "Piyu");
      setIsLoaded(true);
    };
    loadUser();
  }, []);

  const stats = [
    { label: "Total Files", value: "24", icon: Files, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Notes", value: "12", icon: FileText, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "AI Searches", value: "148", icon: Search, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Storage", value: "1.2 GB", icon: HardDrive, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Security", value: "98%", icon: ShieldCheck, color: "text-vault-primary", bg: "bg-vault-primary/10" },
  ];

  const recentActivity = [
    { id: 1, action: "Uploaded Document", item: "Q3_Financial_Report.pdf", time: "2 hours ago" },
    { id: 2, action: "Created Note", item: "Meeting notes - Project X", time: "5 hours ago" },
    { id: 3, action: "AI Search", item: "Summarize Q3 Financial Report", time: "Yesterday" },
    { id: 4, action: "Security", item: "New device login detected", time: "Yesterday" },
    { id: 5, action: "Uploaded Document", item: "Dataset_v2.csv", time: "2 days ago" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="relative rounded-3xl overflow-hidden border border-vault-border bg-vault-card/50 p-8 lg:p-12">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-vault-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Welcome Back, {isLoaded ? firstName : "..."} <span className="inline-block animate-wave origin-bottom-right">👋</span></h1>
          <p className="text-vault-muted text-lg mb-8 max-w-2xl">Private Knowledge. Secure Intelligence.</p>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-vault-text text-vault-bg font-semibold rounded-xl hover:bg-zinc-200 transition-colors"><UploadCloud className="w-5 h-5" />Upload File</button>
            <button className="flex items-center gap-2 px-6 py-3 bg-vault-card border border-vault-border text-white font-medium rounded-xl hover:bg-vault-border/50 transition-colors"><PlusSquare className="w-5 h-5 text-emerald-400" />Create Note</button>
            <button className="flex items-center gap-2 px-6 py-3 bg-vault-primary/10 border border-vault-primary/30 text-vault-primary font-medium rounded-xl hover:bg-vault-primary/20 transition-colors"><Wand2 className="w-5 h-5" />AI Search</button>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => { const Icon = stat.icon; return <div key={i} className="bg-vault-card border border-vault-border rounded-2xl p-5 hover:border-vault-border/80 transition-colors"><div className="flex items-center justify-between mb-4"><div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}><Icon className={`w-5 h-5 ${stat.color}`} /></div></div><p className="text-vault-muted text-sm font-medium mb-1">{stat.label}</p><h3 className="text-2xl font-bold text-white">{stat.value}</h3></div>; })}
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-vault-card border border-vault-border rounded-3xl p-6"><div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-white">Recent Activity</h2><button className="text-sm font-medium text-vault-primary hover:text-vault-accent transition-colors">View All</button></div><div className="space-y-4">{recentActivity.map((log) => <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-vault-bg/50 border border-vault-border/50 hover:bg-vault-border/30 transition-colors"><div className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-vault-primary" /><div><p className="text-white font-medium text-sm">{log.action}</p><p className="text-vault-muted text-xs mt-0.5">{log.item}</p></div></div><span className="text-xs text-vault-muted">{log.time}</span></div>)}</div></div>
        <div className="bg-gradient-to-b from-vault-card to-vault-bg border border-vault-border rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group"><div className="absolute inset-0 bg-vault-primary/5 group-hover:bg-vault-primary/10 transition-colors" /><ShieldCheck className="w-16 h-16 text-vault-primary mb-4 opacity-80" /><h3 className="text-lg font-bold text-white mb-2">System Secure</h3><p className="text-sm text-vault-muted mb-6">Your data is securely stored in your private vault.</p><button className="px-5 py-2.5 rounded-xl border border-vault-border text-sm font-medium text-white hover:bg-vault-border/50 transition-colors relative z-10">Run Security Audit</button></div>
      </section>
    </div>
  );
}
