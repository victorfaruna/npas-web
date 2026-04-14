"use client";

import { FaceApiProvider } from "@/components/attendance/FaceApiLoader";

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FaceApiProvider>{children}</FaceApiProvider>;
}
