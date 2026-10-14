/**
 * Client-side notification store for FutsalPro.
 * Uses localStorage for persistence and CustomEvents for reactive updates.
 * NOTE: This is demo/prototype — not connected to a real backend.
 */

import { DEMO_NOTIFICATIONS } from "@/data/notifications";
import type { Notification } from "@/types";

const STORAGE_KEY = "futsal_notifications";
const EVENT_NAME = "notifications-updated";

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getNotifications(): Notification[] {
  if (typeof window === "undefined") return DEMO_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      // Seed with demo data on first load
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_NOTIFICATIONS));
      return DEMO_NOTIFICATIONS;
    }
    return JSON.parse(raw) as Notification[];
  } catch {
    return DEMO_NOTIFICATIONS;
  }
}

// ─── Write helpers ────────────────────────────────────────────────────────────

function saveNotifications(notifications: Notification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // Storage quota or SSR — fail silently
  }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function addNotification(
  n: Omit<Notification, "id" | "createdAt">
): void {
  const notifications = getNotifications();
  const newNotif: Notification = {
    ...n,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  saveNotifications([newNotif, ...notifications]);
}

export function markAsRead(id: string): void {
  const notifications = getNotifications();
  saveNotifications(
    notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  );
}

export function markAllAsRead(): void {
  const notifications = getNotifications();
  saveNotifications(notifications.map((n) => ({ ...n, read: true })));
}

export function deleteNotification(id: string): void {
  const notifications = getNotifications();
  saveNotifications(notifications.filter((n) => n.id !== id));
}
