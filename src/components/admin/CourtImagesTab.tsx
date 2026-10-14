"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/lib/toast";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import { DEMO_COURTS } from "@/data/courts";
import type { Court } from "@/types";

interface CourtImageState {
  mainImage: string;
  gallery: (string | null)[];
}

export function CourtImagesTab() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [imageStates, setImageStates] = useState<Record<string, CourtImageState>>({});
  const [confirmRemove, setConfirmRemove] = useState<{
    courtId: string;
    galleryIdx: number;
  } | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getItem<Court[]>(STORAGE_KEYS.COURTS, DEMO_COURTS);
    setCourts(loaded);
    const states: Record<string, CourtImageState> = {};
    loaded.forEach((c) => {
      const extra = (c.images || []).filter((img) => img !== c.mainImage);
      states[c.id] = {
        mainImage: c.mainImage || "",
        gallery: [extra[0] ?? null, extra[1] ?? null, extra[2] ?? null],
      };
    });
    setImageStates(states);
  }, []);

  function updateMain(courtId: string, url: string) {
    setImageStates((prev) => ({
      ...prev,
      [courtId]: { ...prev[courtId], mainImage: url },
    }));
  }

  function updateGallery(courtId: string, idx: number, url: string) {
    setImageStates((prev) => {
      const g = [...prev[courtId].gallery];
      g[idx] = url || null;
      return { ...prev, [courtId]: { ...prev[courtId], gallery: g } };
    });
  }

  function requestRemoveGallery(courtId: string, idx: number) {
    setConfirmRemove({ courtId, galleryIdx: idx });
  }

  function confirmRemoveGallery() {
    if (!confirmRemove) return;
    updateGallery(confirmRemove.courtId, confirmRemove.galleryIdx, "");
    setConfirmRemove(null);
  }

  function handleSaveCourt(courtId: string) {
    setSavingId(courtId);
    try {
      const allCourts = getItem<Court[]>(STORAGE_KEYS.COURTS, DEMO_COURTS);
      const state = imageStates[courtId];
      if (!state) return;
      const images: string[] = [];
      if (state.mainImage) images.push(state.mainImage);
      state.gallery.forEach((g) => { if (g) images.push(g); });

      const updated = allCourts.map((c) =>
        c.id === courtId
          ? { ...c, mainImage: state.mainImage, images }
          : c
      );
      setItem(STORAGE_KEYS.COURTS, updated);
      setCourts(updated);
      toast.success("Images Saved", "Court images have been updated.");
    } finally {
      setSavingId(null);
    }
  }

  if (courts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
        <MapPin className="h-8 w-8 mb-2" />
        <p>No courts found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {courts.map((court) => {
        const state = imageStates[court.id] ?? { mainImage: "", gallery: [null, null, null] };
        return (
          <div key={court.id} className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Court header */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-border">
              <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-border flex-shrink-0">
                {state.mainImage ? (
                  <Image
                    src={state.mainImage}
                    alt={court.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-elevated flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-text-secondary" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">{court.name}</h3>
                <p className="text-xs text-text-secondary">{court.type}</p>
              </div>
            </div>

            {/* Image fields */}
            <div className="p-5 space-y-5">
              <ImageUploadField
                label="Main Image (16:9)"
                value={state.mainImage || null}
                onChange={(url) => updateMain(court.id, url)}
                aspectRatio="16/9"
                placeholder="Upload main court image"
              />

              <div>
                <p className="text-sm font-medium text-text-primary mb-2">Gallery Images (up to 3)</p>
                <div className="grid grid-cols-3 gap-3">
                  {state.gallery.map((img, idx) => (
                    <div key={idx} className="relative">
                      <ImageUploadField
                        value={img}
                        onChange={(url) => updateGallery(court.id, idx, url)}
                        aspectRatio="16/9"
                        placeholder={`Gallery ${idx + 1}`}
                      />
                      {img && (
                        <button
                          type="button"
                          onClick={() => requestRemoveGallery(court.id, idx)}
                          className="absolute top-1 right-1 z-10 p-0.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                          aria-label="Remove gallery image"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  loading={savingId === court.id}
                  onClick={() => handleSaveCourt(court.id)}
                >
                  Save Images
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      <ConfirmDialog
        open={confirmRemove !== null}
        onClose={() => setConfirmRemove(null)}
        onConfirm={confirmRemoveGallery}
        title="Remove Image"
        description="Are you sure you want to remove this gallery image?"
        confirmLabel="Remove"
        confirmVariant="danger"
      />
    </div>
  );
}
