/**
 * Lightweight toast event bus for FutsalPro.
 * Components call toast.success / toast.error / etc.
 * ToastProvider listens and renders.
 */

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
}

type ToastListener = (toast: ToastItem) => void;

class ToastBus {
  private listeners: ToastListener[] = [];

  subscribe(listener: ToastListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(toast: Omit<ToastItem, "id">) {
    const item: ToastItem = { ...toast, id: crypto.randomUUID() };
    this.listeners.forEach((l) => l(item));
  }

  success(title: string, message?: string) {
    this.emit({ variant: "success", title, message });
  }

  error(title: string, message?: string) {
    this.emit({ variant: "error", title, message });
  }

  warning(title: string, message?: string) {
    this.emit({ variant: "warning", title, message });
  }

  info(title: string, message?: string) {
    this.emit({ variant: "info", title, message });
  }
}

export const toast = new ToastBus();
