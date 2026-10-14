/**
 * Booking service utilities for FutsalPro.
 * Saves bookings to localStorage and fires a notification.
 * NOTE: Demo/prototype only — not connected to a real backend.
 */

import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import { addNotification } from "@/lib/notificationStore";
import { DEMO_BOOKINGS } from "@/data/bookings";
import type { Booking } from "@/types";

export function saveBooking(booking: Booking): void {
  const existing = getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, DEMO_BOOKINGS);
  const updated = [...existing, booking];
  setItem(STORAGE_KEYS.BOOKINGS, updated);

  // Add a notification so the admin can see the new booking
  addNotification({
    type: "booking_new",
    title: "New Booking Received",
    message: `${booking.customerName} has booked ${booking.courtName} for ${booking.date} at ${booking.startTime}.`,
    read: false,
    relatedId: booking.id,
    relatedType: "booking",
  });
}
