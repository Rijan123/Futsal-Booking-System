"use client";

import React from "react";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Announcement } from "@/types";

interface AnnouncementPreviewProps {
  announcement: Partial<Announcement>;
  onClose: () => void;
}

export function AnnouncementPreview({
  announcement,
  onClose,
}: AnnouncementPreviewProps) {
  const { title, message, displayStyle, image, actionLabel, actionUrl } =
    announcement;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Announcement preview"
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <span className="inline-block bg-pending text-black text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full">
          Preview
        </span>
      </div>

      {/* Modal style preview */}
      {displayStyle === "modal" && (
        <div className="relative bg-elevated border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          {image && (
            <div className="relative w-full aspect-video">
              <Image src={image} alt="" fill className="object-cover" />
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label="Close preview"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="p-6">
            {title && (
              <h2 className="text-xl font-bold text-text-primary mb-2">{title}</h2>
            )}
            {message && (
              <p className="text-text-secondary text-sm mb-4">{message}</p>
            )}
            {actionLabel && (
              <Button variant="primary" size="md" className="w-full">
                {actionLabel}
                {actionUrl && (
                  <ExternalLink className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Banner style preview */}
      {displayStyle === "banner" && (
        <div className="w-full max-w-2xl mx-4 space-y-4">
          <div className="w-full bg-accent text-black rounded-xl py-3 px-5 flex items-center justify-between gap-4">
            <p className="text-sm font-medium flex-1">
              {title || "Announcement title"}
              {message && (
                <span className="ml-1 font-normal opacity-80">{message}</span>
              )}
            </p>
            {actionLabel && (
              <span className="text-xs font-semibold underline cursor-pointer whitespace-nowrap">
                {actionLabel}
              </span>
            )}
            <X className="w-4 h-4 flex-shrink-0 cursor-pointer" aria-hidden="true" />
          </div>
          <div className="text-center">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close Preview
            </Button>
          </div>
        </div>
      )}

      {/* Notification style preview */}
      {displayStyle === "notification" && (
        <div className="w-full max-w-sm mx-4 space-y-4">
          <div className="bg-elevated border border-border rounded-xl shadow-xl p-4 flex items-start gap-3">
            <div className="flex-1">
              {title && (
                <p className="text-sm font-semibold text-text-primary mb-0.5">
                  {title}
                </p>
              )}
              {message && (
                <p className="text-xs text-text-secondary line-clamp-2">{message}</p>
              )}
              {actionLabel && (
                <p className="text-xs text-accent mt-1 font-medium">{actionLabel}</p>
              )}
            </div>
            <X className="w-4 h-4 text-text-secondary flex-shrink-0 cursor-pointer" aria-hidden="true" />
          </div>
          <div className="text-center">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close Preview
            </Button>
          </div>
        </div>
      )}

      {/* No style set */}
      {!displayStyle && (
        <div className="bg-elevated border border-border rounded-xl p-8 mx-4 text-center">
          <p className="text-text-secondary text-sm mb-4">
            Select a display style to preview.
          </p>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      )}
    </div>
  );
}
