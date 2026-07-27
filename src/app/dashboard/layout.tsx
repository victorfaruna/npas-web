import React from "react";
import { Bell } from "lucide-react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar — client component (needs usePathname) */}
      <DashboardSidebar />

      {/* Main */}
      <main className="flex-1 ml-[220px] flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-14 border-b border-border bg-background/90 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40 transition-colors duration-300">
          <div>
            <h1 className="text-sm font-semibold text-foreground ">
              NPAS Dashboard
            </h1>
            <p className="text-sm hidden text-foreground/60 ">
              IoT Engineering Project — 2026
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-muted/50 border border-border rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-foreground/60 ">
                Live
              </span>
            </div>

            {/* Bell */}
            <button className="relative p-1.5 text-foreground/60 hover:text-foreground transition-colors">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            {/* User */}
            <div className="flex items-center gap-2 pl-4 border-l border-border">
              <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-foreground/60 font-semibold text-sm">
                A
              </div>
              <div className="leading-none">
                <p className="text-sm font-medium text-foreground ">
                  Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
