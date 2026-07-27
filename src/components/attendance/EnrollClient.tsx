"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, UserPlus, RefreshCw, CheckCircle2 } from "lucide-react";
import {
  FaceApiProvider,
  FaceApiLoadingOverlay,
  useFaceApi,
} from "./FaceApiLoader";
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
        video: { facingMode: { ideal: "user" }, width: 640, height: 480 },
      });
      streamRef.current = stream;
      // Mount the video element first, then attach stream in useEffect
      setCameraOpen(true);
    } catch {
      setCameraError(
        "Camera access denied. Please allow camera permissions and try again.",
      );
    }
  }, []);

  // Attach stream to video element once it mounts
  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [cameraOpen]);

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
    const MAX_RETRIES_PER_SHOT = 3;

    for (let i = 0; i < TOTAL_CAPTURES; i++) {
      // Brief countdown — 1 second only
      setCountdown(1);
      await delay(1000);
      setCountdown(null);

      // Detect face — with a capped retry limit
      let detection = null;
      let attempts = 0;
      while (!detection && attempts < MAX_RETRIES_PER_SHOT) {
        detection = await faceapi
          .detectSingleFace(
            video,
            new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 }),
          )
          .withFaceLandmarks()
          .withFaceDescriptor();
        attempts++;
        if (!detection && attempts < MAX_RETRIES_PER_SHOT) {
          await delay(500);
        }
      }

      if (!detection) {
        addToast(`Shot ${i + 1}: No face detected — skipping`, "info");
        continue;
      }

      descriptors.push(detection.descriptor);
      setCaptureCount((prev) => prev + 1);

      // Flash effect on canvas
      if (canvasRef.current && videoRef.current) {
        const cv = canvasRef.current;
        cv.width = videoRef.current.videoWidth || cv.offsetWidth;
        cv.height = videoRef.current.videoHeight || cv.offsetHeight;
        const ctx = cv.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "rgba(255,255,255,0.2)";
          ctx.fillRect(0, 0, cv.width, cv.height);
          await delay(150);
          ctx.clearRect(0, 0, cv.width, cv.height);
        }
      }

      await delay(400);
    }

    setCapturing(false);

    if (descriptors.length === 0) {
      addToast("No faces captured. Make sure your face is visible and well-lit.", "error");
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
        body: JSON.stringify({
          name: employeeName,
          face_descriptor: descriptor,
        }),
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
    <div className="max-w-6xl mx-auto">
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="my-8">
        <AttendanceNav />

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-md bg-muted border border-border flex items-center justify-center">
            <UserPlus size={18} className="text-foreground/60" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Enroll Employee
            </h2>
            <p className="text-sm text-foreground/60">
              Capture 5 face photos to register a new employee
            </p>
          </div>
        </div>
      </div>

      <FaceApiLoadingOverlay />

      {modelsLoaded && (
        <div className="space-y-6 max-w-120">
          {/* Name input */}
          <div>
            <label className="block text-xs font-semibold text-foreground/60 mb-2 uppercase tracking-wider">
              Employee Name
            </label>
            <input
              id="employee-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chibuike Okafor"
              className="w-full bg-card border border-border rounded-md px-4 py-3 text-foreground text-sm placeholder:text-foreground/40 focus:outline-none focus:border-border  transition-all"
              disabled={cameraOpen || enrolling}
            />
          </div>

          {/* Camera error */}
          {cameraError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 text-sm text-red-400">
              {cameraError}
            </div>
          )}

          {/* Camera view */}
          {cameraOpen && (
            <div className="relative rounded-lg overflow-hidden bg-background border border-border">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video object-cover relative z-10"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-20 pointer-events-none"
              />

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-foreground/60 text-8xl font-semibold drop-shadow-2xl animate-ping">
                    {countdown}
                  </span>
                </div>
              )}

              {/* Progress */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-background/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-xs font-semibold text-foreground/60">
                    {capturing
                      ? `Capture ${captureCount}/${TOTAL_CAPTURES}`
                      : "Live"}
                  </span>
                </div>
                {/* Capture progress dots */}
                <div className="flex gap-1.5 bg-background/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {Array.from({ length: TOTAL_CAPTURES }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i < captureCount ? "bg-white" : "bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Face guide overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-56 border-2 border-border rounded-full" />
              </div>
            </div>
          )}

          {/* Success state */}
          {success && (
            <div className="flex items-center gap-3 bg-muted border border-border rounded-md p-4">
              <CheckCircle2 className="text-foreground/60" size={18} />
              <span className="text-sm text-foreground/60 font-semibold">
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
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-sm px-6 py-3.5 rounded-md transition-all"
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
                  className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-sm px-6 py-3.5 rounded-md transition-all"
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
                  className="px-4 py-3.5 rounded-md border border-border text-foreground/60 hover:text-foreground hover:border-border transition-all disabled:opacity-40"
                >
                  <RefreshCw size={16} />
                </button>
              </>
            )}
          </div>

          {/* Tips */}
          <div className="bg-card border border-border rounded-md p-4 space-y-2">
            <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
              Tips for best results
            </p>
            <ul className="space-y-1 text-sm text-foreground/60">
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
