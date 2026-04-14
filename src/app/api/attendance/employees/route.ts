import { getEmployees } from "@/lib/attendance-db";

export async function GET() {
  try {
    const employees = getEmployees();
    return Response.json({ employees });
  } catch (err) {
    console.error("[employees] error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
