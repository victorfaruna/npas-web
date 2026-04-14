/**
 * attendance-db.ts
 * Lightweight flat-file JSON persistence for employees and attendance logs.
 * Uses Node.js `fs` — server-side only. Never import this in a client component.
 */
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface Employee {
  id: number;
  name: string;
  face_descriptor: number[]; // Float32Array serialised as plain number[]
  created_at: string;
}

export interface AttendanceLog {
  id: number;
  employee_id: number;
  name: string;
  status: "present";
  timestamp: string;
}

// ---------------------------------------------------------------------------
// File paths
// ---------------------------------------------------------------------------
const DATA_DIR = path.join(process.cwd(), "data");
const EMPLOYEES_FILE = path.join(DATA_DIR, "employees.json");
const LOGS_FILE = path.join(DATA_DIR, "attendance_logs.json");

function ensureFile(filePath: string, defaultContent = "[]") {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(filePath, defaultContent, "utf-8");
  }
}

// ---------------------------------------------------------------------------
// Employees
// ---------------------------------------------------------------------------
export function getEmployees(): Employee[] {
  ensureFile(EMPLOYEES_FILE);
  const raw = fs.readFileSync(EMPLOYEES_FILE, "utf-8");
  return JSON.parse(raw) as Employee[];
}

export function saveEmployee(name: string, face_descriptor: number[]): Employee {
  const employees = getEmployees();
  const newEmployee: Employee = {
    id: employees.length > 0 ? employees[employees.length - 1].id + 1 : 1,
    name,
    face_descriptor,
    created_at: new Date().toISOString(),
  };
  employees.push(newEmployee);
  fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify(employees, null, 2), "utf-8");
  return newEmployee;
}

// ---------------------------------------------------------------------------
// Attendance Logs
// ---------------------------------------------------------------------------
export function getLogs(filters?: { date?: string; name?: string }): AttendanceLog[] {
  ensureFile(LOGS_FILE);
  const raw = fs.readFileSync(LOGS_FILE, "utf-8");
  let logs = JSON.parse(raw) as AttendanceLog[];

  if (filters?.date) {
    logs = logs.filter((l) => l.timestamp.startsWith(filters.date!));
  }
  if (filters?.name) {
    const q = filters.name.toLowerCase();
    logs = logs.filter((l) => l.name.toLowerCase().includes(q));
  }
  return logs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function hasRecentLog(employee_id: number, withinMs = 60 * 60 * 1000): boolean {
  const logs = getLogs();
  const now = Date.now();
  return logs.some(
    (l) =>
      l.employee_id === employee_id &&
      now - new Date(l.timestamp).getTime() < withinMs
  );
}

export function saveLog(
  employee_id: number,
  name: string,
  status: "present" = "present"
): AttendanceLog {
  ensureFile(LOGS_FILE);
  const logs = getLogs();
  const newLog: AttendanceLog = {
    id: logs.length > 0 ? Math.max(...logs.map((l) => l.id)) + 1 : 1,
    employee_id,
    name,
    status,
    timestamp: new Date().toISOString(),
  };
  logs.push(newLog);
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
  return newLog;
}
