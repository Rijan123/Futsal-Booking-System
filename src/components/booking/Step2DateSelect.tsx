import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

interface Step2Props {
  selectedDate: string | null;
  onSelect: (date: string) => void;
  bookings: Booking[];
  courtId: string | null;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function Step2DateSelect({ selectedDate, onSelect, bookings, courtId }: Step2Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Get booked dates for selected court
  const bookedDates = new Set(
    bookings
      .filter((b) => b.courtId === courtId && b.status !== "cancelled")
      .map((b) => b.date)
  );

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function toDateString(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function isPast(day: number): boolean {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">Pick a Date</h2>
      <p className="text-text-secondary text-sm mb-6">
        Select the date you would like to book the court.
      </p>

      <div className="bg-card border border-border rounded-2xl p-5 max-w-sm mx-auto">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-elevated text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-text-primary font-semibold text-sm">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-elevated text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="text-center text-text-secondary text-xs font-medium py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {/* Empty cells for alignment */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dateStr = toDateString(viewYear, viewMonth, day);
            const past = isPast(day);
            const booked = bookedDates.has(dateStr);
            const selected = selectedDate === dateStr;

            return (
              <button
                key={day}
                type="button"
                disabled={past}
                onClick={() => !past && onSelect(dateStr)}
                className={cn(
                  "aspect-square w-full flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
                  past
                    ? "text-text-secondary/30 cursor-not-allowed"
                    : selected
                    ? "bg-accent text-black font-bold"
                    : booked
                    ? "bg-pending/20 text-pending hover:bg-pending/30"
                    : "text-text-primary hover:bg-elevated cursor-pointer"
                )}
                aria-label={`${dateStr}${booked ? " (partially booked)" : ""}${past ? " (past)" : ""}`}
                aria-pressed={selected}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-accent" />
            <span className="text-text-secondary text-xs">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-pending/30" />
            <span className="text-text-secondary text-xs">Partially booked</span>
          </div>
        </div>
      </div>

      {selectedDate && (
        <p className="text-center text-accent text-sm mt-4 font-medium">
          Selected:{" "}
          {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
