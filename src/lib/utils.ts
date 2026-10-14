import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx + tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as NPR currency string.
 * Example: formatCurrency(1200) → "NPR 1,200"
 */
export function formatCurrency(n: number): string {
  return `NPR ${n.toLocaleString("en-IN")}`;
}

/**
 * Format a Date or date string as a readable date.
 * Example: formatDate(new Date("2026-10-15")) → "15 Oct 2026"
 */
export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format a time string (HH:mm) to 12-hour clock with AM/PM.
 * Example: formatTime("09:00") → "09:00 AM"
 */
export function formatTime(t: string): string {
  const [hourStr, minuteStr] = t.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr ?? "00";
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const paddedHour = String(displayHour).padStart(2, "0");
  return `${paddedHour}:${minute} ${ampm}`;
}
