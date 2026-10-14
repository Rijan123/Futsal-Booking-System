"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import { DEMO_BOOKINGS } from "@/data/bookings";
import { DEMO_COURTS } from "@/data/courts";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Booking, Court } from "@/types";

type AttendanceStatus = "Present" | "Absent" | "Unknown";

interface AttendanceRecord {
  status: AttendanceStatus;
  checkinTime: string;
}

type AttendanceStore = Record<string, AttendanceRecord>;

const STATUS_CYCLE: AttendanceStatus[] = ["Unknown", "Present", "Absent"];

const STATUS_CLASSES: Record<AttendanceStatus, string> = {
  Present: "bg-accent/20 text-accent border border-accent/40",
  Absent: "bg-cancelled/20 text-cancelled border border-cancelled/40",
  Unknown: "bg-elevated text-text-secondary border border-border",
};

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function AdminAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(todayString());
  const [courtFilter, setCourtFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">("all");
  const [attendance, setAttendance] = useState<AttendanceStore>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);

  useEffect(() => {
    setBookings(getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, DEMO_BOOKINGS));
    setCourts(getItem<Court[]>(STORAGE_KEYS.COURTS, DEMO_COURTS));
    setAttendance(getItem<AttendanceStore>("futsal_attendance", {}));
  }, []);

  // Filter bookings for selected date
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (b.date !== selectedDate) return false;
      if (courtFilter !== "all" && b.courtId !== courtFilter) return false;
      const record = attendance[b.id];
      const status: AttendanceStatus = record?.status ?? "Unknown";
      if (statusFilter !== "all" && status !== statusFilter) return false;
      return true;
    });
  }, [bookings, selectedDate, courtFilter, statusFilter, attendance]);

  function cycleStatus(bookingId: string) {
    const current: AttendanceStatus = attendance[bookingId]?.status ?? "Unknown";
    const idx = STATUS_CYCLE.indexOf(current);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    const now = next === "Present" ? new Date().toTimeString().slice(0, 5) : "";
    const updated: AttendanceStore = {
      ...attendance,
      [bookingId]: { status: next, checkinTime: now },
    };
    setAttendance(updated);
    setItem("futsal_attendance", updated);
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Attendance"
        description="Track player check-ins and attendance for each booking."
      />

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <select
          value={courtFilter}
          onChange={(e) => setCourtFilter(e.target.value)}
          className="rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">All Courts</option>
          {courts.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AttendanceStatus | "all")}
          className="rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">All Statuses</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Unknown">Unknown</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Bookings"
          description={`No bookings found for ${selectedDate} with the selected filters.`}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-elevated">
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Court</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Date</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Scheduled Time</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Duration</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Attendance</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Check-in</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const record = attendance[booking.id];
                const status: AttendanceStatus = record?.status ?? "Unknown";
                const checkin = record?.checkinTime ?? "--";
                return (
                  <tr
                    key={booking.id}
                    className="border-b border-border hover:bg-elevated/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-text-primary font-medium">
                      {booking.customerName}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{booking.courtName}</td>
                    <td className="px-4 py-3 text-text-secondary">{booking.date}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{booking.duration}h</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => cycleStatus(booking.id)}
                        title="Click to cycle attendance status"
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-opacity hover:opacity-80",
                          STATUS_CLASSES[status]
                        )}
                      >
                        {status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {status === "Present" ? checkin : "--"}
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">
                      {booking.notes ?? "--"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-text-secondary">
        Click an attendance status chip to cycle: Unknown → Present → Absent → Unknown.
        Demo data shown for prototype purposes.
      </p>
    </div>
  );
}
