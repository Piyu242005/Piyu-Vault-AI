"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { SupabaseNavbar } from "./SupabaseNavbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-vault-bg overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <SupabaseNavbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
