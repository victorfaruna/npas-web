"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, X, AlertCircle } from "lucide-react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onRemove(toast.id), 4500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, onRemove]);

  const colors = {
    success: {
      bg: "bg-[#0d1f0d] border-[#a8e63d]/40",
      icon: "text-[#a8e63d]",
      dot: "bg-[#a8e63d]",
    },
    error: {
      bg: "bg-[#1f0d0d] border-red-500/40",
      icon: "text-red-400",
      dot: "bg-red-500",
    },
    info: {
      bg: "bg-[#0d0d1f] border-blue-500/40",
      icon: "text-blue-400",
      dot: "bg-blue-500",
    },
  };

  const c = colors[toast.type];
  const Icon = toast.type === "success" ? CheckCircle : AlertCircle;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border ${c.bg} shadow-2xl backdrop-blur-md min-w-[280px] max-w-[360px] animate-in slide-in-from-bottom-4 fade-in duration-300`}
    >
      <Icon size={18} className={`${c.icon} mt-0.5 flex-shrink-0`} />
      <p className="text-sm text-white flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hook for managing toast state
// ---------------------------------------------------------------------------
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  function addToast(message: string, type: ToastMessage["type"] = "success") {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return { toasts, addToast, removeToast };
}
