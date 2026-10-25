"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Battery,
  Bell,
  Droplets,
  Flame,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCcw,
  Settings,
  UserCheck,
  X,
  Zap,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Power", href: "/dashboard/power", icon: Zap },
  { name: "Water", href: "/dashboard/water", icon: Droplets },
  { name: "Changeover", href: "/dashboard/changeover", icon: RefreshCcw },
  { name: "Battery", href: "/dashboard/battery", icon: Battery },
  { name: "Attendance", href: "/dashboard/attendance", icon: UserCheck },
  { name: "Fire Alert", href: "/dashboard/fire", icon: Flame },
  { name: "History", href: "/dashboard/history", icon: History },
];

function SidebarItem({
  href,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
        active
          ? "bg-[#a8e63d] text-gray-900"
          : "text-gray-500 hover:bg-[#1a1a1a] hover:text-white"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard/attendance"
      ? pathname.startsWith(href)
      : pathname === href;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,86vw)] flex-col overflow-y-auto border-r border-[#1e1e1e] bg-[#0d0d0d] transition-transform duration-300 lg:w-64 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#1e1e1e] p-5 lg:p-6">
          <Link href="/" className="flex items-center">
            <div className="h-[50px] w-[110px] overflow-hidden">
              <Image
                src="/logo.svg"
                alt="NPAS"
                width={110}
                height={110}
                className="mt-[-24px] block"
                style={{ filter: "brightness(1.4) drop-shadow(0 0 4px rgba(168,230,61,0.3))" }}
              />
            </div>
          </Link>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-4">
          <p className="mb-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
            Modules
          </p>
          <nav>
            {navigation.map((item) => (
              <SidebarItem
                key={item.name}
                href={item.href}
                icon={item.icon}
                label={item.name}
                active={isActive(item.href)}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>
        </div>

        <div className="border-t border-[#1e1e1e] p-4">
          <SidebarItem href="/settings" icon={Settings} label="Settings" active={false} />
          <SidebarItem href="/" icon={LogOut} label="Back to Site" active={false} />
        </div>
      </aside>

      <main className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-[#1e1e1e] bg-[#0a0a0a]/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
              className="shrink-0 rounded-xl border border-[#252525] bg-[#111] p-2.5 text-gray-300 hover:text-white lg:hidden"
            >
              <Menu size={19} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-white">NPAS Dashboard</h1>
              <p className="hidden text-[11px] text-gray-500 sm:block">IoT Engineering Project — 2026</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-5">
            <div className="flex items-center gap-2 rounded-full border border-[#a8e63d]/20 bg-[#a8e63d]/10 px-2.5 py-1.5 sm:px-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#a8e63d] animate-pulse" />
              <span className="text-[10px] font-bold text-[#a8e63d] sm:text-[11px]">LIVE</span>
            </div>
            <button type="button" aria-label="Notifications" className="relative p-2 text-gray-500 transition-colors hover:text-white">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2.5 border-l border-[#232323] pl-3 sm:pl-4 lg:pl-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#a8e63d]/30 bg-[#1a2e1a] text-xs font-bold text-[#a8e63d]">A</div>
              <div className="hidden leading-none sm:block">
                <p className="text-xs font-bold text-white">Admin</p>
                <p className="text-[10px] text-gray-500">NPAS Operator</p>
              </div>
            </div>
          </div>
        </header>

        <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
