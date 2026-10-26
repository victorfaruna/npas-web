"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserPlus, ScanFace, ClipboardList } from "lucide-react";

const tabs = [
  { href: "/dashboard/attendance", label: "Overview", icon: ClipboardList, exact: true },
  { href: "/dashboard/attendance/enroll", label: "Enroll", icon: UserPlus, exact: false },
  { href: "/dashboard/attendance/scan", label: "Scan", icon: ScanFace, exact: false },
  { href: "/dashboard/attendance/logs", label: "Logs", icon: ClipboardList, exact: false },
];

export function AttendanceNav() {
  const pathname = usePathname();

  return (
    <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
    <nav className="flex w-max min-w-full items-center gap-1 p-1 bg-card border border-border rounded-md sm:min-w-0">
      {tabs.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              active
                ? "bg-muted text-foreground"
                : "text-foreground/60 hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        );
      })}
    </nav>
    </div>
  );
}
