"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Droplets,
  Battery,
  UserCheck,
  Flame,
  ArrowUpRight,
  RefreshCcw,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

const powerData: { time: string; watts: number }[] = [];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3, ease: "easeOut" },
});

/* ── Stat card ── */
const StatCard = ({
  title,
  value,
  unit,
  trend,
  icon: Icon,
  iconColor,
  href,
}: {
  title: string;
  value: string;
  unit: string;
  trend?: number;
  icon: React.ElementType;
  iconColor: string;
  href: string;
}) => (
  <Link href={href}>
    <motion.div
      whileHover={{ y: -1 }}
      className="bg-card border border-border rounded-lg p-5 flex flex-col gap-4 cursor-pointer hover:border-border transition-all group"
    >
      <div className="flex items-center justify-between">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center"
          style={{ background: `${iconColor}14` }}
        >
          <Icon size={15} style={{ color: iconColor }} />
        </div>
        {trend !== undefined && (
          <span
            className={`text-sm font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 ${
              trend >= 0
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {trend >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground/60 mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-semibold text-foreground ">{value}</span>
          <span className="text-foreground/60 text-sm font-medium ">{unit}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <ArrowUpRight
          size={13}
          className="text-foreground/60 group-hover:text-foreground/60 transition-colors"
        />
      </div>
    </motion.div>
  </Link>
);

/* ── Module status row ── */
const ModuleRow = ({
  name,
  status,
  detail,
  icon: Icon,
  color,
  ok,
}: {
  name: string;
  status: string;
  detail: string;
  icon: React.ElementType;
  color: string;
  ok: boolean;
}) => (
  <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
    <div
      className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
      style={{ background: `${color}12` }}
    >
      <Icon size={13} style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate ">{name}</p>
      <p className="text-sm text-foreground/60 ">{detail}</p>
    </div>
    <span
      className={`text-sm font-semibold px-2 py-0.5 rounded border ${
        ok
          ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
          : "border-amber-500/20 text-amber-500 bg-amber-500/5"
      }`}
    >
      {status}
    </span>
  </div>
);

/* ── Activity log row ── */
const LogRow = ({
  time,
  event,
  module,
  status,
}: {
  time: string;
  event: string;
  module: string;
  status: "SAFE" | "WARNING" | "INFO";
}) => {
  const chip =
    status === "SAFE"
      ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
      : status === "WARNING"
      ? "border-amber-500/20 text-amber-500 bg-amber-500/5"
      : "border-blue-500/20 text-blue-400 bg-blue-500/5";
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="w-9 h-9 rounded-md bg-muted flex flex-col items-center justify-center text-sm font-medium text-foreground/60 shrink-0 leading-tight text-center ">
        {time.split(" ")[0]}
        <span className="text-foreground/60">{time.split(" ")[1]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate ">{event}</p>
        <p className="text-sm text-foreground/60 mt-0.5 ">{module}</p>
      </div>
      <span
        className={`text-sm font-semibold px-2 py-0.5 rounded border shrink-0 ${chip}`}
      >
        {status}
      </span>
    </div>
  );
};

/* ── Custom Tooltip ── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-md px-3 py-2 text-sm">
      <p className="text-foreground/60 mb-0.5 ">{label}</p>
      <p className="font-semibold text-foreground ">{payload[0].value} W</p>
    </div>
  );
};

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function DashboardPage() {
  const stats = [
    {
      title: "Power Consumption",
      value: "0",
      unit: "kWh",
      icon: Zap,
      iconColor: "#60a5fa",
      href: "/dashboard/power",
    },
    {
      title: "Water Level",
      value: "0",
      unit: "%",
      icon: Droplets,
      iconColor: "#34d399",
      href: "/dashboard/water",
    },
    {
      title: "Battery Charge",
      value: "0",
      unit: "%",
      icon: Battery,
      iconColor: "#a78bfa",
      href: "/dashboard/battery",
    },
    {
      title: "Staff Logged In",
      value: "0",
      unit: "active",
      icon: UserCheck,
      iconColor: "#fbbf24",
      href: "/dashboard/attendance",
    },
  ];

  const modules = [
    {
      name: "Power Grid",
      status: "0V",
      detail: "Awaiting data",
      icon: Zap,
      color: "#60a5fa",
      ok: true,
    },
    {
      name: "Water Tank",
      status: "0%",
      detail: "Awaiting data",
      icon: Droplets,
      color: "#34d399",
      ok: true,
    },
    {
      name: "Changeover",
      status: "—",
      detail: "Awaiting data",
      icon: RefreshCcw,
      color: "#fbbf24",
      ok: true,
    },
    {
      name: "Battery System",
      status: "0V",
      detail: "Awaiting data",
      icon: Battery,
      color: "#a78bfa",
      ok: true,
    },
    {
      name: "Fire Detection",
      status: "—",
      detail: "Awaiting data",
      icon: Flame,
      color: "#f87171",
      ok: true,
    },
    {
      name: "Attendance",
      status: "0 IN",
      detail: "No logs yet",
      icon: UserCheck,
      color: "#fbbf24",
      ok: true,
    },
  ];

  const logs: { time: string; event: string; module: string; status: "SAFE" | "WARNING" | "INFO" }[] = [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <motion.div {...fade(0)} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-foreground/60 mb-1">
            System Overview
          </p>
          <h2 className="text-sm font-semibold text-foreground ">
            Real-time Telemetry
          </h2>
          <p className="text-foreground/60 text-sm mt-0.5 ">
            All 6 NPAS modules reporting live
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-muted border border-border hover:border-border px-3.5 py-2 rounded-md text-sm font-medium text-foreground/60 hover:text-foreground transition-all ">
            Export Data
          </button>
          <Link
            href="/dashboard/power"
            className="flex items-center gap-1.5 bg-white text-black px-3.5 py-2 rounded-md text-sm font-semibold hover:bg-white/90 transition-all "
          >
            System Report
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div {...fade(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Area chart */}
        <motion.div {...fade(0.1)} className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="text-sm font-semibold text-foreground ">Power Load History</h4>
              <p className="text-foreground/60 text-sm mt-0.5 ">Combined load — past 24h</p>
            </div>
            <select className="bg-muted border border-border text-sm font-medium text-foreground/60 px-2.5 py-1.5 rounded-md outline-none cursor-pointer ">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerData} margin={{ left: -10, right: 4 }}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#444", fontSize: 10 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#444", fontSize: 10 }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="watts"
                  stroke="#60a5fa"
                  strokeWidth={1.5}
                  fill="url(#blueGrad)"
                  dot={false}
                  activeDot={{ r: 3, fill: "#60a5fa", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Fire safety + connectivity */}
        <motion.div {...fade(0.15)} className="flex flex-col gap-3">
          {/* Fire card */}
          <div className="bg-card border border-border rounded-lg p-5 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-red-500/10 flex items-center justify-center">
                <Flame size={13} className="text-red-400" />
              </div>
              <h5 className="text-sm font-semibold text-foreground ">Fire Safety</h5>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-emerald-500 font-semibold text-sm ">ALL CLEAR</span>
            </div>
            <p className="text-foreground/60 text-sm ">No active fire or smoke alarms detected.</p>
            <div className="mt-3 flex items-center gap-2 bg-muted rounded-md px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-foreground/60 font-medium ">Armed and monitoring</span>
            </div>
          </div>

          {/* Connectivity */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                <Wifi size={13} className="text-foreground/60" />
              </div>
              <h5 className="text-sm font-semibold text-foreground ">ESP32 Devices</h5>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {["ESP32-Power", "ESP32-Water", "ESP32-Fire", "RFID-Reader"].map((d) => (
                <div key={d} className="flex items-center gap-1.5 bg-muted rounded-md px-2.5 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-foreground/60 truncate ">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module statuses */}
        <motion.div {...fade(0.2)} className="bg-card border border-border rounded-lg p-5">
          <h4 className="text-sm font-semibold text-foreground mb-0.5">Module Status</h4>
          <p className="text-foreground/60 text-sm mb-4 ">Live readings from all 6 sensors</p>
          <div>
            {modules.map((m, i) => (
              <ModuleRow key={i} {...m} />
            ))}
          </div>
        </motion.div>

        {/* Activity log */}
        <motion.div {...fade(0.25)} className="bg-card border border-border rounded-lg p-5">
          <h4 className="text-sm font-semibold text-foreground mb-0.5">Recent Activity</h4>
          <p className="text-foreground/60 text-sm mb-4 ">System events from today</p>
          <div>
            {logs.length === 0 ? (
              <p className="text-sm text-foreground/60 py-4 text-center">No events recorded yet</p>
            ) : (
              logs.map((l, i) => (
                <LogRow key={i} {...l} />
              ))
            )}
          </div>
          <button className="mt-4 w-full text-center text-sm font-medium text-foreground/60 hover:text-foreground/60 transition-colors py-2 border border-dashed border-border rounded-md hover:border-border ">
            View full history
          </button>
        </motion.div>
      </div>
    </div>
  );
}
