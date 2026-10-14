"use client";

import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
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
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/lib/toast";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import { DEMO_COURTS } from "@/data/courts";
import type { Court } from "@/types";

interface CourtEditDialogProps {
  open: boolean;
  onClose: () => void;
  court: Court | null; // null = Add Court mode
  onSaved: (courts: Court[]) => void;
}

const COURT_TYPES: Court["type"][] = ["5-a-side", "7-a-side", "indoor", "outdoor"];
const COURT_STATUSES: Court["status"][] = ["available", "maintenance", "closed"];

function emptyForm(): Omit<Court, "id"> {
  return {
    name: "",
    description: "",
    type: "5-a-side",
    status: "available",
    pricePerHour: 1200,
    facilities: [],
    images: [],
    mainImage: "",
    operatingHours: { open: "06:00", close: "22:00" },
  };
}

export function CourtEditDialog({
  open,
  onClose,
  court,
  onSaved,
}: CourtEditDialogProps) {
  const isAdd = court === null;

  const [form, setForm] = useState<Omit<Court, "id">>(emptyForm());
  const [facilityInput, setFacilityInput] = useState("");
  const [galleryImages, setGalleryImages] = useState<(string | null)[]>([null, null, null]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync form when dialog opens / court changes
  useEffect(() => {
    if (!open) return;
    if (court) {
      setForm({
        name: court.name,
        description: court.description,
        type: court.type,
        status: court.status,
        pricePerHour: court.pricePerHour,
        facilities: [...court.facilities],
        images: court.images,
        mainImage: court.mainImage,
        operatingHours: { ...court.operatingHours },
      });
      // Fill gallery slots from images (skip mainImage)
      const extra = (court.images || []).filter((img) => img !== court.mainImage);
      setGalleryImages([
        extra[0] ?? null,
        extra[1] ?? null,
        extra[2] ?? null,
      ]);
    } else {
      setForm(emptyForm());
      setGalleryImages([null, null, null]);
    }
    setFacilityInput("");
  }, [open, court]);

  function setField<K extends keyof Omit<Court, "id">>(
    key: K,
    value: Omit<Court, "id">[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addFacility() {
    const tag = facilityInput.trim();
    if (!tag || form.facilities.includes(tag)) return;
    setField("facilities", [...form.facilities, tag]);
    setFacilityInput("");
  }

  function removeFacility(tag: string) {
    setField("facilities", form.facilities.filter((f) => f !== tag));
  }

  function handleFacilityKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addFacility();
    }
  }

  function buildImagesArray(main: string, gallery: (string | null)[]): string[] {
    const arr: string[] = [];
    if (main) arr.push(main);
    gallery.forEach((g) => { if (g) arr.push(g); });
    return arr;
  }

  function handleSave() {
    if (!form.name.trim()) {
      toast.error("Validation Error", "Court name is required.");
      return;
    }
    if (!form.pricePerHour || form.pricePerHour <= 0) {
      toast.error("Validation Error", "Price per hour must be greater than 0.");
      return;
    }

    setSaving(true);
    try {
      const courts = getItem<Court[]>(STORAGE_KEYS.COURTS, DEMO_COURTS);
      const images = buildImagesArray(form.mainImage, galleryImages);
      const updated: Court = {
        id: court ? court.id : `court-${Date.now()}`,
        ...form,
        images,
      };

      let newCourts: Court[];
      if (isAdd) {
        newCourts = [...courts, updated];
      } else {
        newCourts = courts.map((c) => (c.id === updated.id ? updated : c));
      }

      setItem(STORAGE_KEYS.COURTS, newCourts);
      onSaved(newCourts);
      toast.success(
        isAdd ? "Court Added" : "Court Updated",
        isAdd
          ? `${updated.name} has been added.`
          : `${updated.name} has been updated.`
      );
      onClose();
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!court) return;
    const courts = getItem<Court[]>(STORAGE_KEYS.COURTS, DEMO_COURTS);
    const newCourts = courts.filter((c) => c.id !== court.id);
    setItem(STORAGE_KEYS.COURTS, newCourts);
    onSaved(newCourts);
    toast.success("Court Deleted", `${court.name} has been removed.`);
    setDeleteOpen(false);
    onClose();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
        <DialogContent className="max-w-2xl" onClose={onClose}>
          <DialogHeader>
            <DialogTitle>{isAdd ? "Add Court" : `Edit — ${court?.name}`}</DialogTitle>
            <DialogClose />
          </DialogHeader>

          <div className="px-6 py-4 space-y-5 overflow-y-auto">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">
                Court Name <span className="text-cancelled">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. Arena Court 1"
                className="w-full rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={3}
                placeholder="Describe this court..."
                className="w-full rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Type + Status row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setField("type", e.target.value as Court["type"])}
                  className="w-full rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {COURT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value as Court["status"])}
                  className="w-full rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {COURT_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">
                Price per Hour (NPR) <span className="text-cancelled">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={form.pricePerHour}
                onChange={(e) =>
                  setField("pricePerHour", parseInt(e.target.value, 10) || 0)
                }
                className="w-full rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Operating Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Opening Time</label>
                <input
                  type="time"
                  value={form.operatingHours.open}
                  onChange={(e) =>
                    setField("operatingHours", {
                      ...form.operatingHours,
                      open: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Closing Time</label>
                <input
                  type="time"
                  value={form.operatingHours.close}
                  onChange={(e) =>
                    setField("operatingHours", {
                      ...form.operatingHours,
                      close: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            {/* Facilities */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Facilities</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  onKeyDown={handleFacilityKeyDown}
                  placeholder="Type and press Enter or Add"
                  className="flex-1 rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addFacility}
                >
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
              {form.facilities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {form.facilities.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-elevated border border-border text-xs text-text-primary"
                    >
                      {f}
                      <button
                        type="button"
                        onClick={() => removeFacility(f)}
                        className="text-text-secondary hover:text-cancelled transition-colors"
                        aria-label={`Remove ${f}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Main Image */}
            <ImageUploadField
              label="Main Court Image (16:9)"
              value={form.mainImage || null}
              onChange={(url) => setField("mainImage", url)}
              aspectRatio="16/9"
              placeholder="Upload main court image"
            />

            {/* Gallery Images */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-primary">
                Gallery Images (up to 3)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {galleryImages.map((img, idx) => (
                  <ImageUploadField
                    key={idx}
                    value={img}
                    onChange={(url) => {
                      const next = [...galleryImages];
                      next[idx] = url || null;
                      setGalleryImages(next);
                    }}
                    aspectRatio="16/9"
                    placeholder={`Gallery ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between">
            {!isAdd && (
              <Button
                type="button"
                variant="danger"
                onClick={() => setDeleteOpen(true)}
              >
                Delete Court
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                loading={saving}
                onClick={handleSave}
              >
                {isAdd ? "Add Court" : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Court"
        description={`Are you sure you want to delete "${court?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Court"
        confirmVariant="danger"
      />
    </>
  );
}
