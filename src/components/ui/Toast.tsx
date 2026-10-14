"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast as toastBus, type ToastItem, type ToastVariant } from "@/lib/toast";

// ─── Config ───────────────────────────────────────────────────────────────────

const DISMISS_AFTER_MS = 4000;

const variantConfig: Record<
  ToastVariant,
  { icon: React.ElementType; border: string; iconClass: string }
> = {
  success: {
    icon: CheckCircle,
    border: "border-l-accent-secondary",
    iconClass: "text-accent-secondary",
  },
  error: {
    icon: XCircle,
    border: "border-l-cancelled",
    iconClass: "text-cancelled",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-l-pending",
    iconClass: "text-pending",
  },
  info: {
    icon: Info,
    border: "border-l-border",
    iconClass: "text-text-secondary",
  },
};

// ─── Single Toast ─────────────────────────────────────────────────────────────

interface SingleToastProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

function SingleToast({ item, onDismiss }: SingleToastProps) {
  const config = variantConfig[item.variant];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(item.id), DISMISS_AFTER_MS);
    return () => clearTimeout(timer);
  }, [item.id, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex items-start gap-3 bg-elevated border border-border border-l-4 rounded-xl px-4 py-3 shadow-lg",
        "animate-fade-in min-w-[280px] max-w-sm",
        config.border
      )}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconClass)} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{item.title}</p>
        {item.message && (
          <p className="text-xs text-text-secondary mt-0.5">{item.message}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="text-text-secondary hover:text-text-primary transition-colors flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── ToastProvider ────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = toastBus.subscribe((item) => {
      setToasts((prev) => [...prev, item]);
    });
    return () => {
      unsubscribe();
      setMounted(false);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <>
      {children}
      {mounted &&
        createPortal(
          <div
            className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
            aria-label="Notifications"
          >
            {toasts.map((item) => (
              <div key={item.id} className="pointer-events-auto">
                <SingleToast item={item} onDismiss={dismiss} />
              </div>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}

// ─── useToast hook ────────────────────────────────────────────────────────────

export function useToast() {
  return toastBus;
}
