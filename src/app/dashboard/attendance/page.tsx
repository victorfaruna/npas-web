import Link from "next/link";
import {
  UserPlus,
  ScanFace,
  ClipboardList,
  UserCheck,
  ArrowUpRight,
} from "lucide-react";
import { getEmployees } from "@/lib/attendance-db";
import { getLogs } from "@/lib/attendance-db";

export default function AttendanceHubPage() {
  const employees = getEmployees();
  const allLogs = getLogs();

  const today = new Date().toISOString().split("T")[0];
  const todayLogs = allLogs.filter((l) => l.timestamp.startsWith(today));
  const uniqueToday = new Set(todayLogs.map((l) => l.employee_id)).size;

  const cards = [
    {
      href: "/dashboard/attendance/enroll",
      icon: UserPlus,
      title: "Enroll Employee",
      description: "Register a new employee's face for attendance tracking",
      cta: "Open Enrollment",
      iconColor: "#34d399",
    },
    {
      href: "/dashboard/attendance/scan",
      icon: ScanFace,
      title: "Live Scan",
      description: "Open the camera for real-time face recognition attendance",
      cta: "Start Scanning",
      iconColor: "#60a5fa",
    },
    {
      href: "/dashboard/attendance/logs",
      icon: ClipboardList,
      title: "Attendance Logs",
      description: "View, filter, and export attendance history",
      cta: "View Logs",
      iconColor: "#a78bfa",
    },
  ];

  const stats = [
    { label: "Enrolled", value: employees.length, sub: "Total employees" },
    {
      label: "Present Today",
      value: uniqueToday,
      sub: new Date().toLocaleDateString("en-NG", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    },
    { label: "Total Logs", value: allLogs.length, sub: "All time records" },
  ];

  return (
    <div className="max-w-6xl mx-auto my-8">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-md bg-muted border border-border flex items-center justify-center">
          <UserCheck size={15} className="text-foreground/60" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground ">
            Smart Attendance
          </h1>
          <p className="text-sm text-foreground/60 ">
            AI-powered face recognition attendance system
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6 max-w-200">
        {stats.map(({ label, value, sub }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-lg p-4"
          >
            <p className="text-sm font-medium text-foreground/60 mb-1">
              {label}
            </p>
            <p className="text-xl font-semibold text-foreground ">
              {value}
            </p>
            <p className="text-sm text-foreground/60 mt-1 ">{sub}</p>
          </div>
        ))}
      </div>

      {/* Module cards */}
      <div className="grid sm:grid-cols-3 gap-3 max-w-200">
        {cards.map(
          ({ href, icon: Icon, title, description, cta, iconColor }) => (
            <Link key={href} href={href} className="group">
              <div className="h-full bg-card border border-border rounded-lg p-5 flex flex-col gap-4 hover:border-border transition-all">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center"
                  style={{ background: `${iconColor}14` }}
                >
                  <Icon size={15} style={{ color: iconColor }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-foreground/60 leading-relaxed ">
                    {description}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-foreground/60 group-hover:text-foreground transition-colors ">
                  {cta}
                  <ArrowUpRight size={13} />
                </span>
              </div>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
