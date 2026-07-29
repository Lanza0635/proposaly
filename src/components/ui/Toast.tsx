"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error";

type ToastProps = {
  message: string;
  open: boolean;
  onClose: () => void;
  variant?: ToastVariant;
  durationMs?: number;
};

export function Toast({
  message,
  open,
  onClose,
  variant = "success",
  durationMs = 3200,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timer);
  }, [open, onClose, durationMs]);

  const isSuccess = variant === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      aria-live={isSuccess ? "polite" : "assertive"}
      className={cn(
        "pointer-events-none fixed bottom-6 right-6 z-50 transition duration-300",
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <div
        className={cn(
          "pointer-events-auto flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg shadow-ink-950/10",
          isSuccess ? "border-accent/20" : "border-red-200"
        )}
      >
        {isSuccess ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        ) : (
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        )}
        <p className="max-w-xs pr-2 text-sm font-medium text-ink-800">{message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="rounded-md p-1 text-ink-400 transition hover:bg-ink-50 hover:text-ink-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** @deprecated Prefer Toast — kept for existing imports */
export function SuccessToast(props: Omit<ToastProps, "variant">) {
  return <Toast {...props} variant="success" />;
}
