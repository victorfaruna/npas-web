"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
// We use `any` here because face-api.js has complex internal types and is
// only loaded dynamically in the browser.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FaceApiModule = any;

interface FaceApiContextValue {
  faceapi: FaceApiModule | null;
  modelsLoaded: boolean;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const FaceApiContext = createContext<FaceApiContextValue>({
  faceapi: null,
  modelsLoaded: false,
  error: null,
});

export function useFaceApi() {
  return useContext(FaceApiContext);
}

// ---------------------------------------------------------------------------
// Provider — loads face-api.js models once per mount
// ---------------------------------------------------------------------------
// Global singleton to track loading across component remounts
let globalLoadPromise: Promise<any> | null = null;
let globalFaceapi: any = null;

export function FaceApiProvider({ children }: { children: React.ReactNode }) {
  const [faceapi, setFaceapi] = useState<FaceApiModule>(globalFaceapi);
  const [modelsLoaded, setModelsLoaded] = useState(!!globalFaceapi);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already loaded in state, we are done
    if (modelsLoaded) return;

    // If models are loaded globally but not in this component's state (e.g. after a remount)
    if (globalFaceapi) {
      setFaceapi(globalFaceapi);
      setModelsLoaded(true);
      return;
    }

    let isMounted = true;

    async function initialize() {
      if (!globalLoadPromise) {
        console.log("[FaceApiLoader] Initializing global load promise...");
        globalLoadPromise = (async () => {
          const module = await import("@vladmandic/face-api");
          const api = module.default || module;
          const MODEL_URL = "/models";
          
          console.log("[FaceApiLoader] Loading models from:", MODEL_URL);
          // Load in series to be safe
          await api.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
          await api.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
          await api.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
          
          globalFaceapi = api;
          console.log("[FaceApiLoader] Global initialization complete");
          return api;
        })();
      }

      try {
        const api = await globalLoadPromise;
        if (isMounted) {
          setFaceapi(api);
          setModelsLoaded(true);
          console.log("[FaceApiLoader] Local state sync complete");
        }
      } catch (err) {
        console.error("[FaceApiLoader] Global load failed:", err);
        if (isMounted) {
          setError(`Failed to load AI models: ${err instanceof Error ? err.message : String(err)}`);
          globalLoadPromise = null; // Allow retry on next mount
        }
      }
    }

    initialize();
    return () => { isMounted = false; };
  }, [modelsLoaded, faceapi]);

  return (
    <FaceApiContext.Provider value={{ faceapi, modelsLoaded, error }}>
      {children}
    </FaceApiContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Loading overlay — shown while models are loading
// ---------------------------------------------------------------------------
export function FaceApiLoadingOverlay() {
  const { modelsLoaded, error } = useFaceApi();

  if (modelsLoaded) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      {error ? (
        <div className="max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-xl">⚠</span>
          </div>
          <p className="text-red-400 text-sm leading-relaxed">{error}</p>
        </div>
      ) : (
        <>
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-[#a8e63d]/20" />
            <div className="absolute inset-0 rounded-full border-2 border-t-[#a8e63d] animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-white">Loading AI Models</p>
            <p className="text-xs text-gray-500 mt-1">
              Initialising face recognition networks…
            </p>
          </div>
        </>
      )}
    </div>
  );
}
