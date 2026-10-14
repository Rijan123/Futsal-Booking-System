"use client";

import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { AnnouncementPreview } from "./AnnouncementPreview";
import { toast } from "@/lib/toast";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import { DEMO_ANNOUNCEMENTS, ANNOUNCEMENT_CATEGORIES } from "@/data/announcements";
import type { Announcement } from "@/types";

interface AnnouncementFormDialogProps {
  open: boolean;
  onClose: () => void;
  announcement: Announcement | null; // null = new
  onSaved: (announcements: Announcement[]) => void;
}

type FormErrors = Partial<Record<keyof Announcement, string>>;

function emptyForm(): Omit<Announcement, "id" | "createdAt"> {
  const today = new Date().toISOString().slice(0, 16);
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  return {
    title: "",
    message: "",
    category: "General",
    displayStyle: "modal",
    enabled: true,
    startDate: today,
    endDate: nextMonth,
    frequency: "once",
    actionLabel: "",
    actionUrl: "",
    image: "",
  };
}

export function AnnouncementFormDialog({
  open,
  onClose,
  announcement,
  onSaved,
}: AnnouncementFormDialogProps) {
  const isEdit = announcement !== null;
  const [form, setForm] = useState<Omit<Announcement, "id" | "createdAt">>(
    emptyForm()
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (announcement) {
      const { id, createdAt, ...rest } = announcement; // eslint-disable-line @typescript-eslint/no-unused-vars
      setForm({ ...rest });
    } else {
      setForm(emptyForm());
    }
    setErrors({});
  }, [open, announcement]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.message.trim()) errs.message = "Message is required.";
    if (!form.startDate) errs.startDate = "Start date is required.";
    if (!form.endDate) errs.endDate = "End date is required.";
    if (form.startDate && form.endDate && form.endDate <= form.startDate) {
      errs.endDate = "End date must be after start date.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const stored = getItem<Announcement[]>(
        STORAGE_KEYS.ANNOUNCEMENTS,
        DEMO_ANNOUNCEMENTS
      );
      let updated: Announcement[];
      if (isEdit && announcement) {
        updated = stored.map((a) =>
          a.id === announcement.id
            ? { ...announcement, ...form }
            : a
        );
      } else {
        const newAnn: Announcement = {
          ...form,
          id: `ann-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        updated = [newAnn, ...stored];
      }
      setItem(STORAGE_KEYS.ANNOUNCEMENTS, updated);
      onSaved(updated);
      toast.success(
        isEdit ? "Announcement updated" : "Announcement created",
        isEdit ? "Changes saved successfully." : "The announcement has been published."
      );
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent";

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
        <DialogContent className="max-w-xl w-full">
          <DialogHeader>
            <DialogTitle id="ann-dialog-title">
              {isEdit ? "Edit Announcement" : "New Announcement"}
            </DialogTitle>
            <DialogClose />
          </DialogHeader>

          <div className="px-6 py-4 space-y-4 overflow-y-auto max-h-[65vh]">
            {/* Title */}
            <div>
              <label
                htmlFor="ann-title"
                className="block text-xs font-medium text-text-secondary mb-1"
              >
                Title <span className="text-cancelled" aria-hidden="true">*</span>
              </label>
              <input
                id="ann-title"
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. 50% Off Weekday Slots"
                className={inputCls}
                aria-required="true"
                aria-describedby={errors.title ? "ann-title-err" : undefined}
              />
              {errors.title && (
                <p id="ann-title-err" className="text-xs text-cancelled mt-1" role="alert">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="ann-message"
                className="block text-xs font-medium text-text-secondary mb-1"
              >
                Message <span className="text-cancelled" aria-hidden="true">*</span>
              </label>
              <textarea
                id="ann-message"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Describe the announcement..."
                rows={3}
                className={`${inputCls} resize-none`}
                aria-required="true"
                aria-describedby={errors.message ? "ann-message-err" : undefined}
              />
              {errors.message && (
                <p id="ann-message-err" className="text-xs text-cancelled mt-1" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Category + Display Style row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ann-category"
                  className="block text-xs font-medium text-text-secondary mb-1"
                >
                  Category
                </label>
                <select
                  id="ann-category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className={inputCls}
                >
                  {ANNOUNCEMENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="ann-display-style"
                  className="block text-xs font-medium text-text-secondary mb-1"
                >
                  Display Style
                </label>
                <select
                  id="ann-display-style"
                  value={form.displayStyle}
                  onChange={(e) =>
                    set("displayStyle", e.target.value as Announcement["displayStyle"])
                  }
                  className={inputCls}
                >
                  <option value="modal">Modal (Popup)</option>
                  <option value="banner">Banner (Top bar)</option>
                  <option value="notification">Notification (Toast)</option>
                </select>
              </div>
            </div>

            {/* Start Date + End Date row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ann-start"
                  className="block text-xs font-medium text-text-secondary mb-1"
                >
                  Start Date <span className="text-cancelled" aria-hidden="true">*</span>
                </label>
                <input
                  id="ann-start"
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                  className={inputCls}
                  aria-required="true"
                  aria-describedby={errors.startDate ? "ann-start-err" : undefined}
                />
                {errors.startDate && (
                  <p id="ann-start-err" className="text-xs text-cancelled mt-1" role="alert">
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="ann-end"
                  className="block text-xs font-medium text-text-secondary mb-1"
                >
                  End Date <span className="text-cancelled" aria-hidden="true">*</span>
                </label>
                <input
                  id="ann-end"
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => set("endDate", e.target.value)}
                  className={inputCls}
                  aria-required="true"
                  aria-describedby={errors.endDate ? "ann-end-err" : undefined}
                />
                {errors.endDate && (
                  <p id="ann-end-err" className="text-xs text-cancelled mt-1" role="alert">
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Frequency + Enabled row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ann-frequency"
                  className="block text-xs font-medium text-text-secondary mb-1"
                >
                  Frequency
                </label>
                <select
                  id="ann-frequency"
                  value={form.frequency}
                  onChange={(e) =>
                    set("frequency", e.target.value as Announcement["frequency"])
                  }
                  className={inputCls}
                >
                  <option value="once">Once (per session)</option>
                  <option value="daily">Daily</option>
                  <option value="always">Always</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-5">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.enabled}
                  onClick={() => set("enabled", !form.enabled)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    form.enabled ? "bg-accent" : "bg-elevated border-border"
                  }`}
                  aria-label="Enable announcement"
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                      form.enabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-text-primary">
                  {form.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            {/* Action Button fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ann-action-label"
                  className="block text-xs font-medium text-text-secondary mb-1"
                >
                  Action Button Label
                </label>
                <input
                  id="ann-action-label"
                  type="text"
                  value={form.actionLabel ?? ""}
                  onChange={(e) => set("actionLabel", e.target.value)}
                  placeholder="e.g. Book Now"
                  className={inputCls}
                />
              </div>
              <div>
                <label
                  htmlFor="ann-action-url"
                  className="block text-xs font-medium text-text-secondary mb-1"
                >
                  Action Button URL
                </label>
                <input
                  id="ann-action-url"
                  type="url"
                  value={form.actionUrl ?? ""}
                  onChange={(e) => set("actionUrl", e.target.value)}
                  placeholder="e.g. /book"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <ImageUploadField
                label="Announcement Image (optional, 16:9)"
                value={form.image ?? null}
                onChange={(url) => set("image", url ?? "")}
                aspectRatio="16/9"
                aria-label="Upload announcement image"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
              Preview
            </Button>
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              {isEdit ? "Save Changes" : "Create Announcement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview overlay */}
      {previewOpen && (
        <AnnouncementPreview
          announcement={form}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}
