import { getEmployees, getLogs } from "@/lib/attendance-db";
import AttendanceHubClient from "@/components/attendance/AttendanceHubClient";

export default async function AttendanceHubPage() {
  const employees = await getEmployees();
  const allLogs = await getLogs();

  const today = new Date().toISOString().split("T")[0];
  const todayLogs = allLogs.filter((l) => l.timestamp.startsWith(today));
  const uniqueToday = new Set(todayLogs.map((l) => l.employee_id)).size;

  const cards = [
    {
      href: "/dashboard/attendance/enroll",
      iconName: "UserPlus",
      title: "Enroll Employee",
      description: "Register a new employee's face for attendance tracking.",
      cta: "Open Enrollment",
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
    {
      href: "/dashboard/attendance/scan",
      iconName: "ScanFace",
      title: "Live Scan",
      description: "Open the camera for real-time face recognition attendance.",
      cta: "Start Scanning",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      href: "/dashboard/attendance/logs",
      iconName: "ClipboardList",
      title: "Attendance Logs",
      description: "View, filter, and export attendance history.",
      cta: "View Logs",
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
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
    <AttendanceHubClient stats={stats} cards={cards} employees={employees} />
  );
}
