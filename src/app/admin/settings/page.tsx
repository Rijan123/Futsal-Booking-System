"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "@/lib/toast";
import { getItem, setItem } from "@/lib/storage";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface GeneralSettings {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  openingTime: string;
  closingTime: string;
}

interface BookingRules {
  minAdvanceHours: number;
  maxBookingHours: number;
  cancellationPolicy: string;
  autoConfirm: boolean;
}

interface NotificationPrefs {
  newBooking: boolean;
  bookingCancellation: boolean;
  bookingAwaiting: boolean;
  courtMaintenance: boolean;
  newAnnouncement: boolean;
}

// ─── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_GENERAL: GeneralSettings = {
  businessName: "FutsalPro",
  address: "Thamel, Kathmandu, Nepal",
  phone: "+977-01-4567890",
  email: "info@futsalpro.com.np",
  openingTime: "06:00",
  closingTime: "22:00",
};

const DEFAULT_BOOKING_RULES: BookingRules = {
  minAdvanceHours: 2,
  maxBookingHours: 4,
  cancellationPolicy: "Cancellations must be made at least 24 hours before the scheduled booking time. No refunds for late cancellations.",
  autoConfirm: false,
};

const DEFAULT_NOTIF_PREFS: NotificationPrefs = {
  newBooking: true,
  bookingCancellation: true,
  bookingAwaiting: true,
  courtMaintenance: true,
  newAnnouncement: false,
};

