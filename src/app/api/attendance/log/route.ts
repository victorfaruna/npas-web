import { NextRequest } from "next/server";
import { hasRecentLog, saveLog } from "@/lib/attendance-db";

// Global SSE subscriber set — holds writer references for the stream endpoint
// This is module-scoped so it persists across requests in the same Node process.
export const sseSubscribers = new Set<ReadableStreamDefaultController<Uint8Array>>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employee_id, name, status = "present" } = body as {
      employee_id: number;
      name: string;
      status?: "present";
    };

    if (!employee_id || !name) {
      return Response.json(
        { error: "employee_id and name are required" },
        { status: 400 }
      );
    }

    // Deduplicate: reject if already logged within 1 hour
    if (hasRecentLog(employee_id)) {
      return Response.json(
        { duplicate: true, message: "Already logged within the last hour" },
        { status: 200 }
      );
    }

    const log = saveLog(employee_id, name, status);

    // Push to all SSE subscribers
    const payload = `data: ${JSON.stringify(log)}\n\n`;
    const encoder = new TextEncoder();
    for (const controller of sseSubscribers) {
      try {
        controller.enqueue(encoder.encode(payload));
      } catch {
        // Subscriber disconnected — remove it
        sseSubscribers.delete(controller);
      }
    }

    return Response.json({ log }, { status: 201 });
  } catch (err) {
    console.error("[log] error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
