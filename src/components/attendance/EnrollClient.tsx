"use client";

import { useRef, useState, useCallback } from "react";
import { Camera, UserPlus, RefreshCw, CheckCircle2 } from "lucide-react";
import { FaceApiProvider, FaceApiLoadingOverlay, useFaceApi } from "./FaceApiLoader";
import { Toast, useToast } from "./Toast";
import { AttendanceNav } from "./AttendanceNav";

// ---------------------------------------------------------------------------
// Inner component (needs FaceApiProvider in parent)
// ---------------------------------------------------------------------------
function EnrollForm() {
  const { faceapi, modelsLoaded } = useFaceApi();
  const { toasts, addToast, removeToast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [name, setName] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const TOTAL_CAPTURES = 5;

  // ---------------------------------------------------------------------------
  // Camera helpers
  // ---------------------------------------------------------------------------
  const openCamera = useCallback(async () => {
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
      setCameraOpen(true);
    } catch {
      setCameraError(
        "Camera access denied. Please allow camera permissions and try again."
      );
    }
  }, []);

  const closeCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
    setCaptureCount(0);
    setCapturing(false);
    setCountdown(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Auto-capture 5 photos with 1-second intervals
  // ---------------------------------------------------------------------------
  const startCapture = useCallback(async () => {
    if (!faceapi || !videoRef.current || !modelsLoaded) return;
    setCapturing(true);
    setCaptureCount(0);

    const descriptors: Float32Array[] = [];
    const video = videoRef.current;

    for (let i = 0; i < TOTAL_CAPTURES; i++) {
      // Countdown
      setCountdown(3);
      await delay(1000);
      setCountdown(2);
      await delay(1000);
      setCountdown(1);
      await delay(1000);
      setCountdown(null);

      // Detect face
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        addToast(`Photo ${i + 1}: No face detected — retrying…`, "info");
        i--; // retry
        continue;
      }

      descriptors.push(detection.descriptor);
      setCaptureCount((prev) => prev + 1);

      // Flash effect on canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "rgba(168,230,61,0.35)";
          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          await delay(150);
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }

      await delay(500);
    }

    setCapturing(false);

    if (descriptors.length === 0) {
      addToast("No faces captured. Please try again.", "error");
      return;
    }

    // Average all descriptors into one
    const avgDescriptor = averageDescriptors(descriptors);
    await enrollEmployee(name.trim(), Array.from(avgDescriptor));
  }, [faceapi, modelsLoaded, name, addToast]);

  // ---------------------------------------------------------------------------
  // Enroll
  // ---------------------------------------------------------------------------
  async function enrollEmployee(employeeName: string, descriptor: number[]) {
    setEnrolling(true);
    try {
      const res = await fetch("/api/attendance/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: employeeName, face_descriptor: descriptor }),
      });
      if (!res.ok) throw new Error("Enrolment failed");
      addToast(`✓ ${employeeName} enrolled successfully!`, "success");
      setSuccess(true);
      closeCamera();
      setName("");
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      addToast("Enrolment failed. Please try again.", "error");
    } finally {
      setEnrolling(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto">
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#a8e63d]/10 border border-[#a8e63d]/20 flex items-center justify-center">
            <UserPlus size={18} className="text-[#a8e63d]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Enroll Employee</h2>
            <p className="text-xs text-gray-500">
              Capture 5 face photos to register a new employee
            </p>
          </div>
        </div>
      </div>

      <FaceApiLoadingOverlay />

      {modelsLoaded && (
        <div className="space-y-6">
          {/* Name input */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Employee Name
            </label>
            <input
              id="employee-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chibuike Okafor"
              className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#a8e63d]/50 focus:ring-1 focus:ring-[#a8e63d]/20 transition-all"
              disabled={cameraOpen || enrolling}
            />
          </div>

          {/* Camera error */}
          {cameraError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
              {cameraError}
            </div>
          )}

          {/* Camera view */}
          {cameraOpen && (
            <div className="relative rounded-2xl overflow-hidden bg-black border border-[#222]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                width={640}
                height={480}
              />

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#a8e63d] text-8xl font-black drop-shadow-2xl animate-ping">
                    {countdown}
                  </span>
                </div>
              )}

              {/* Progress */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#a8e63d] animate-pulse" />
                  <span className="text-xs font-bold text-[#a8e63d]">
                    {capturing ? `Capture ${captureCount}/${TOTAL_CAPTURES}` : "Live"}
                  </span>
                </div>
                {/* Capture progress dots */}
                <div className="flex gap-1.5 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {Array.from({ length: TOTAL_CAPTURES }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i < captureCount ? "bg-[#a8e63d]" : "bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Face guide overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-56 border-2 border-[#a8e63d]/40 rounded-full" />
              </div>
            </div>
          )}

          {/* Success state */}
          {success && (
            <div className="flex items-center gap-3 bg-[#a8e63d]/10 border border-[#a8e63d]/30 rounded-xl p-4">
              <CheckCircle2 className="text-[#a8e63d]" size={18} />
              <span className="text-sm text-[#a8e63d] font-semibold">
                Employee enrolled successfully!
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {!cameraOpen ? (
              <button
                id="btn-open-camera"
                onClick={openCamera}
                disabled={!name.trim() || enrolling}
                className="flex-1 flex items-center justify-center gap-2 bg-[#a8e63d] hover:bg-[#bef558] disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 font-bold text-sm px-6 py-3.5 rounded-xl transition-all"
              >
                <Camera size={16} />
                Open Camera
              </button>
            ) : (
              <>
                <button
                  id="btn-capture"
                  onClick={startCapture}
                  disabled={capturing || enrolling || !name.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#a8e63d] hover:bg-[#bef558] disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 font-bold text-sm px-6 py-3.5 rounded-xl transition-all"
                >
                  {capturing || enrolling ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                      {enrolling ? "Saving…" : "Capturing…"}
                    </span>
                  ) : (
                    <>
                      <Camera size={16} />
                      Capture Face
                    </>
                  )}
                </button>
                <button
                  id="btn-close-camera"
                  onClick={closeCamera}
                  disabled={capturing}
                  className="px-4 py-3.5 rounded-xl border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#3a3a3a] transition-all disabled:opacity-40"
                >
                  <RefreshCw size={16} />
                </button>
              </>
            )}
          </div>

          {/* Tips */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tips for best results</p>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>• Face the camera directly in good lighting</li>
              <li>• Keep your face within the oval guide</li>
              <li>• Remain still during each capture</li>
              <li>• Remove sunglasses or hats</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exported wrapper with FaceApiProvider
// ---------------------------------------------------------------------------
export function EnrollClient() {
  return (
    <>
      <AttendanceNav />
      <EnrollForm />
    </>
  );
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------
function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function averageDescriptors(descriptors: Float32Array[]): Float32Array {
  const length = descriptors[0].length;
  const avg = new Float32Array(length);
  for (const d of descriptors) {
    for (let i = 0; i < length; i++) avg[i] += d[i];
  }
  for (let i = 0; i < length; i++) avg[i] /= descriptors.length;
  return avg;
}
