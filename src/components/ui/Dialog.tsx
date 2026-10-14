"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog sub-components must be used inside <Dialog>");
  return ctx;
}

// ─── Dialog (root) ────────────────────────────────────────────────────────────

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = useCallback(
    (value: boolean) => {
      setInternalOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

// ─── DialogTrigger ────────────────────────────────────────────────────────────

interface DialogTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
}

export function DialogTrigger({ children }: DialogTriggerProps) {
  const { setOpen } = useDialogContext();

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      setOpen(true);
    },
  });
}

// ─── DialogContent ────────────────────────────────────────────────────────────

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export function DialogContent({ children, className, onClose }: DialogContentProps) {
  const { open, setOpen } = useDialogContext();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ESC key close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!open || !contentRef.current) return;
    const focusable = contentRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (focusable.length === 0) { e.preventDefault(); return; }
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };

    document.addEventListener("keydown", handleTab);
    first?.focus();
    return () => document.removeEventListener("keydown", handleTab);
  }, [open]);

  // Click-outside close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      setOpen(false);
      onClose?.();
    }
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={contentRef}
        className={cn(
          "relative bg-elevated rounded-2xl shadow-2xl border border-border",
          "w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto",
          "animate-fade-in",
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

// ─── DialogHeader ─────────────────────────────────────────────────────────────

export function DialogHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between px-6 py-4 border-b border-border", className)}>
      {children}
    </div>
  );
}

// ─── DialogTitle ──────────────────────────────────────────────────────────────

export function DialogTitle({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <h2 id={id} className={cn("text-lg font-semibold text-text-primary", className)}>
      {children}
    </h2>
  );
}

// ─── DialogClose button (built into header) ───────────────────────────────────

export function DialogClose() {
  const { setOpen } = useDialogContext();
  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-card ml-auto flex-shrink-0"
      aria-label="Close dialog"
    >
      <X className="h-5 w-5" />
    </button>
  );
}

// ─── DialogFooter ─────────────────────────────────────────────────────────────

export function DialogFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-end gap-2 px-6 py-4 border-t border-border", className)}>
      {children}
    </div>
  );
}
