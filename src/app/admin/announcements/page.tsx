"use client";

import React, { useEffect, useState } from "react";
import { Megaphone, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AnnouncementFormDialog } from "@/components/admin/AnnouncementFormDialog";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import { DEMO_ANNOUNCEMENTS } from "@/data/announcements";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  Promotion: "bg-accent/15 text-accent",
  Tournament: "bg-purple-500/15 text-purple-400",
  Maintenance: "bg-maintenance/15 text-maintenance",
  Event: "bg-pending/15 text-pending",
  Update: "bg-blue-500/15 text-blue-400",
  General: "bg-elevated text-text-secondary",
};

const STYLE_COLORS: Record<string, string> = {
  modal: "bg-accent/10 text-accent border border-accent/30",
  banner: "bg-pending/10 text-pending border border-pending/30",
  notification: "bg-maintenance/10 text-maintenance border border-maintenance/30",
};

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

  function load() {
    const stored = getItem<Announcement[]>(
      STORAGE_KEYS.ANNOUNCEMENTS,
      DEMO_ANNOUNCEMENTS
    );
    setAnnouncements(stored);
  }

  useEffect(() => {
    load();
  }, []);

  function handleNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(ann: Announcement) {
    setEditing(ann);
    setFormOpen(true);
  }

  function handleToggleEnabled(ann: Announcement) {
    const stored = getItem<Announcement[]>(
      STORAGE_KEYS.ANNOUNCEMENTS,
      DEMO_ANNOUNCEMENTS
    );
    const updated = stored.map((a) =>
      a.id === ann.id ? { ...a, enabled: !a.enabled } : a
    );
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, updated);
    setAnnouncements(updated);
    toast.success(
      ann.enabled ? "Announcement disabled" : "Announcement enabled",
      `"${ann.title}" has been ${ann.enabled ? "disabled" : "enabled"}.`
    );
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const stored = getItem<Announcement[]>(
      STORAGE_KEYS.ANNOUNCEMENTS,
      DEMO_ANNOUNCEMENTS
    );
    const updated = stored.filter((a) => a.id !== deleteTarget.id);
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, updated);
    setAnnouncements(updated);
    toast.success("Announcement deleted", `"${deleteTarget.title}" has been removed.`);
    setDeleteTarget(null);
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Announcements & Popups"
        description="Manage announcements, banners, and popup messages shown on the public site."
        action={
          <Button variant="primary" size="sm" onClick={handleNew}>
            <Plus className="w-4 h-4" aria-hidden="true" />
            New Announcement
          </Button>
        }
      />

      {announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements yet"
          description="Create your first announcement to communicate with visitors."
          action={{ label: "Create announcement", onClick: handleNew }}
        />
      ) : (
        <div className="space-y-3 mt-6">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={cn(
                "bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4",
                !ann.enabled && "opacity-60"
              )}
            >
              {/* Left: title + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-text-primary truncate">
                    {ann.title}
                  </h3>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[11px] font-medium",
                      CATEGORY_COLORS[ann.category] ?? CATEGORY_COLORS.General
                    )}
                  >
                    {ann.category}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[11px] font-medium capitalize",
                      STYLE_COLORS[ann.displayStyle]
                    )}
                  >
                    {ann.displayStyle}
                  </span>
                </div>
                <p className="text-xs text-text-secondary line-clamp-1 mb-1">
                  {ann.message}
                </p>
                <p className="text-xs text-text-secondary/70">
                  {formatDateRange(ann.startDate, ann.endDate)}
                </p>
              </div>

              {/* Right: toggle + actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Enable/disable toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={ann.enabled}
                  onClick={() => handleToggleEnabled(ann)}
                  className={cn(
                    "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    ann.enabled ? "bg-accent" : "bg-elevated border-border"
                  )}
                  aria-label={`${ann.enabled ? "Disable" : "Enable"} announcement "${ann.title}"`}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform",
                      ann.enabled ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
                <span className="text-xs text-text-secondary w-14">
                  {ann.enabled ? "Enabled" : "Disabled"}
                </span>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleEdit(ann)}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-colors"
                  aria-label={`Edit announcement "${ann.title}"`}
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" aria-hidden="true" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => setDeleteTarget(ann)}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-cancelled hover:bg-cancelled/10 transition-colors"
                  aria-label={`Delete announcement "${ann.title}"`}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form dialog */}
      <AnnouncementFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        announcement={editing}
        onSaved={(updated) => setAnnouncements(updated)}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
