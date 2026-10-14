"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DEMO_ANNOUNCEMENTS } from "@/data/announcements";
import { getItem } from "@/lib/storage";
import type { Announcement } from "@/types";

const DISMISSED_KEY = "dismissed_announcements";

function isActiveModal(ann: Announcement): boolean {
  if (!ann.enabled) return false;
  if (ann.displayStyle !== "modal") return false;
  const today = new Date().toISOString().split("T")[0];
  // Support both full ISO datetime and date-only strings
  const start = ann.startDate.split("T")[0];
  const end = ann.endDate.split("T")[0];
  return start <= today && today <= end;
}

function getDismissedIds(): string[] {
  if (typeof sessionStorage === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(DISMISSED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function addDismissedId(id: string): void {
  try {
    const existing = getDismissedIds();
    sessionStorage.setItem(
      DISMISSED_KEY,
      JSON.stringify([...existing, id])
    );
  } catch {
    // Ignore
  }
}

export function AnnouncementModal() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const stored = getItem<Announcement[]>(
      "futsal_announcements",
      DEMO_ANNOUNCEMENTS
    );
    const active = stored.filter(isActiveModal);
    if (active.length === 0) return;

    const dismissed = getDismissedIds();
    const first = active.find((a) => !dismissed.includes(a.id));
    if (first) setAnnouncement(first);
  }, []);

  function dismiss() {
    if (!announcement) return;
    addDismissedId(announcement.id);
    setAnnouncement(null);
  }

  if (!announcement) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ann-modal-title"
    >
      <div className="relative bg-elevated border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image */}
        {announcement.image && (
          <div className="relative w-full aspect-video">
            <Image
              src={announcement.image}
              alt={announcement.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 512px"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <h2
            id="ann-modal-title"
            className="text-xl font-bold text-text-primary mb-3"
          >
            {announcement.title}
          </h2>
          <p className="text-text-secondary text-sm mb-5 leading-relaxed">
            {announcement.message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            {announcement.actionLabel && announcement.actionUrl && (
              <Link href={announcement.actionUrl} onClick={dismiss} className="flex-1">
                <Button variant="primary" size="md" className="w-full">
                  {announcement.actionLabel}
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="md"
              onClick={dismiss}
              className="flex-1"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
