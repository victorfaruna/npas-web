import { sseSubscribers } from "@/app/api/attendance/log/route";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      // Send initial keep-alive comment
      controller.enqueue(encoder.encode(": connected\n\n"));
      sseSubscribers.add(controller);
    },
    cancel(controller) {
      sseSubscribers.delete(controller as ReadableStreamDefaultController<Uint8Array>);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
