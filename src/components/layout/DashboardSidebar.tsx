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
  LogOut,
  LayoutDashboard,
  UserCheck,
  Flame,
  Settings,
  RefreshCcw,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle";

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
      className={`flex items-center gap-2.5 px-3 py-2 rounded-md transition-all mb-0.5 text-[13px] font-medium ${
        active
          ? "bg-muted text-foreground"
          : "text-foreground/60 hover:bg-muted/50 hover:text-foreground"
      }`}
    >
      <Icon size={15} />
      <span>{label}</span>
    </div>
  </Link>
);

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

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] border-r border-foreground/5 bg-foreground/1 z-50 overflow-y-auto flex flex-col transition-colors duration-300">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-border hidden">
        <Link href="/" className="flex items-center">
          <div style={{ width: 100, height: 44, overflow: "hidden" }}>
            <Image
              src="/logo.svg"
              alt="NPAS"
              width={100}
              height={100}
              style={{
                filter: "brightness(1.3)",
                display: "block",
                marginTop: -22,
              }}
            />
          </div>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 px-3 py-4">
        <p className="text-sm font-semibold text-foreground uppercase tracking-widest px-3 mb-2">
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
      <div className="px-3 py-3 border-t border-border mt-auto">
        <ThemeToggle />
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
  );
}
