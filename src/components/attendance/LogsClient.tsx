"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ClipboardList,
  Search,
  Calendar,
  Download,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { AttendanceNav } from "./AttendanceNav";

interface AttendanceLog {
  id: number;
  employee_id: number;
  name: string;
  status: "present";
  timestamp: string;
}

export function LogsClient() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const sseRef = useRef<EventSource | null>(null);

  // ---------------------------------------------------------------------------
  // Fetch logs
  // ---------------------------------------------------------------------------
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchDate) params.set("date", searchDate);
      if (searchName) params.set("name", searchName);
      const res = await fetch(`/api/attendance/logs?${params.toString()}`);
      const data = await res.json();
      setLogs(data.logs ?? []);
    } catch (err) {
      console.error("[LogsClient] fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchDate, searchName]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ---------------------------------------------------------------------------
  // SSE — live updates
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const sse = new EventSource("/api/attendance/stream");
    sseRef.current = sse;

    sse.onmessage = (event) => {
      try {
        const newLog: AttendanceLog = JSON.parse(event.data);
        setLogs((prev) => {
          // Avoid duplicates
          if (prev.some((l) => l.id === newLog.id)) return prev;
          return [newLog, ...prev];
        });
      } catch {
        // ignore malformed events
      }
    };

    return () => sse.close();
  }, []);

  // ---------------------------------------------------------------------------
  // CSV Export
  // ---------------------------------------------------------------------------
  function exportCSV() {
    const header = "ID,Name,Date,Time,Status\n";
    const rows = logs
      .map((l) => {
        const d = new Date(l.timestamp);
        const date = d.toLocaleDateString("en-NG");
        const time = d.toLocaleTimeString("en-NG", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${l.id},"${l.name}",${date},${time},${l.status}`;
      })
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------------------------------------------------------------------------
  // Filtered logs (client-side search on already-fetched data)
  // ---------------------------------------------------------------------------
  const filtered = logs.filter((l) => {
    const nameMatch = !searchName || l.name.toLowerCase().includes(searchName.toLowerCase());
    const dateMatch =
      !searchDate || l.timestamp.startsWith(searchDate);
    return nameMatch && dateMatch;
  });

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto">
      <AttendanceNav />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-muted border border-border flex items-center justify-center">
            <ClipboardList size={18} className="text-foreground/60" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Attendance Logs</h2>
            <p className="text-sm text-foreground/60">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              {" "}· live updates active
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white ml-1.5 animate-pulse relative top-[-1px]" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-refresh-logs"
            onClick={fetchLogs}
            className="p-2 rounded-lg border border-border text-foreground/60 hover:text-foreground hover:border-border transition-all"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <button
            id="btn-export-csv"
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-white/20 border border-border text-foreground/60 text-sm font-semibold transition-all"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50"
          />
          <input
            id="filter-name"
            type="text"
            placeholder="Search by name…"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full bg-card border border-border rounded-md pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-border transition-all"
          />
        </div>
        <div className="relative">
          <Calendar
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50"
          />
          <input
            id="filter-date"
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="bg-card border border-border rounded-md pl-9 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-border transition-all [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3.5 text-sm font-medium text-foreground/60 ">
                  Name
                </th>
                <th className="text-left px-5 py-3.5 text-sm font-medium text-foreground/60 ">
                  Date
                </th>
                <th className="text-left px-5 py-3.5 text-sm font-medium text-foreground/60 ">
                  Time
                </th>
                <th className="text-left px-5 py-3.5 text-sm font-medium text-foreground/60 ">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-foreground/40">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-gray-700 border-t-gray-400 rounded-full animate-spin" />
                      Loading records…
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-foreground/40">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filtered.map((log, index) => {
                  const d = new Date(log.timestamp);
                  const date = d.toLocaleDateString("en-NG", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  const time = d.toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={log.id}
                      className={`border-b border-border last:border-0 hover:bg-card transition-colors ${
                        index === 0 ? "animate-in fade-in duration-500" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 border border-border flex items-center justify-center text-foreground/60 text-xs font-semibold">
                            {log.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-foreground">{log.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-foreground/60">{date}</td>
                      <td className="px-5 py-4 text-foreground/60 font-mono text-xs">{time}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border text-foreground/60 text-xs font-semibold">
                          <CheckCircle2 size={11} />
                          Present
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
