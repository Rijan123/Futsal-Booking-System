"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { Booking } from "@/types";

interface BookingTrendChartProps {
  bookings: Booking[];
}

function getLast7Days(): { date: string; label: string }[] {
  const days: { date: string; label: string }[] = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Use October 2026 as the reference week since demo data is in that period
  const today = new Date("2026-10-15");
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    days.push({
      date: `${yyyy}-${mm}-${dd}`,
      label: dayNames[d.getDay()],
    });
  }
  return days;
}

interface TooltipPayloadEntry {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-elevated border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-text-secondary mb-0.5">{label}</p>
      <p className="text-text-primary font-semibold">
        {payload[0].value} booking{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export function BookingTrendChart({ bookings }: BookingTrendChartProps) {
  const days = getLast7Days();

  const data = days.map(({ date, label }) => ({
    label,
    count: bookings.filter((b) => b.date === date).length,
  }));

  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-48 text-text-secondary text-sm">
        No bookings in the last 7 days
      </div>
    );
  }

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#263442"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#16212B" }} />
          <Bar dataKey="count" fill="#A3FF3F" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