// ─── Toggle Switch ──────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {description && (
          <p className="text-xs text-text-secondary mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          checked ? "bg-accent" : "bg-border"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform mt-0.5",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [general, setGeneral] = useState<GeneralSettings>(DEFAULT_GENERAL);
  const [bookingRules, setBookingRules] = useState<BookingRules>(DEFAULT_BOOKING_RULES);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIF_PREFS);

  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingRules, setSavingRules] = useState(false);
  const [savingNotif, setSavingNotif] = useState(false);

  useEffect(() => {
    setGeneral(getItem("futsal_settings", DEFAULT_GENERAL));
    setBookingRules(getItem("futsal_booking_rules", DEFAULT_BOOKING_RULES));
    setNotifPrefs(getItem("futsal_notification_prefs", DEFAULT_NOTIF_PREFS));
  }, []);

  function setGeneralField<K extends keyof GeneralSettings>(key: K, value: GeneralSettings[K]) {
    setGeneral((prev) => ({ ...prev, [key]: value }));
  }

  function setRulesField<K extends keyof BookingRules>(key: K, value: BookingRules[K]) {
    setBookingRules((prev) => ({ ...prev, [key]: value }));
  }

  function setNotifField<K extends keyof NotificationPrefs>(key: K, value: boolean) {
    setNotifPrefs((prev) => ({ ...prev, [key]: value }));
  }

  function saveGeneral() {
    setSavingGeneral(true);
    try {
      setItem("futsal_settings", general);
      toast.success("Settings Saved", "General settings have been updated.");
    } finally {
      setSavingGeneral(false);
    }
  }

  function saveRules() {
    setSavingRules(true);
    try {
      setItem("futsal_booking_rules", bookingRules);
      toast.success("Booking Rules Saved", "Booking rules have been updated.");
    } finally {
      setSavingRules(false);
    }
  }

  function saveNotif() {
    setSavingNotif(true);
    try {
      setItem("futsal_notification_prefs", notifPrefs);
      toast.success("Preferences Saved", "Notification preferences have been saved.");
    } finally {
      setSavingNotif(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your venue, booking rules, and notification preferences."
      />

      {/* (a) General Settings */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-text-primary">General</h2>
          <p className="text-xs text-text-secondary mt-0.5">Basic business information</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Business Name</label>
              <input
                type="text"
                value={general.businessName}
                onChange={(e) => setGeneralField("businessName", e.target.value)}
                className="rounded-xl border border-border bg-elevated text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Email</label>
              <input
                type="email"
                value={general.email}
                onChange={(e) => setGeneralField("email", e.target.value)}
                className="rounded-xl border border-border bg-elevated text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Phone</label>
              <input
                type="tel"
                value={general.phone}
                onChange={(e) => setGeneralField("phone", e.target.value)}
                className="rounded-xl border border-border bg-elevated text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Address</label>
              <input
                type="text"
                value={general.address}
                onChange={(e) => setGeneralField("address", e.target.value)}
                className="rounded-xl border border-border bg-elevated text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Opening Time</label>
              <input
                type="time"
                value={general.openingTime}
                onChange={(e) => setGeneralField("openingTime", e.target.value)}
                className="rounded-xl border border-border bg-elevated text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Closing Time</label>
              <input
                type="time"
                value={general.closingTime}
                onChange={(e) => setGeneralField("closingTime", e.target.value)}
                className="rounded-xl border border-border bg-elevated text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary" loading={savingGeneral} onClick={saveGeneral}>
              Save General Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* (b) Booking Rules */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-text-primary">Booking Rules</h2>
          <p className="text-xs text-text-secondary mt-0.5">Control booking behaviour and policies</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Minimum Advance Booking</label>
              <select
                value={bookingRules.minAdvanceHours}
                onChange={(e) => setRulesField("minAdvanceHours", Number(e.target.value))}
                className="rounded-xl border border-border bg-elevated text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {[1, 2, 3, 4, 6, 12, 24, 48].map((h) => (
                  <option key={h} value={h}>{h} hour{h !== 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Maximum Booking Duration</label>
              <select
                value={bookingRules.maxBookingHours}
                onChange={(e) => setRulesField("maxBookingHours", Number(e.target.value))}
                className="rounded-xl border border-border bg-elevated text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {[1, 2, 3, 4, 6, 8].map((h) => (
                  <option key={h} value={h}>{h} hour{h !== 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Cancellation Policy</label>
            <textarea
              value={bookingRules.cancellationPolicy}
              onChange={(e) => setRulesField("cancellationPolicy", e.target.value)}
              rows={3}
              className="rounded-xl border border-border bg-elevated text-text-primary px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <Toggle
            checked={bookingRules.autoConfirm}
            onChange={(v) => setRulesField("autoConfirm", v)}
            label="Auto-confirm Bookings"
            description="Automatically confirm new bookings without manual review."
          />
          <div className="flex justify-end pt-2">
            <Button variant="primary" loading={savingRules} onClick={saveRules}>
              Save Booking Rules
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* (c) Notification Preferences */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-text-primary">Notification Preferences</h2>
          <p className="text-xs text-text-secondary mt-0.5">Choose which events trigger notifications</p>
        </CardHeader>
        <CardContent className="space-y-0">
          <Toggle
            checked={notifPrefs.newBooking}
            onChange={(v) => setNotifField("newBooking", v)}
            label="New Booking"
            description="Notify when a new booking is created."
          />
          <Toggle
            checked={notifPrefs.bookingCancellation}
            onChange={(v) => setNotifField("bookingCancellation", v)}
            label="Booking Cancellation"
            description="Notify when a booking is cancelled."
          />
          <Toggle
            checked={notifPrefs.bookingAwaiting}
            onChange={(v) => setNotifField("bookingAwaiting", v)}
            label="Booking Awaiting Confirmation"
            description="Notify when a booking is pending your review."
          />
          <Toggle
            checked={notifPrefs.courtMaintenance}
            onChange={(v) => setNotifField("courtMaintenance", v)}
            label="Court Maintenance"
            description="Notify when a court is set to maintenance mode."
          />
          <Toggle
            checked={notifPrefs.newAnnouncement}
            onChange={(v) => setNotifField("newAnnouncement", v)}
            label="New Announcement"
            description="Notify when a new announcement is published."
          />
          <div className="flex justify-end pt-4">
            <Button variant="primary" loading={savingNotif} onClick={saveNotif}>
              Save Notification Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
