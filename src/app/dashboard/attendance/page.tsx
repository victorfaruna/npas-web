import Link from "next/link";
import { UserPlus, ScanFace, ClipboardList, UserCheck } from "lucide-react";
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
      color: "text-[#a8e63d]",
      bg: "bg-[#a8e63d]/10",
      border: "border-[#a8e63d]/20",
    },
    {
      href: "/dashboard/attendance/scan",
      icon: ScanFace,
      title: "Live Scan",
      description: "Open the camera for real-time face recognition attendance",
      cta: "Start Scanning",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      href: "/dashboard/attendance/logs",
      icon: ClipboardList,
      title: "Attendance Logs",
      description: "View, filter, and export attendance history",
      cta: "View Logs",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#a8e63d]/10 border border-[#a8e63d]/20 flex items-center justify-center">
          <UserCheck size={18} className="text-[#a8e63d]" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Smart Attendance</h1>
          <p className="text-xs text-gray-500">
            AI-powered face recognition attendance system
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-600 mb-1">
            Enrolled
          </p>
          <p className="text-3xl font-black text-white">{employees.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total employees</p>
        </div>
        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-600 mb-1">
            Present Today
          </p>
          <p className="text-3xl font-black text-[#a8e63d]">{uniqueToday}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-NG", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-600 mb-1">
            Total Logs
          </p>
          <p className="text-3xl font-black text-white">{allLogs.length}</p>
          <p className="text-xs text-gray-500 mt-1">All time records</p>
        </div>
      </div>

      {/* Module cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map(({ href, icon: Icon, title, description, cta, color, bg, border }) => (
          <Link key={href} href={href} className="group">
            <div
              className={`h-full bg-[#0d0d0d] border ${border} rounded-2xl p-6 flex flex-col gap-4 hover:border-opacity-60 transition-all hover:scale-[1.01] hover:shadow-2xl`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${bg} border ${border} flex items-center justify-center`}
              >
                <Icon size={22} className={color} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-base mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
              </div>
              <span
                className={`text-xs font-bold ${color} group-hover:underline underline-offset-2`}
              >
                {cta} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
