import type { Notification } from "@/types";

/**
 * Demo notification data for FutsalPro prototype.
 * Not connected to a real backend.
 */
export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-001",
    type: "booking_new",
    title: "New Booking Received",
    message: "Rajan Shrestha has booked Arena Court 1 for 1 Oct 2026 at 08:00.",
    read: false,
    createdAt: "2026-09-25T10:31:00Z",
    relatedId: "bk-001",
    relatedType: "booking",
  },
  {
    id: "notif-002",
    type: "booking_cancelled",
    title: "Booking Cancelled",
    message:
      "Dipesh Tamang has cancelled their booking for Thunder Court 2 on 2 Oct 2026.",
    read: false,
    createdAt: "2026-09-26T11:00:00Z",
    relatedId: "bk-002",
    relatedType: "booking",
  },
  {
    id: "notif-003",
    type: "maintenance_reminder",
    title: "Court Maintenance Reminder",
    message:
      "Elite Court 4 is scheduled for turf maintenance starting 1 Oct 2026. Ensure it is marked unavailable.",
    read: true,
    createdAt: "2026-09-29T08:00:00Z",
    relatedId: "court-4",
    relatedType: "court",
  },
  {
    id: "notif-004",
    type: "announcement_published",
    title: "New Announcement Published",
    message:
      'The "Dashain Cup 2026" tournament announcement is now live on the public website.',
    read: false,
    createdAt: "2026-09-25T10:05:00Z",
    relatedId: "ann-002",
    relatedType: "announcement",
  },
  {
    id: "notif-005",
    type: "booking_pending",
    title: "Booking Awaiting Confirmation",
    message:
      "Anish Karki is waiting for confirmation of Thunder Court 2 on 5 Oct 2026 at 18:00.",
    read: false,
    createdAt: "2026-09-29T12:01:00Z",
    relatedId: "bk-005",
    relatedType: "booking",
  },
  {
    id: "notif-006",
    type: "revenue_milestone",
    title: "Revenue Milestone Reached",
    message:
      "FutsalPro has crossed NPR 50,000 in confirmed bookings this month. Great work!",
    read: true,
    createdAt: "2026-10-07T18:00:00Z",
  },
  {
    id: "notif-007",
    type: "customer_feedback",
    title: "Customer Feedback Received",
    message:
      'Rohan Thapa left a 5-star review: "Excellent facilities and smooth booking experience!"',
    read: true,
    createdAt: "2026-10-08T09:15:00Z",
    relatedId: "bk-007",
    relatedType: "booking",
  },
  {
    id: "notif-008",
    type: "system_update",
    title: "System Update Complete",
    message:
      "FutsalPro booking system has been updated to the latest version. All features are operational.",
    read: true,
    createdAt: "2026-10-01T00:30:00Z",
  },
];
