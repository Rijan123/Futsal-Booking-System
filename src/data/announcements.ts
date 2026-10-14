import type { Announcement } from "@/types";

/**
 * Demo announcement data for FutsalPro prototype.
 * Not connected to a real backend.
 */

export const ANNOUNCEMENT_CATEGORIES: string[] = [
  "Promotion",
  "Tournament",
  "Maintenance",
  "Event",
  "Update",
  "General",
];

export const DISPLAY_STYLES: Array<"modal" | "banner" | "notification"> = [
  "modal",
  "banner",
  "notification",
];

export const DEMO_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-001",
    title: "50% Off Weekday Morning Slots!",
    message:
      "Book any court between 06:00–09:00 Monday to Friday this October and get 50% off the standard hourly rate. Offer valid while slots last. Use code MORNING50 at checkout.",
    category: "Promotion",
    displayStyle: "modal",
    enabled: true,
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    frequency: "once",
    actionLabel: "Book Now",
    actionUrl: "/book",
    image:
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80",
    createdAt: "2026-09-28T08:00:00Z",
  },
  {
    id: "ann-002",
    title: "Dashain Cup 2026 — Register Your Team",
    message:
      "FutsalPro is hosting the Dashain Cup 2026 from 10–20 October! Open to teams of 5 and 7. Cash prizes for top 3 teams. Registration fee: NPR 2,500 per team. Limited slots — register early!",
    category: "Tournament",
    displayStyle: "banner",
    enabled: true,
    startDate: "2026-10-01",
    endDate: "2026-10-20",
    frequency: "daily",
    actionLabel: "Register Team",
    actionUrl: "/book",
    createdAt: "2026-09-25T10:00:00Z",
  },
  {
    id: "ann-003",
    title: "Elite Court 4 — Scheduled Maintenance",
    message:
      "Elite Court 4 is currently closed for turf surface upgrades. We expect to reopen by end of October 2026. We apologise for any inconvenience. Please book Arena Court 1 or Thunder Court 2 as alternatives.",
    category: "Maintenance",
    displayStyle: "notification",
    enabled: false,
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    frequency: "always",
    createdAt: "2026-09-30T06:00:00Z",
  },
];
