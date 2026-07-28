"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserPlus,
  ScanFace,
  ClipboardList,
  UserCheck,
  ArrowUpRight,
  LucideIcon,
  X,
} from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3, ease: "easeOut" as const },
});

interface AttendanceHubClientProps {
  stats: { label: string; value: number; sub: string }[];
  cards: {
    href: string;
    iconName: string;
    title: string;
    description: string;
    cta: string;
    iconColor: string;
    iconBg: string;
  }[];
  employees: { id: number; name: string; created_at: string }[];
}

const iconMap: Record<string, LucideIcon> = {
  UserPlus,
  ScanFace,
  ClipboardList,
};

export default function AttendanceHubClient({
  stats,
  cards,
  employees,
}: AttendanceHubClientProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="max-w-290">
      {/* Header */}
      <motion.div
        {...fade(0)}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3"
      >
        <div>
          <h4 className="text-lg font-medium text-foreground ">
            Smart Attendance
          </h4>

          <p className="text-foreground/60 text-sm ">
            AI-powered face recognition attendance system
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/attendance/logs"
            className="flex items-center gap-2 bg-transparent border border-border hover:border-foreground/20 px-3.5 py-2 rounded-sm text-xs font-medium text-foreground/60 hover:text-foreground transition-all "
          >
            View History
          </Link>
          <Link
            href="/dashboard/attendance/scan"
            className="flex items-center gap-1.5 bg-foreground text-background px-3.5 py-2 rounded-sm text-xs font-semibold hover:bg-foreground/90 transition-all "
          >
            Start Scanner
            <ScanFace size={13} />
          </Link>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4 max-w-200">
        {stats.map((stat, i) => {
          let Icon = UserPlus;
          let iconClass = "text-blue-500";
          let bgClass = "bg-blue-500/10";

          if (stat.label === "Present Today") {
            Icon = UserCheck;
            iconClass = "text-emerald-500";
            bgClass = "bg-emerald-500/10";
          } else if (stat.label === "Total Logs") {
            Icon = ClipboardList;
            iconClass = "text-purple-500";
            bgClass = "bg-purple-500/10";
          }

          const isEnrolled = stat.label === "Enrolled";

          return (
            <motion.div
              key={stat.label}
              {...fade(0.1 + i * 0.05)}
              onClick={() => {
                if (isEnrolled) setIsModalOpen(true);
              }}
              className={`bg-foreground/3 gap-10 border border-foreground/2 rounded-md p-4 flex flex-col justify-between ${
                isEnrolled ? "cursor-pointer hover:border-foreground/20 transition-all" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground ">
                    {stat.label}
                  </h4>
                  <p className="text-foreground/60 text-sm mt-0.5 ">
                    {stat.sub}
                  </p>
                </div>
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center ${bgClass}`}
                >
                  <Icon size={15} className={iconClass} />
                </div>
              </div>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-3xl font-semibold text-foreground ">
                  {stat.value}
                </span>
                <span className="text-foreground/60 text-sm font-medium uppercase">
                  Records
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Module cards */}
      <motion.div {...fade(0.2)}>
        <h4 className="text-lg font-medium text-foreground mt-10 mb-3">
          Modules
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {cards.map(
            ({
              href,
              iconName,
              title,
              description,
              cta,
              iconColor,
              iconBg,
            }) => {
              const Icon = iconMap[iconName] || UserCheck;
              return (
                <Link key={href} href={href} className="group">
                  <div className="bg-card border border-foreground/5 rounded-sm p-4 flex flex-col gap-6 h-[200px] justify-between hover:border-foreground/20 transition-all">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${iconBg}`}
                      >
                        <Icon size={15} className={iconColor} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground ">
                          {title}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[13px] text-foreground/60 leading-relaxed mb-4">
                        {description}
                      </p>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-foreground/60 group-hover:text-foreground transition-colors uppercase">
                        {cta}
                        <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            },
          )}
        </div>
      </motion.div>

      {/* Employees Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border w-full max-w-md rounded-lg shadow-xl relative z-10 flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">
                Enrolled Employees
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-foreground/60 hover:text-foreground transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-2">
              {employees.length === 0 ? (
                <p className="text-sm text-foreground/60 text-center py-8">
                  No employees enrolled yet.
                </p>
              ) : (
                employees.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-3 rounded-md bg-foreground/5 border border-foreground/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck size={14} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {emp.name}
                      </span>
                    </div>
                    <span className="text-xs text-foreground/40">
                      {new Date(emp.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
