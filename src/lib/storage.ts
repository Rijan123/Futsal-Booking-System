/**
 * localStorage helpers for FutsalPro.
 * All keys are prefixed with "futsal_".
 * NOTE: This is demo/prototype persistence — data lives in the browser only.
 * It is NOT connected to a real backend or shared database.
 */

export const STORAGE_KEYS = {
  COURTS: "futsal_courts",
  BOOKINGS: "futsal_bookings",
  ANNOUNCEMENTS: "futsal_announcements",
  NOTIFICATIONS: "futsal_notifications",
  BRANDING: "futsal_branding",
  APPEARANCE: "futsal_appearance",
} as const;

/**
 * Retrieve an item from localStorage, returning `fallback` on any error.
 */
export function getItem<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Persist an item to localStorage, silently swallowing any error
 * (e.g., storage quota exceeded, private browsing).
 */
export function setItem<T>(key: string, value: T): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or not available — fail silently
  }
}
