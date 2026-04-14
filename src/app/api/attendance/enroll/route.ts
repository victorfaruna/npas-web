import { NextRequest } from "next/server";
import { saveEmployee } from "@/lib/attendance-db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, face_descriptor } = body as {
      name: string;
      face_descriptor: number[];
    };

    if (!name || !face_descriptor || !Array.isArray(face_descriptor)) {
      return Response.json(
        { error: "name and face_descriptor are required" },
        { status: 400 }
      );
    }

    const employee = saveEmployee(name.trim(), face_descriptor);
    return Response.json({ employee }, { status: 201 });
  } catch (err) {
    console.error("[enroll] error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
