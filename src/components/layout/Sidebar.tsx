"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Files, 
  FileText, 
  FolderKanban, 
  Search, 
  BarChart3, 
  Activity, 
  ShieldCheck, 
  Settings,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Files", href: "/dashboard/files", icon: Files },
    { name: "Notes", href: "/dashboard/notes", icon: FileText },
    { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    { name: "AI Search", href: "/dashboard/search", icon: Search },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Activity Logs", href: "/dashboard/activity", icon: Activity },
    { name: "Security", href: "/dashboard/security", icon: ShieldCheck },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-72 lg:shrink-0 flex p-4 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Floating Glass Pane */}
        <div className="flex-1 flex flex-col bg-vault-card/80 backdrop-blur-xl border border-vault-border rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Logo / Header */}
          <div className="flex items-center justify-between p-6 border-b border-vault-border/50">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vault-primary to-vault-accent flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-vault-primary transition-colors">
                Piyu Vault <span className="text-vault-primary">AI</span>
              </span>
            </Link>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-vault-muted hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? "bg-vault-primary/10 text-vault-primary" 
                      : "text-vault-muted hover:bg-vault-border/50 hover:text-vault-text"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-vault-primary" : "text-vault-muted group-hover:text-vault-text"}`} />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Area / Plan Info */}
          <div className="p-4 border-t border-vault-border/50 bg-black/20 m-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-vault-muted">System Status: Optimal</span>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}
