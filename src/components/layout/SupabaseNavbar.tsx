"use client";

import { useEffect, useState } from "react";
import { Menu, Search, Bell, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SupabaseNavbar({ setSidebarOpen }: { setSidebarOpen: (isOpen: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setEmail(data.user?.email || ""));
  }, []);

  const title = pathname === "/dashboard"
    ? "Dashboard Overview"
    : (pathname?.split("/").pop() || "").replace(/^./, (c) => c.toUpperCase());

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <header className="h-20 w-full flex items-center justify-between px-4 lg:px-8 border-b border-vault-border/30 bg-vault-bg/50 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-vault-muted hover:text-white rounded-lg hover:bg-vault-border/50"><Menu className="w-6 h-6" /></button>
        <h1 className="hidden sm:block text-xl font-bold text-vault-text tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="hidden md:flex items-center relative"><Search className="w-4 h-4 text-vault-muted absolute left-3" /><input placeholder="Search vault..." className="w-64 bg-vault-card border border-vault-border rounded-full py-2 pl-10 pr-4 text-sm text-vault-text placeholder:text-vault-muted focus:outline-none" /></div>
        <button className="p-2 text-vault-muted hover:text-white rounded-full hover:bg-vault-card relative"><Bell className="w-5 h-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-vault-primary rounded-full animate-pulse border border-vault-bg" /></button>
        <div className="h-8 w-px bg-vault-border hidden sm:block" />
        <div className="flex items-center gap-3"><div className="hidden lg:block text-right"><p className="text-xs text-vault-muted">Signed in as</p><p className="max-w-40 truncate text-sm text-vault-text">{email}</p></div><button onClick={signOut} title="Sign out" className="p-2 text-vault-muted hover:text-white rounded-full hover:bg-vault-card"><LogOut className="w-5 h-5" /></button></div>
      </div>
    </header>
  );
}
