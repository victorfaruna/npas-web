"use client";

import React, { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle";

const SidebarItem = ({
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
}) => (
  <Link href={href} onClick={onClick}>
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="fixed left-3 top-2.5 z-50 rounded-md border border-border bg-card p-2 text-foreground lg:hidden"
      >
        <Menu size={18} />
      </button>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    <aside className={`fixed inset-y-0 left-0 w-[min(220px,86vw)] border-r border-foreground/5 bg-background z-50 overflow-y-auto flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
        <span className="text-sm font-semibold text-foreground">NPAS</span>
        <button type="button" aria-label="Close navigation" onClick={() => setIsOpen(false)} className="rounded-md p-2 text-foreground/60 hover:bg-muted hover:text-foreground">
          <X size={18} />
        </button>
      </div>
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
              onClick={() => setIsOpen(false)}
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
    </>
  );
}
