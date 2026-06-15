"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu, Search, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavbarProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export function Navbar({ setSidebarOpen }: NavbarProps) {
  const pathname = usePathname();
  
  // Format pathname for breadcrumb (e.g. /dashboard/files -> Files)
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard Overview";
    const segment = pathname?.split("/").pop() || "";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="h-20 w-full flex items-center justify-between px-4 lg:px-8 border-b border-vault-border/30 bg-vault-bg/50 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 text-vault-muted hover:text-white rounded-lg hover:bg-vault-border/50 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Page Title / Breadcrumb */}
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold text-vault-text tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {/* Global Search (Dummy UI for now) */}
        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 text-vault-muted absolute left-3" />
          <input 
            type="text" 
            placeholder="Search vault..." 
            className="w-64 bg-vault-card border border-vault-border rounded-full py-2 pl-10 pr-4 text-sm text-vault-text placeholder:text-vault-muted focus:outline-none focus:border-vault-primary/50 focus:ring-1 focus:ring-vault-primary/50 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="p-2 text-vault-muted hover:text-white rounded-full hover:bg-vault-card transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-vault-primary rounded-full animate-pulse border border-vault-bg"></span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-vault-border hidden sm:block"></div>

        {/* Clerk User Button */}
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: "w-9 h-9 border border-vault-border shadow-sm"
            }
          }}
        />
      </div>
    </header>
  );
}
