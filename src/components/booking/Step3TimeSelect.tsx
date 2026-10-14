import React from "react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";
import type { Booking } from "@/types";

interface Step3Props {
  selectedStartTime: string | null;
  selectedEndTime: string | null;
  onSelectStart: (time: string) => void;
  onSelectEnd: (time: string) => void;
  bookings: Booking[];
  courtId: string | null;
  selectedDate: string | null;
}

// Generate hourly slots from 06:00 to 22:00
const TIME_SLOTS: string[] = Array.from({ length: 17 }, (_, i) => {
  const hour = 6 + i;
  return `${String(hour).padStart(2, "0")}:00`;
});

export function Step3TimeSelect({
  selectedStartTime,
  selectedEndTime,
  onSelectStart,
  onSelectEnd,
  bookings,
  courtId,
  selectedDate,
}: Step3Props) {
  // Build set of booked slots for this court+date
  const bookedSlots = new Set<string>();
  if (courtId && selectedDate) {
    bookings
      .filter((b) => b.courtId === courtId && b.date === selectedDate && b.status !== "cancelled")
      .forEach((b) => {
        const startHour = parseInt(b.startTime.split(":")[0], 10);
        const endHour = parseInt(b.endTime.split(":")[0], 10);
        for (let h = startHour; h < endHour; h++) {
          bookedSlots.add(`${String(h).padStart(2, "0")}:00`);
        }
      });
  }

  function handleSlotClick(slot: string) {
    if (bookedSlots.has(slot)) return;

    if (!selectedStartTime) {
      // First click: set start
      onSelectStart(slot);
      onSelectEnd("");
    } else if (!selectedEndTime || selectedEndTime === "") {
      // Second click: set end (must be after start)
      const startHour = parseInt(selectedStartTime.split(":")[0], 10);
      const endHour = parseInt(slot.split(":")[0], 10);
      if (endHour <= startHour) {
        // Reset and set this as new start
        onSelectStart(slot);
        onSelectEnd("");
      } else {
        // Check no booked slots in range
        let blocked = false;
        for (let h = startHour; h < endHour; h++) {
          if (bookedSlots.has(`${String(h).padStart(2, "0")}:00`)) {
            blocked = true;
            break;
          }
        }
        if (blocked) {
          // Reset
          onSelectStart(slot);
          onSelectEnd("");
        } else {
          // Set end time as slot + 1 hour
          const endSlotHour = endHour + 1;
          onSelectEnd(`${String(endSlotHour).padStart(2, "0")}:00`);
        }
      }
    } else {
      // Reset selection
      onSelectStart(slot);
      onSelectEnd("");
    }
  }

  function isInRange(slot: string): boolean {
    if (!selectedStartTime || !selectedEndTime) return false;
    const slotHour = parseInt(slot.split(":")[0], 10);
    const startHour = parseInt(selectedStartTime.split(":")[0], 10);
    const endHour = parseInt(selectedEndTime.split(":")[0], 10);
    return slotHour >= startHour && slotHour < endHour;
  }

  const duration =
    selectedStartTime && selectedEndTime
      ? parseInt(selectedEndTime.split(":")[0], 10) - parseInt(selectedStartTime.split(":")[0], 10)
      : 0;

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">Select Time Slot</h2>
      <p className="text-text-secondary text-sm mb-6">
        Click a start slot, then click an end slot to set duration. Booked slots are unavailable.
      </p>

      {/* Slot grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2 mb-6">
        {TIME_SLOTS.map((slot) => {
          const booked = bookedSlots.has(slot);
          const isStart = selectedStartTime === slot;
          const inRange = isInRange(slot);
          const isEnd =
            selectedEndTime &&
            parseInt(slot.split(":")[0], 10) === parseInt(selectedEndTime.split(":")[0], 10) - 1;

          return (
            <button
              key={slot}
              type="button"
              disabled={booked}
              onClick={() => handleSlotClick(slot)}
              className={cn(
                "py-3 rounded-xl text-xs font-medium text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                booked
                  ? "bg-cancelled/20 text-cancelled cursor-not-allowed"
                  : isStart || isEnd
                  ? "bg-accent text-black font-bold"
                  : inRange
                  ? "bg-accent/30 text-accent"
                  : "bg-card border border-border text-text-primary hover:border-accent hover:bg-elevated cursor-pointer"
              )}
              aria-label={`${formatTime(slot)}${booked ? " (unavailable)" : ""}`}
              aria-pressed={isStart || inRange}
            >
              {slot}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-accent" />
          <span className="text-text-secondary text-xs">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-accent/30" />
          <span className="text-text-secondary text-xs">In range</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-cancelled/20" />
          <span className="text-text-secondary text-xs">Booked</span>
        </div>
      </div>

      {/* Summary */}
      {selectedStartTime && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Time</span>
            <span className="text-text-primary font-medium">
              {formatTime(selectedStartTime)}
              {selectedEndTime ? ` – ${formatTime(selectedEndTime)}` : " (select end slot)"}
            </span>
          </div>
          {duration > 0 && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-text-secondary">Duration</span>
              <span className="text-accent font-semibold">
                {duration} hour{duration !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
