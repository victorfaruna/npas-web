import { db } from "@/db";
import { employees, attendanceLogs } from "@/db/schema";
import { eq, desc, and, ilike, gte, lt } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Employees
// ---------------------------------------------------------------------------
export async function getEmployees() {
  const res = await db.select().from(employees).orderBy(desc(employees.created_at));
  return res.map((e) => ({
    ...e,
    created_at: e.created_at.toISOString(),
  }));
}

export async function saveEmployee(name: string, face_descriptor: number[]) {
  const [newEmployee] = await db
    .insert(employees)
    .values({ name, face_descriptor })
    .returning();
  return { ...newEmployee, created_at: newEmployee.created_at.toISOString() };
}

// ---------------------------------------------------------------------------
// Attendance Logs
// ---------------------------------------------------------------------------
export async function getLogs(filters?: { date?: string; name?: string }) {
  const conditions = [];

  if (filters?.date) {
    const start = new Date(filters.date);
    const end = new Date(filters.date);
    end.setDate(end.getDate() + 1);
    conditions.push(gte(attendanceLogs.timestamp, start));
    conditions.push(lt(attendanceLogs.timestamp, end));
  }

  if (filters?.name) {
    conditions.push(ilike(attendanceLogs.name, `%${filters.name}%`));
  }

  const res = await db
    .select()
    .from(attendanceLogs)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(attendanceLogs.timestamp));

  return res.map((l) => ({
    ...l,
    timestamp: l.timestamp.toISOString(),
  }));
}

export async function hasRecentLog(
  employee_id: number,
  withinMs = 60 * 60 * 1000
): Promise<boolean> {
  const cutoff = new Date(Date.now() - withinMs);
  const recentLogs = await db
    .select()
    .from(attendanceLogs)
    .where(
      and(
        eq(attendanceLogs.employee_id, employee_id),
        gte(attendanceLogs.timestamp, cutoff)
      )
    )
    .limit(1);

  return recentLogs.length > 0;
}

export async function saveLog(
  employee_id: number,
  name: string,
  status: string = "present"
) {
  const [newLog] = await db
    .insert(attendanceLogs)
    .values({ employee_id, name, status })
    .returning();
  return { ...newLog, timestamp: newLog.timestamp.toISOString() };
}
