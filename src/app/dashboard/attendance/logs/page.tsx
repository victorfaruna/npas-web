"use client";

import dynamic from "next/dynamic";

const LogsClient = dynamic(
  () => import("@/components/attendance/LogsClient").then((mod) => mod.LogsClient),
  { ssr: false }
);

export default function LogsPage() {
  return <LogsClient />;
}
