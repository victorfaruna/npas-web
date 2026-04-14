"use client";

import dynamic from "next/dynamic";

const EnrollClient = dynamic(
  () => import("@/components/attendance/EnrollClient").then((mod) => mod.EnrollClient),
  { ssr: false }
);

export default function EnrollPage() {
  return <EnrollClient />;
}
