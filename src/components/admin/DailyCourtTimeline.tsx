"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Booking, Court } from "@/types";

interface DailyCourtTimelineProps {
  bookings: Booking[];
  courts: Court[];
  date: string;
}

// Hours 06:00 to 22:00 (inclusive start, exclusive end at each slot)
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // [6, 7, ..., 21]

function padTwo(n: number): string {
  return String(n).padStart(2, "0");
}

function timeToHour(time: string): number {
  return parseInt(time.split(":")[0], 10);
}

function getBookingForSlot(
  bookings: Booking[],
  courtId: string,
  hour: number
): Booking | null {
  for (const b of bookings) {
    if (b.courtId !== courtId) continue;
    const start = timeToHour(b.startTime);
    const end = timeToHour(b.endTime);
    if (hour >= start && hour < end) return b;
  }
  return null;
}

const STATUS_CELL: Record<
  Booking["status"],
  { bg: string; text: string; border: string }
> = {
  confirmed: {
    bg: "bg-accent-secondary/20",
    text: "text-accent-secondary",
    border: "border-accent-secondary/40",
  },
  pending: {
    bg: "bg-pending/20",
    text: "text-pending",
    border: "border-pending/40",
  },
  cancelled: {
    bg: "bg-cancelled/20",
    text: "text-cancelled",
    border: "border-cancelled/40",
  },
};

export function DailyCourtTimeline({
  bookings,
  courts,
  date,
}: DailyCourtTimelineProps) {
  const dayBookings = bookings.filter((b) => b.date === date);

  if (!date) {
    return (
      <div className="text-center py-8 text-text-secondary text-sm">
        Select a date to view the timeline
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">
          Court Timeline —{" "}
          {new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Showing 06:00 – 22:00 · Click an available slot to book
        </p>
      </div>

      <div className="overflow-x-auto">
        <div
          className="min-w-[640px]"
          style={{ display: "grid", gridTemplateColumns: `140px repeat(${HOURS.length}, 1fr)` }}
        >
          {/* Time header row */}
          {/* Empty top-left corner */}
          <div className="bg-elevated border-r border-b border-border px-2 py-2 text-xs text-text-secondary font-medium flex items-center">
            Court
          </div>
          {HOURS.map((h) => (
            <div
              key={h}
              className="bg-elevated border-r border-b border-border px-1 py-2 text-center text-[10px] text-text-secondary font-medium"
            >
              {padTwo(h)}:00
            </div>
          ))}

          {/* Court rows */}
          {courts.map((court) => (
            <React.Fragment key={court.id}>
              {/* Court label */}
              <div className="border-r border-b border-border px-2 py-3 text-xs text-text-primary font-medium bg-sidebar/40 flex items-center">
                <span className="truncate">{court.name}</span>
              </div>

              {/* Hourly cells */}
              {HOURS.map((h) => {
                const booking = getBookingForSlot(dayBookings, court.id, h);
                const isStartHour = booking
                  ? timeToHour(booking.startTime) === h
                  : false;

                if (booking) {
                  const style = STATUS_CELL[booking.status];
                  return (
                    <div
                      key={h}
                      className={cn(
                        "border-r border-b border-border px-1 py-1 flex items-center justify-center",
                        style.bg,
                        "border-t",
                        style.border
                      )}
                      title={`${booking.customerName} (${booking.status})`}
                    >
                      {isStartHour && (
                        <span
                          className={cn(
                            "text-[9px] font-medium truncate w-full text-center leading-tight",
                            style.text
                          )}
                        >
                          {booking.customerName.split(" ")[0]}
                        </span>
                      )}
                    </div>
                  );
                }

                if (court.status === "maintenance") {
                  return (
                    <div
                      key={h}
                      className="border-r border-b border-border bg-maintenance/10 flex items-center justify-center"
                      title="Under maintenance"
                    />
                  );
                }

                // Available — link to book
                return (
                  <Link
                    key={h}
                    href={`/book?court=${court.id}&date=${date}&time=${padTwo(h)}:00`}
                    className="border-r border-b border-border bg-elevated hover:bg-accent/10 hover:border-accent/30 transition-colors flex items-center justify-center group"
                    title={`Book ${court.name} at ${padTwo(h)}:00`}
                    aria-label={`Book ${court.name} at ${padTwo(h)}:00 on ${date}`}
                  >
                    <span className="text-[9px] text-accent opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      +
                    </span>
                  </Link>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-3 border-t border-border">
        <span className="text-xs text-text-secondary">Legend:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-elevated border border-border" />
          <span className="text-xs text-text-secondary">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-accent-secondary/20 border border-accent-secondary/40" />
          <span className="text-xs text-text-secondary">Confirmed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-pending/20 border border-pending/40" />
          <span className="text-xs text-text-secondary">Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-cancelled/20 border border-cancelled/40" />
          <span className="text-xs text-text-secondary">Cancelled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-maintenance/10 border border-maintenance/30" />
          <span className="text-xs text-text-secondary">Maintenance</span>
        </div>
      </div>
    </div>
  );
}
