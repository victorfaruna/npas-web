"use client";

import dynamic from "next/dynamic";

const ScanClient = dynamic(
  () => import("@/components/attendance/ScanClient").then((mod) => mod.ScanClient),
  { ssr: false }
);

export default function ScanPage() {
  return <ScanClient />;
}
