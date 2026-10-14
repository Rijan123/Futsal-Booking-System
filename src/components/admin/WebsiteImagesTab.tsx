"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/lib/toast";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import type { AppearanceSettings } from "@/types";

const DEFAULT_APPEARANCE: AppearanceSettings = {
  heroImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
  aboutImageUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80",
  facilitiesImages: [
    "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80",
    "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
    "",
    "",
    "",
    "",
  ],
  bannerImages: ["", "", ""],
  galleryImages: ["", "", "", "", "", "", "", ""],
};

function fillArray(arr: string[], length: number): (string | null)[] {
  const result: (string | null)[] = [];
  for (let i = 0; i < length; i++) {
    result.push(arr[i] ?? null);
  }
  return result;
}

export function WebsiteImagesTab() {
  const [appearance, setAppearance] = useState<AppearanceSettings>(DEFAULT_APPEARANCE);
  const [resetOpen, setResetOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = getItem<AppearanceSettings>(STORAGE_KEYS.APPEARANCE, DEFAULT_APPEARANCE);
    setAppearance({
      ...DEFAULT_APPEARANCE,
      ...saved,
      facilitiesImages: fillArray(saved.facilitiesImages ?? [], 6).map((v) => v ?? ""),
      bannerImages: fillArray(saved.bannerImages ?? [], 3).map((v) => v ?? ""),
      galleryImages: fillArray(saved.galleryImages ?? [], 8).map((v) => v ?? ""),
    });
  }, []);

  function setHero(url: string) {
    setAppearance((prev) => ({ ...prev, heroImageUrl: url }));
  }

  function setAbout(url: string) {
    setAppearance((prev) => ({ ...prev, aboutImageUrl: url }));
  }

  function setFacility(idx: number, url: string) {
    setAppearance((prev) => {
      const arr = [...prev.facilitiesImages];
      arr[idx] = url;
      return { ...prev, facilitiesImages: arr };
    });
  }

  function setBanner(idx: number, url: string) {
    setAppearance((prev) => {
      const arr = [...prev.bannerImages];
      arr[idx] = url;
      return { ...prev, bannerImages: arr };
    });
  }

  function setGallery(idx: number, url: string) {
    setAppearance((prev) => {
      const arr = [...prev.galleryImages];
      arr[idx] = url;
      return { ...prev, galleryImages: arr };
    });
  }

  function handleSave() {
    setSaving(true);
    try {
      setItem(STORAGE_KEYS.APPEARANCE, appearance);
      toast.success("Images Saved", "Website images have been saved.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setAppearance(DEFAULT_APPEARANCE);
    localStorage.removeItem(STORAGE_KEYS.APPEARANCE);
    toast.success("Images Reset", "Website images have been reset to defaults.");
    setResetOpen(false);
  }

  return (
    <div className="space-y-8">
      {/* Note */}
      <p className="text-xs text-text-secondary bg-elevated rounded-lg px-4 py-3 border border-border">
        Images are stored as preview URLs in your browser. To persist images permanently, connect a storage provider like Supabase Storage.
      </p>

      {/* Hero Image */}
      <section>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Hero Image</h3>
        <div className="max-w-lg">
          <ImageUploadField
            value={appearance.heroImageUrl || null}
            onChange={setHero}
            aspectRatio="16/9"
            placeholder="Upload hero background image"
          />
        </div>
      </section>

      {/* About Image */}
      <section>
        <h3 className="text-sm font-semibold text-text-primary mb-3">About Section Image</h3>
        <div className="max-w-xs">
          <ImageUploadField
            value={appearance.aboutImageUrl || null}
            onChange={setAbout}
            aspectRatio="1/1"
            placeholder="Upload about section image"
          />
        </div>
      </section>

      {/* Facilities Images */}
      <section>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Facilities Images (up to 6)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {appearance.facilitiesImages.map((img, idx) => (
            <ImageUploadField
              key={idx}
              value={img || null}
              onChange={(url) => setFacility(idx, url)}
              aspectRatio="4/3"
              placeholder={`Facility ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Promotional Banners */}
      <section>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Promotional Banners (up to 3)</h3>
        <div className="space-y-3 max-w-xl">
          {appearance.bannerImages.map((img, idx) => (
            <ImageUploadField
              key={idx}
              value={img || null}
              onChange={(url) => setBanner(idx, url)}
              aspectRatio="16/9"
              placeholder={`Banner ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Gallery Images */}
      <section>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Gallery Images (up to 8)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {appearance.galleryImages.map((img, idx) => (
            <ImageUploadField
              key={idx}
              value={img || null}
              onChange={(url) => setGallery(idx, url)}
              aspectRatio="4/3"
              placeholder={`Gallery ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button variant="primary" loading={saving} onClick={handleSave}>
          Save Changes
        </Button>
        <Button variant="outline" onClick={() => setResetOpen(true)}>
          Reset to Default
        </Button>
      </div>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title="Reset Website Images"
        description="This will reset all website images to their defaults. Are you sure?"
        confirmLabel="Reset"
        confirmVariant="danger"
      />
    </div>
  );
}
