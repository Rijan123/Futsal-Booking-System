"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { DEMO_BOOKINGS } from "@/data/bookings";
import { DEMO_COURTS } from "@/data/courts";
import { formatCurrency } from "@/lib/utils";
import type { Booking } from "@/types";

const ACCENT = "#A3FF3F";
const COURT_COLORS = ["#A3FF3F", "#4ADE80", "#60A5FA", "#A78BFA"];
const STATUS_COLORS = {
  confirmed: "#4ADE80",
  pending: "#FBBF24",
  cancelled: "#F87171",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const YEARS = [2025, 2026, 2027];

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function generateDailyData(bookings: Booking[], month: number, year: number) {
  const days = getDaysInMonth(month, year);
  const result = [];
  for (let day = 1; day <= days; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayBookings = bookings.filter((b) => b.date === dateStr);
    const revenue = dayBookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.totalPrice, 0);
    result.push({
      day: String(day),
      bookings: dayBookings.length,
      revenue,
    });
  }
  return result;
}

function generateCourtUtilization(bookings: Booking[]) {
  return DEMO_COURTS.map((court, idx) => ({
    court: court.name.replace(" Court", ""),
    bookings: bookings.filter((b) => b.courtId === court.id).length,
    color: COURT_COLORS[idx % COURT_COLORS.length],
  }));
}

function generateStatusBreakdown(bookings: Booking[]) {
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  return [
    { name: "Confirmed", value: confirmed, color: STATUS_COLORS.confirmed },
    { name: "Pending", value: pending, color: STATUS_COLORS.pending },
    { name: "Cancelled", value: cancelled, color: STATUS_COLORS.cancelled },
  ].filter((d) => d.value > 0);
}

// Custom tooltip for charts
function CustomTooltip({
  active,
  payload,
  label,
  prefix = "",
  suffix = "",
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
  prefix?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-elevated border border-border rounded-xl px-3 py-2 text-xs shadow-xl">
      {label && <p className="text-text-secondary mb-1">Day {label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-text-primary font-medium">
          {prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}{suffix}
        </p>
      ))}
    </div>
  );
}

export default function AdminReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(10); // October
  const [selectedYear, setSelectedYear] = useState(2026);

  const bookingsInPeriod = useMemo(() => {
    const prefix = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
    return DEMO_BOOKINGS.filter((b) => b.date.startsWith(prefix));
  }, [selectedMonth, selectedYear]);

  const dailyData = useMemo(
    () => generateDailyData(bookingsInPeriod, selectedMonth, selectedYear),
    [bookingsInPeriod, selectedMonth, selectedYear]
  );

  const courtUtilization = useMemo(
    () => generateCourtUtilization(bookingsInPeriod),
    [bookingsInPeriod]
  );

  const statusBreakdown = useMemo(
    () => generateStatusBreakdown(bookingsInPeriod),
    [bookingsInPeriod]
  );

  const totalRevenue = useMemo(
    () => bookingsInPeriod
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.totalPrice, 0),
    [bookingsInPeriod]
  );

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Reports"
        description="Analytics and revenue overview for your courts."
      />

      {/* Month/Year filter */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {MONTHS.map((m, idx) => (
            <option key={m} value={idx + 1}>{m}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <span className="text-xs text-text-secondary">
          {bookingsInPeriod.length} bookings · {formatCurrency(totalRevenue)} revenue
        </span>
      </div>

      {/* (a) Booking Trends — LineChart */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-text-primary">Booking Trends</h2>
          <p className="text-xs text-text-secondary mt-0.5">Daily bookings for {MONTHS[selectedMonth - 1]} {selectedYear}</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#263442" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                axisLine={{ stroke: "#263442" }}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip suffix=" bookings" />} />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke={ACCENT}
                strokeWidth={2}
                dot={{ fill: ACCENT, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* (b) Court Utilization — BarChart */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-text-primary">Court Utilization</h2>
          <p className="text-xs text-text-secondary mt-0.5">Bookings per court for {MONTHS[selectedMonth - 1]} {selectedYear}</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={courtUtilization} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#263442" vertical={false} />
              <XAxis
                dataKey="court"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                axisLine={{ stroke: "#263442" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="bg-elevated border border-border rounded-xl px-3 py-2 text-xs shadow-xl">
                      <p className="text-text-secondary mb-1">{label}</p>
                      <p className="text-text-primary font-medium">{payload[0]?.value} bookings</p>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                {courtUtilization.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* (c) Booking Status Breakdown — PieChart */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-text-primary">Booking Status Breakdown</h2>
          <p className="text-xs text-text-secondary mt-0.5">Status distribution for {MONTHS[selectedMonth - 1]} {selectedYear}</p>
        </CardHeader>
        <CardContent>
          {statusBreakdown.length === 0 ? (
            <p className="text-center text-text-secondary text-sm py-8">No bookings for this period.</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="bg-elevated border border-border rounded-xl px-3 py-2 text-xs shadow-xl">
                          <p className="text-text-primary font-medium">
                            {payload[0]?.name}: {payload[0]?.value}
                          </p>
                        </div>
                      ) : null
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Custom legend */}
              <div className="flex flex-col gap-3">
                {statusBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-text-primary">{item.name}</span>
                    <span className="text-sm text-text-secondary ml-1">({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* (d) Revenue Overview — AreaChart */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-text-primary">Revenue Overview</h2>
          <p className="text-xs text-text-secondary mt-0.5">Daily revenue from confirmed bookings in {MONTHS[selectedMonth - 1]} {selectedYear}</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#263442" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                axisLine={{ stroke: "#263442" }}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="bg-elevated border border-border rounded-xl px-3 py-2 text-xs shadow-xl">
                      <p className="text-text-secondary mb-1">Day {label}</p>
                      <p className="text-text-primary font-medium">
                        {formatCurrency(Number(payload[0]?.value ?? 0))}
                      </p>
                    </div>
                  ) : null
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={ACCENT}
                strokeWidth={2}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{ r: 5, fill: ACCENT }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-text-secondary text-center py-2">
        Charts are based on demo data for prototype purposes.
      </p>
    </div>
  );
}
