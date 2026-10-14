"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { DEMO_ANNOUNCEMENTS } from "@/data/announcements";
import { getItem } from "@/lib/storage";
import type { Announcement } from "@/types";

function isActive(announcement: Announcement): boolean {
  if (!announcement.enabled) return false;
  if (announcement.displayStyle !== "banner") return false;
  const today = new Date().toISOString().split("T")[0];
  return announcement.startDate <= today && today <= announcement.endDate;
}

const DISMISSED_KEY = "futsal_banner_dismissed";

export function AnnouncementBanner() {
  const [banner, setBanner] = useState<Announcement | null>(null);

  useEffect(() => {
    // Load announcements from localStorage or fall back to demo data
    const stored = getItem<Announcement[]>("futsal_announcements", DEMO_ANNOUNCEMENTS);
    const active = stored.filter(isActive);
    if (active.length === 0) return;

    // Check sessionStorage for dismissed IDs
    let dismissedIds: string[] = [];
    try {
      const raw = sessionStorage.getItem(DISMISSED_KEY);
      dismissedIds = raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      dismissedIds = [];
    }

    const first = active.find((a) => !dismissedIds.includes(a.id));
    if (first) setBanner(first);
  }, []);

  function dismiss() {
    if (!banner) return;
    try {
      const raw = sessionStorage.getItem(DISMISSED_KEY);
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : [];
      sessionStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids, banner.id]));
    } catch {
      // Ignore
    }
    setBanner(null);
  }

  if (!banner) return null;

  return (
    <div
      className="w-full bg-accent text-black py-2.5 px-4 flex items-center justify-center gap-3 relative"
      role="alert"
      aria-live="polite"
    >
      <p className="text-sm font-medium text-center flex-1">
        {banner.message}
        {banner.actionLabel && banner.actionUrl && (
          <Link
            href={banner.actionUrl}
            className="ml-3 underline underline-offset-2 font-semibold hover:opacity-80"
          >
            {banner.actionLabel}
          </Link>
        )}
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-black/10 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
