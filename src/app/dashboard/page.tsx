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

/* ── mock data ── */
const powerData = [
  { time: "00:00", watts: 240 },
  { time: "04:00", watts: 178 },
  { time: "08:00", watts: 324 },
  { time: "12:00", watts: 451 },
  { time: "16:00", watts: 382 },
  { time: "20:00", watts: 295 },
  { time: "23:59", watts: 213 },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45 },
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
      whileHover={{ y: -3 }}
      className="bg-[#111111] border border-[#232323] rounded-2xl p-6 flex flex-col gap-5 cursor-pointer hover:border-[#a8e63d]/30 transition-all group"
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${iconColor}18` }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        {trend !== undefined && (
          <span
            className={`text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
              trend >= 0
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
          {title}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-white">{value}</span>
          <span className="text-gray-500 text-sm font-bold">{unit}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <ArrowUpRight
          size={14}
          className="text-gray-600 group-hover:text-[#a8e63d] transition-colors"
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
  <div className="flex items-center gap-4 py-3.5 border-b border-[#1a1a1a] last:border-0">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${color}18` }}
    >
      <Icon size={16} style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-white truncate">{name}</p>
      <p className="text-xs text-gray-500">{detail}</p>
    </div>
    <span
      className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
        ok
          ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
          : "border-amber-500/30 text-amber-400 bg-amber-500/5"
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
      ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
      : status === "WARNING"
      ? "border-amber-500/30 text-amber-400 bg-amber-500/5"
      : "border-blue-500/30 text-blue-400 bg-blue-500/5";
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-[#1a1a1a] last:border-0">
      <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex flex-col items-center justify-center text-[10px] font-bold text-gray-500 shrink-0 leading-tight text-center">
        {time.split(" ")[0]}
        <span className="text-gray-600">{time.split(" ")[1]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{event}</p>
        <p className="text-xs text-gray-500 mt-0.5">{module}</p>
      </div>
      <span
        className={`text-[10px] font-black px-2.5 py-1 rounded-full border shrink-0 ${chip}`}
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
    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="font-bold text-white">{payload[0].value} W</p>
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
      value: "1,284",
      unit: "kWh",
      trend: 12.5,
      icon: Zap,
      iconColor: "#3b82f6",
      href: "/dashboard/power",
    },
    {
      title: "Water Level",
      value: "82",
      unit: "%",
      trend: -3.1,
      icon: Droplets,
      iconColor: "#10b981",
      href: "/dashboard/water",
    },
    {
      title: "Battery Charge",
      value: "94",
      unit: "%",
      trend: -1.2,
      icon: Battery,
      iconColor: "#a855f7",
      href: "/dashboard/battery",
    },
    {
      title: "Staff Logged In",
      value: "7",
      unit: "active",
      icon: UserCheck,
      iconColor: "#f59e0b",
      href: "/dashboard/attendance",
    },
  ];

  const modules = [
    {
      name: "Power Grid",
      status: "235V",
      detail: "Source: NEPA — Stable",
      icon: Zap,
      color: "#3b82f6",
      ok: true,
    },
    {
      name: "Water Tank",
      status: "82%",
      detail: "Pump: OFF — Auto mode",
      icon: Droplets,
      color: "#10b981",
      ok: true,
    },
    {
      name: "Changeover",
      status: "NEPA",
      detail: "Generator: Standby",
      icon: RefreshCcw,
      color: "#f59e0b",
      ok: true,
    },
    {
      name: "Battery System",
      status: "48.2V",
      detail: "98% charge — Healthy",
      icon: Battery,
      color: "#a855f7",
      ok: true,
    },
    {
      name: "Fire Detection",
      status: "ALL CLEAR",
      detail: "No active alarms",
      icon: Flame,
      color: "#ef4444",
      ok: true,
    },
    {
      name: "Attendance",
      status: "7 IN",
      detail: "Last log: 09:15 AM",
      icon: UserCheck,
      color: "#f59e0b",
      ok: true,
    },
  ];

  const logs = [
    { time: "12:45 PM", event: "NEPA Power Restored", module: "Changeover", status: "SAFE" as const },
    { time: "11:20 AM", event: "Water Level reached LOW", module: "Water Tank", status: "WARNING" as const },
    { time: "09:15 AM", event: "RFID Log: John Doe Enter", module: "Attendance", status: "INFO" as const },
    { time: "08:00 AM", event: "Generator Self-Test Pass", module: "Power", status: "SAFE" as const },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <motion.div {...fade(0)} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#a8e63d] mb-1">
            System Overview
          </p>
          <h2 className="text-2xl font-black text-white">
            Real-time Telemetry
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            All 6 NPAS modules reporting live
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#111111] border border-[#232323] hover:border-[#333] px-4 py-2.5 rounded-full text-sm font-semibold text-gray-400 hover:text-white transition-all">
            Export Data
          </button>
          <Link
            href="/dashboard/power"
            className="flex items-center gap-2 bg-[#a8e63d] text-gray-900 px-4 py-2.5 rounded-full text-sm font-bold hover:brightness-110 transition-all"
          >
            System Report
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div {...fade(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Area chart */}
        <motion.div {...fade(0.1)} className="lg:col-span-2 bg-[#111111] border border-[#232323] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-base font-bold text-white">Power Load History</h4>
              <p className="text-gray-500 text-xs mt-0.5">Combined load across all modules — past 24h</p>
            </div>
            <select className="bg-[#1a1a1a] border border-[#2a2a2a] text-xs font-semibold text-gray-400 px-3 py-1.5 rounded-lg outline-none cursor-pointer">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerData} margin={{ left: -10, right: 4 }}>
                <defs>
                  <linearGradient id="limeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a8e63d" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#a8e63d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e1e1e" />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#4b5563", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#4b5563", fontSize: 11 }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="watts"
                  stroke="#a8e63d"
                  strokeWidth={2.5}
                  fill="url(#limeGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#a8e63d", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Fire safety + connectivity */}
        <motion.div {...fade(0.15)} className="flex flex-col gap-4">
          {/* Fire card */}
          <div className="bg-[#111111] border border-[#232323] rounded-2xl p-6 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Flame size={16} className="text-red-500" />
              </div>
              <h5 className="text-sm font-bold text-white">Fire Safety</h5>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span className="text-emerald-400 font-black text-sm">ALL CLEAR</span>
            </div>
            <p className="text-gray-500 text-xs">No active fire or smoke alarms detected across all zones.</p>
            <div className="mt-4 flex items-center gap-2 bg-[#1a1a1a] rounded-xl px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-gray-400 font-semibold">System armed and monitoring</span>
            </div>
          </div>

          {/* Connectivity */}
          <div className="bg-[#111111] border border-[#232323] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#a8e63d]/10 flex items-center justify-center">
                <Wifi size={16} className="text-[#a8e63d]" />
              </div>
              <h5 className="text-sm font-bold text-white">ESP32 Devices</h5>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["ESP32-Power", "ESP32-Water", "ESP32-Fire", "RFID-Reader"].map((d) => (
                <div key={d} className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-semibold text-gray-400 truncate">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module statuses */}
        <motion.div {...fade(0.2)} className="bg-[#111111] border border-[#232323] rounded-2xl p-6">
          <h4 className="text-base font-bold text-white mb-1">Module Status</h4>
          <p className="text-gray-500 text-xs mb-4">Live readings from all 6 sensors</p>
          <div>
            {modules.map((m, i) => (
              <ModuleRow key={i} {...m} />
            ))}
          </div>
        </motion.div>

        {/* Activity log */}
        <motion.div {...fade(0.25)} className="bg-[#111111] border border-[#232323] rounded-2xl p-6">
          <h4 className="text-base font-bold text-white mb-1">Recent Activity</h4>
          <p className="text-gray-500 text-xs mb-4">System events from today</p>
          <div>
            {logs.map((l, i) => (
              <LogRow key={i} {...l} />
            ))}
          </div>
          <button className="mt-4 w-full text-center text-xs font-bold text-gray-500 hover:text-[#a8e63d] transition-colors py-2 border border-dashed border-[#2a2a2a] rounded-xl hover:border-[#a8e63d]/30">
            View full history
          </button>
        </motion.div>
      </div>
    </div>
  );
}
