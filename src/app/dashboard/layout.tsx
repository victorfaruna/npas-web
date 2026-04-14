"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Droplets,
  Zap,
  Battery,
  History,
  Bell,
  LogOut,
  LayoutDashboard,
  UserCheck,
  Flame,
  Settings,
  RefreshCcw,
} from "lucide-react";

const SidebarItem = ({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) => (
  <Link href={href}>
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 text-sm font-semibold ${
        active
          ? "bg-[#a8e63d] text-gray-900"
          : "text-gray-500 hover:bg-[#1a1a1a] hover:text-white"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </div>
  </Link>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-[#1e1e1e] bg-[#0d0d0d] z-50 overflow-y-auto flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#1e1e1e]">
          <Link href="/" className="flex items-center">
            <div style={{ width: 110, height: 50, overflow: "hidden" }}>
              <Image
                src="/logo.svg"
                alt="NPAS"
                width={110}
                height={110}
                style={{
                  filter:
                    "brightness(1.4) drop-shadow(0 0 4px rgba(168,230,61,0.3))",
                  display: "block",
                  marginTop: -24, // Recalibrated to prevent bottom-edge clipping
                }}
              />
            </div>
          </Link>
        </div>

        {/* Nav */}
        <div className="flex-1 p-4">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] px-4 mb-3">
            Modules
          </p>
          <nav>
            {navigation.map((item) => (
              <SidebarItem
                key={item.name}
                href={item.href}
                icon={item.icon}
                label={item.name}
                active={
                  item.href === "/dashboard/attendance"
                    ? pathname.startsWith(item.href)
                    : pathname === item.href
                }
              />
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-[#1e1e1e]">
          <SidebarItem
            href="/settings"
            icon={Settings}
            label="Settings"
            active={false}
          />
          <SidebarItem
            href="/"
            icon={LogOut}
            label="Back to Site"
            active={false}
          />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 border-b border-[#1e1e1e] bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <h1 className="text-sm font-bold text-white">NPAS Dashboard</h1>
            <p className="text-[11px] text-gray-500">
              IoT Engineering Project — 2026
            </p>
          </div>

          <div className="flex items-center gap-5">
            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#a8e63d]/10 border border-[#a8e63d]/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a8e63d] animate-pulse" />
              <span className="text-[11px] font-bold text-[#a8e63d]">
                LIVE
              </span>
            </div>

            {/* Bell */}
            <button className="relative p-2 text-gray-500 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            {/* User */}
            <div className="flex items-center gap-2.5 pl-5 border-l border-[#232323]">
              <div className="w-8 h-8 rounded-full bg-[#1a2e1a] border border-[#a8e63d]/30 flex items-center justify-center text-[#a8e63d] font-bold text-xs">
                A
              </div>
              <div className="leading-none">
                <p className="text-xs font-bold text-white">Admin</p>
                <p className="text-[10px] text-gray-500">NPAS Operator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
