"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking, Court } from "@/types";

interface BookingCalendarProps {
  bookings: Booking[];
  courts: Court[];
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
}

const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_DOT: Record<Booking["status"], string> = {
  confirmed: "bg-accent-secondary",
  pending: "bg-pending",
  cancelled: "bg-cancelled",
};

function padDate(n: number): string {
  return String(n).padStart(2, "0");
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${padDate(month + 1)}-${padDate(day)}`;
}

export function BookingCalendar({
  bookings,
  courts,
  onDateSelect,
  selectedDate,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2026, 9, 1)); // Oct 2026
  const [courtFilter, setCourtFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0-indexed

  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayString = "2026-10-15"; // demo today

  const filteredBookings = bookings.filter((b) => {
    if (courtFilter !== "all" && b.courtId !== courtFilter) return false;
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    return true;
  });

  const bookingsByDate: Record<string, Booking[]> = {};
  for (const b of filteredBookings) {
    if (!bookingsByDate[b.date]) bookingsByDate[b.date] = [];
    bookingsByDate[b.date].push(b);
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date(2026, 9, 1));
    onDateSelect(todayString);
  };

  const monthLabel = currentMonth.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  // Build calendar grid cells (blanks + days)
  const totalCells = firstDay + daysInMonth;
  const rows = Math.ceil(totalCells / 7);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Calendar header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goToToday}
            className="px-3 py-1 text-xs font-medium rounded-lg bg-elevated text-text-secondary hover:text-text-primary transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <span className="text-sm font-semibold text-text-primary">{monthLabel}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-border">
        <select
          value={courtFilter}
          onChange={(e) => setCourtFilter(e.target.value)}
          className="text-xs bg-elevated border border-border text-text-secondary rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent"
          aria-label="Filter by court"
        >
          <option value="all">All Courts</option>
          {courts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-elevated border border-border text-text-secondary rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent"
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAY_HEADERS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-text-secondary"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {Array.from({ length: rows * 7 }).map((_, idx) => {
          const dayNum = idx - firstDay + 1;
          const isValid = dayNum >= 1 && dayNum <= daysInMonth;

          if (!isValid) {
            return (
              <div
                key={idx}
                className="min-h-[72px] border-r border-b border-border last:border-r-0 bg-background/30"
                aria-hidden="true"
              />
            );
          }

          const dateStr = toDateString(year, month, dayNum);
          const dayBookings = bookingsByDate[dateStr] ?? [];
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayString;
          const visible = dayBookings.slice(0, 3);
          const overflow = dayBookings.length - 3;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onDateSelect(dateStr)}
              className={cn(
                "min-h-[72px] p-1.5 border-r border-b border-border text-left transition-colors",
                "last:border-r-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                isSelected
                  ? "bg-accent/10 ring-2 ring-inset ring-accent"
                  : "hover:bg-elevated"
              )}
              aria-label={`${dateStr}${dayBookings.length > 0 ? `, ${dayBookings.length} booking${dayBookings.length !== 1 ? "s" : ""}` : ""}`}
              aria-pressed={isSelected}
            >
              {/* Date number */}
              <div className="flex items-center gap-1 mb-1">
                <span
                  className={cn(
                    "text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full",
                    isToday
                      ? "bg-accent text-black"
                      : isSelected
                      ? "text-accent"
                      : "text-text-primary"
                  )}
                >
                  {dayNum}
                </span>
              </div>

              {/* Booking indicators */}
              <div className="space-y-0.5">
                {visible.map((b) => (
                  <div
                    key={b.id}
                    className={cn(
                      "w-full h-1.5 rounded-full",
                      STATUS_DOT[b.status]
                    )}
                    title={`${b.customerName} – ${b.courtName}`}
                  />
                ))}
                {overflow > 0 && (
                  <p className="text-[9px] text-text-secondary leading-none pt-0.5">
                    +{overflow} more
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-border">
        <span className="text-xs text-text-secondary">Legend:</span>
        {(["confirmed", "pending", "cancelled"] as const).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full", STATUS_DOT[s])} aria-hidden="true" />
            <span className="text-xs text-text-secondary capitalize">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
