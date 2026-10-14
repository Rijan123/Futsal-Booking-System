"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  AlertCircle,
  Eye,
  Bell,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { PageHeader } from "@/components/admin/PageHeader";
import { BookingTrendChart } from "@/components/admin/BookingTrendChart";
import { BookingStatusBadge } from "@/components/ui/BookingStatusBadge";
import { getItem, STORAGE_KEYS } from "@/lib/storage";
import { DEMO_BOOKINGS } from "@/data/bookings";
import { DEMO_COURTS } from "@/data/courts";
import { DEMO_NOTIFICATIONS } from "@/data/notifications";
import { formatCurrency, formatTime } from "@/lib/utils";
import type { Booking, Notification } from "@/types";

function getTodayString(): string {
  // Use a fixed demo "today" aligned with the demo data (Oct 2026)
  return "2026-10-15";
}

function getUpcomingDates(fromDate: string, days: number): string[] {
  const dates: string[] = [];
  const base = new Date(fromDate);
  for (let i = 0; i <= days; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
}

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const stored = getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, DEMO_BOOKINGS);
    setBookings(stored);
    const notifs = getItem<Notification[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      DEMO_NOTIFICATIONS
    );
    setNotifications(notifs);
  }, []);

  const today = getTodayString();
  const upcomingDates = getUpcomingDates(today, 7);

  const todayBookings = bookings.filter((b) => b.date === today);
  const upcomingBookings = bookings
    .filter(
      (b) =>
        upcomingDates.includes(b.date) &&
        b.status !== "cancelled"
    )
    .sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : a.startTime.localeCompare(b.startTime)));

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const totalCourts = DEMO_COURTS.length;
  const availableCourts = DEMO_COURTS.filter((c) => c.status === "available").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const recentNotifications = [...notifications]
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
    .slice(0, 5);

  const nextFiveUpcoming = upcomingBookings.slice(0, 5);

  return (
    <div className="p-6 space-y-8">
      <PageHeader
        title="Dashboard Overview"
        description="Welcome back, Admin. Here's what's happening today."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          title="Today's Bookings"
          value={todayBookings.length}
          icon={CalendarDays}
          trend="+2 from yesterday"
          trendUp={true}
          color="accent"
        />
        <StatCard
          title="Upcoming (7 days)"
          value={upcomingBookings.length}
          icon={TrendingUp}
          trend="+5 from last week"
          trendUp={true}
          color="green"
        />
        <StatCard
          title="Total Courts"
          value={totalCourts}
          icon={MapPin}
          color="purple"
        />
        <StatCard
          title="Available Courts"
          value={availableCourts}
          icon={MapPin}
          color="green"
        />
        <StatCard
          title="Pending Bookings"
          value={pendingBookings.length}
          icon={Clock}
          trend="Needs attention"
          trendUp={false}
          color="amber"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend="+12% from last month"
          trendUp={true}
          color="accent"
        />
      </div>

      {/* Charts + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking trend chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Booking Trend
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Last 7 days (demo data)
              </p>
            </div>
          </div>
          <BookingTrendChart bookings={bookings} />
        </div>

        {/* Upcoming bookings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Upcoming Bookings
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">Next 7 days</p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs text-accent hover:text-accent/80 transition-colors"
            >
              View all
            </Link>
          </div>

          {nextFiveUpcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-text-secondary text-sm">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" aria-hidden="true" />
              No upcoming bookings
            </div>
          ) : (
            <ul className="space-y-3">
              {nextFiveUpcoming.map((booking) => (
                <li
                  key={booking.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {booking.customerName}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {booking.courtName} · {booking.date} ·{" "}
                      {formatTime(booking.startTime)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <BookingStatusBadge status={booking.status} />
                    <Link
                      href={`/admin/bookings`}
                      title="View booking"
                      className="p-1 rounded-md text-text-secondary hover:text-accent transition-colors"
                    >
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">
            Recent Activity
          </h2>
          <Link
            href="/admin/notifications"
            className="text-xs text-accent hover:text-accent/80 transition-colors"
          >
            View all
          </Link>
        </div>

        {recentNotifications.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-6">
            No recent activity
          </p>
        ) : (
          <ol className="relative border-l border-border ml-3 space-y-4">
            {recentNotifications.map((notif) => (
              <li key={notif.id} className="pl-6 pb-1">
                {/* Timeline dot */}
                <span
                  className={`absolute -left-[5px] w-2.5 h-2.5 rounded-full border-2 border-sidebar ${
                    notif.read ? "bg-text-secondary" : "bg-accent"
                  }`}
                  aria-hidden="true"
                />
                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 w-7 h-7 rounded-full bg-elevated flex items-center justify-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    <Bell className="w-3.5 h-3.5 text-text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary">
                      {notif.title}
                    </p>
                    <p className="text-xs text-text-secondary line-clamp-2">
                      {notif.message}
                    </p>
                    <time className="text-xs text-text-secondary/60 mt-0.5 block">
                      {new Date(notif.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
