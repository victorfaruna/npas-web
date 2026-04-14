import { NextRequest } from "next/server";
import { getLogs } from "@/lib/attendance-db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const date = searchParams.get("date") ?? undefined;
    const name = searchParams.get("name") ?? undefined;

    const logs = getLogs({ date, name });
    return Response.json({ logs });
  } catch (err) {
    console.error("[logs] error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
