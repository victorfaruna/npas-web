"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScanFace, CameraOff } from "lucide-react";
import { FaceApiProvider, FaceApiLoadingOverlay, useFaceApi } from "./FaceApiLoader";
import { Toast, useToast } from "./Toast";
import { AttendanceNav } from "./AttendanceNav";

// ---------------------------------------------------------------------------
// Employee type (from API)
// ---------------------------------------------------------------------------
interface Employee {
  id: number;
  name: string;
  face_descriptor: number[];
}

// ---------------------------------------------------------------------------
// Inner scan component — needs FaceApiProvider
// ---------------------------------------------------------------------------
function ScanView() {
  const { faceapi, modelsLoaded } = useFaceApi();
  const { toasts, addToast, removeToast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const matcherRef = useRef<unknown>(null); // faceapi.FaceMatcher

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [recognizing, setRecognizing] = useState(false);
  const [lastMatch, setLastMatch] = useState<string | null>(null);
  const [employeeCount, setEmployeeCount] = useState(0);

  // ---------------------------------------------------------------------------
  // Load employees and build FaceMatcher on mount (once models are ready)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!modelsLoaded || !faceapi) return;

    async function loadEmployees() {
      try {
        const res = await fetch("/api/attendance/employees");
        const data = await res.json();
        const employees: Employee[] = data.employees;
        setEmployeeCount(employees.length);

        if (employees.length === 0) return;

        const labeledDescriptors = employees.map((emp) => {
          const descriptor = new Float32Array(emp.face_descriptor);
          return new faceapi.LabeledFaceDescriptors(String(emp.id), [descriptor]);
        });

        // Store employee names map keyed by id string for quick lookup
        (matcherRef as React.MutableRefObject<unknown>).current = {
          matcher: new faceapi.FaceMatcher(labeledDescriptors, 0.5),
          nameMap: Object.fromEntries(employees.map((e) => [String(e.id), e])),
        };
      } catch (err) {
        console.error("[ScanView] Failed to load employees:", err);
      }
    }

    loadEmployees();
  }, [modelsLoaded, faceapi]);

  // ---------------------------------------------------------------------------
  // Camera
  // ---------------------------------------------------------------------------
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError(
        "Camera access denied. Please allow camera permissions in your browser settings."
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
    setRecognizing(false);
    setLastMatch(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Recognition loop — every 2 seconds
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!cameraActive || !modelsLoaded || !faceapi) return;

    setRecognizing(true);

    intervalRef.current = setInterval(async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;

      // Sync canvas dimensions to actual video display size
      const { videoWidth, videoHeight } = video;
      canvas.width = videoWidth || 640;
      canvas.height = videoHeight || 480;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.45 }))
        .withFaceLandmarks()
        .withFaceDescriptors();

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dims = { width: canvas.width, height: canvas.height };
      const resized = faceapi.resizeResults(detections, dims);

      const matcherData = matcherRef.current as {
        matcher: { findBestMatch: (d: unknown) => { label: string; distance: number } };
        nameMap: Record<string, Employee>;
      } | null;

      for (const det of resized) {
        const box = det.detection.box;
        let label = "Unknown";
        let isMatch = false;
        let matchedEmployee: Employee | null = null;

        if (matcherData) {
          const result = matcherData.matcher.findBestMatch(det.descriptor);
          if (result.label !== "unknown") {
            isMatch = true;
            matchedEmployee = matcherData.nameMap[result.label] ?? null;
            label = matchedEmployee?.name ?? "Unknown";
          }
        }

        // Draw bounding box
        const color = isMatch ? "#a8e63d" : "#ef4444";
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.shadowBlur = 0;

        // Corner accents
        const cl = 16;
        ctx.lineWidth = 3;
        // top-left
        ctx.beginPath(); ctx.moveTo(box.x, box.y + cl); ctx.lineTo(box.x, box.y); ctx.lineTo(box.x + cl, box.y); ctx.stroke();
        // top-right
        ctx.beginPath(); ctx.moveTo(box.x + box.width - cl, box.y); ctx.lineTo(box.x + box.width, box.y); ctx.lineTo(box.x + box.width, box.y + cl); ctx.stroke();
        // bottom-left
        ctx.beginPath(); ctx.moveTo(box.x, box.y + box.height - cl); ctx.lineTo(box.x, box.y + box.height); ctx.lineTo(box.x + cl, box.y + box.height); ctx.stroke();
        // bottom-right
        ctx.beginPath(); ctx.moveTo(box.x + box.width - cl, box.y + box.height); ctx.lineTo(box.x + box.width, box.y + box.height); ctx.lineTo(box.x + box.width, box.y + box.height - cl); ctx.stroke();

        // Name label
        const labelPad = 6;
        const labelH = 22;
        ctx.fillStyle = isMatch ? "rgba(168,230,61,0.85)" : "rgba(239,68,68,0.85)";
        ctx.fillRect(box.x, box.y - labelH - 2, ctx.measureText(label).width + labelPad * 2, labelH);
        ctx.fillStyle = isMatch ? "#0a0a0a" : "#ffffff";
        ctx.font = "bold 12px Inter, system-ui, sans-serif";
        ctx.fillText(label, box.x + labelPad, box.y - 8);

        // Log match
        if (isMatch && matchedEmployee) {
          setLastMatch(matchedEmployee.name);
          logAttendance(matchedEmployee, addToast);
        }
      }

      if (resized.length === 0) {
        setLastMatch(null);
      }
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cameraActive, modelsLoaded, faceapi, addToast]);

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto">
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#a8e63d]/10 border border-[#a8e63d]/20 flex items-center justify-center">
            <ScanFace size={18} className="text-[#a8e63d]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Live Attendance Scan</h2>
            <p className="text-xs text-gray-500">
              {employeeCount} employee{employeeCount !== 1 ? "s" : ""} enrolled
            </p>
          </div>
        </div>

        {/* Recognition active dot */}
        {recognizing && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#a8e63d]/10 border border-[#a8e63d]/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#a8e63d] animate-pulse" />
            <span className="text-xs font-bold text-[#a8e63d]">RECOGNISING</span>
          </div>
        )}
      </div>

      <FaceApiLoadingOverlay />

      {modelsLoaded && (
        <div className="space-y-6">
          {/* Camera error */}
          {cameraError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <CameraOff size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{cameraError}</p>
            </div>
          )}

          {/* No employees warning */}
          {employeeCount === 0 && !cameraActive && (
            <div className="bg-[#1a1500] border border-yellow-500/30 rounded-xl p-4 text-sm text-yellow-400">
              ⚠ No employees enrolled yet. Go to <strong>Enroll</strong> tab to register faces first.
            </div>
          )}

          {/* Camera view */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-[#222] aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />

            {/* Placeholder when camera is off */}
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0a0a]">
                <div className="w-16 h-16 rounded-2xl bg-[#181818] border border-[#2a2a2a] flex items-center justify-center">
                  <ScanFace size={28} className="text-gray-600" />
                </div>
                <p className="text-sm text-gray-600">Camera is off</p>
              </div>
            )}

            {/* Last match banner */}
            {lastMatch && (
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 bg-[#a8e63d]/90 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-gray-900 animate-pulse" />
                <span className="text-gray-900 font-bold text-sm">
                  ✓ {lastMatch} — Present
                </span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {!cameraActive ? (
              <button
                id="btn-start-scan"
                onClick={startCamera}
                disabled={employeeCount === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-[#a8e63d] hover:bg-[#bef558] disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 font-bold text-sm px-6 py-3.5 rounded-xl transition-all"
              >
                <ScanFace size={16} />
                Start Scanning
              </button>
            ) : (
              <button
                id="btn-stop-scan"
                onClick={stopCamera}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-bold text-sm px-6 py-3.5 rounded-xl transition-all"
              >
                <CameraOff size={16} />
                Stop Camera
              </button>
            )}
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-3">
              <p className="font-semibold text-gray-400 mb-1">Recognition</p>
              <p>Scans every 2 seconds using SSD MobileNet v1</p>
            </div>
            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-3">
              <p className="font-semibold text-gray-400 mb-1">Deduplication</p>
              <p>Same employee logged at most once per hour</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exported wrapper
// ---------------------------------------------------------------------------
export function ScanClient() {
  return (
    <>
      <AttendanceNav />
      <ScanView />
    </>
  );
}

// ---------------------------------------------------------------------------
// Attendance logging — module-level dedup cache to avoid spamming the API
// ---------------------------------------------------------------------------
const pendingLogs = new Set<number>();

async function logAttendance(
  employee: Employee,
  addToast: (msg: string, t?: "success" | "error" | "info") => void
) {
  if (pendingLogs.has(employee.id)) return;
  pendingLogs.add(employee.id);

  try {
    const res = await fetch("/api/attendance/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_id: employee.id,
        name: employee.name,
        status: "present",
      }),
    });

    const data = await res.json();
    if (!data.duplicate) {
      const time = new Date().toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      });
      addToast(`✓ ${employee.name} marked present — ${time}`, "success");
    }
  } catch (err) {
    console.error("[logAttendance] error:", err);
  } finally {
    // Allow re-logging after 5 minutes (in-memory; server enforces 1-hour dedup)
    setTimeout(() => pendingLogs.delete(employee.id), 5 * 60 * 1000);
  }
}
