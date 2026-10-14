"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";
import { BookingCalendar } from "@/components/admin/BookingCalendar";
import { DailyCourtTimeline } from "@/components/admin/DailyCourtTimeline";
import { PageHeader } from "@/components/admin/PageHeader";
import { BookingStatusBadge } from "@/components/ui/BookingStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { getItem, STORAGE_KEYS } from "@/lib/storage";
import { DEMO_BOOKINGS } from "@/data/bookings";
import { DEMO_COURTS } from "@/data/courts";
import { formatTime } from "@/lib/utils";
import type { Booking } from "@/types";

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>("2026-10-15");

  useEffect(() => {
    const stored = getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, DEMO_BOOKINGS);
    setBookings(stored);
  }, []);

  const courts = DEMO_COURTS;

  const selectedDateBookings = selectedDate
    ? bookings.filter((b) => b.date === selectedDate)
    : [];

  const formattedSelectedDate = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Booking Calendar"
        description="View and manage bookings by date"
        action={
          <Link href="/book">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4" aria-hidden="true" />
              New Booking
            </Button>
          </Link>
        }
      />

      {/* Two-panel: Calendar (left) + Selected date panel (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar: 2/3 width on desktop */}
        <div className="lg:col-span-2">
          <BookingCalendar
            bookings={bookings}
            courts={courts}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>

        {/* Selected date panel: 1/3 width on desktop */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {!selectedDate ? (
            <div className="p-6 h-full flex items-center justify-center">
              <EmptyState
                icon={CalendarDays}
                title="Select a date"
                description="Click a date on the calendar to see bookings for that day."
              />
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-semibold text-text-primary">
                  {formattedSelectedDate}
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  {selectedDateBookings.length} booking
                  {selectedDateBookings.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="divide-y divide-border overflow-y-auto max-h-[500px]">
                {selectedDateBookings.length === 0 ? (
                  <div className="p-6">
                    <EmptyState
                      icon={CalendarDays}
                      title="No bookings"
                      description="There are no bookings for this date."
                    />
                  </div>
                ) : (
                  selectedDateBookings.map((b) => (
                    <div key={b.id} className="px-4 py-3">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {b.customerName}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {b.courtName}
                          </p>
                        </div>
                        <BookingStatusBadge status={b.status} />
                      </div>
                      <p className="text-xs text-text-secondary mb-2">
                        {formatTime(b.startTime)} – {formatTime(b.endTime)} ·{" "}
                        {b.duration}h
                      </p>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/admin/bookings"
                          className="text-xs text-accent hover:text-accent/80 transition-colors"
                        >
                          View
                        </Link>
                        <span className="text-text-secondary/40">·</span>
                        <Link
                          href="/admin/bookings"
                          className="text-xs text-text-secondary hover:text-text-primary transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-3 border-t border-border">
                <Link href={`/book?date=${selectedDate}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    New Booking on This Date
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Daily court timeline (full width) */}
      {selectedDate && (
        <DailyCourtTimeline
          bookings={bookings}
          courts={courts}
          date={selectedDate}
        />
      )}
    </div>
  );
}
