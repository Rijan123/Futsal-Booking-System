"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/lib/toast";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import type { BrandingSettings } from "@/types";

const DEFAULT_BRANDING: BrandingSettings = {
  businessName: "FutsalPro",
  logoUrl: "",
  primaryColor: "#A3FF3F",
  heroImageUrl: "",
  heroHeadline: "Book Your Court, Play Your Game",
  heroSubheading:
    "State-of-the-art futsal courts in the heart of Kathmandu. Book instantly, play confidently.",
};

export function BrandingTab() {
  const [branding, setBranding] = useState<BrandingSettings>(DEFAULT_BRANDING);
  const [colorHex, setColorHex] = useState(DEFAULT_BRANDING.primaryColor);
  const [resetOpen, setResetOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = getItem<BrandingSettings>(STORAGE_KEYS.BRANDING, DEFAULT_BRANDING);
    setBranding(saved);
    setColorHex(saved.primaryColor);
  }, []);

  function setField<K extends keyof BrandingSettings>(key: K, value: BrandingSettings[K]) {
    setBranding((prev) => ({ ...prev, [key]: value }));
    if (key === "primaryColor") {
      setColorHex(value as string);
    }
  }

  function handleColorInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setColorHex(v);
    // validate hex before updating
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
      setBranding((prev) => ({ ...prev, primaryColor: v }));
    }
  }

  function handleSave() {
    setSaving(true);
    try {
      setItem(STORAGE_KEYS.BRANDING, branding);
      toast.success("Branding Saved", "Your branding settings have been saved.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setBranding(DEFAULT_BRANDING);
    setColorHex(DEFAULT_BRANDING.primaryColor);
    setItem(STORAGE_KEYS.BRANDING, DEFAULT_BRANDING);
    toast.success("Branding Reset", "Settings have been reset to defaults.");
    setResetOpen(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="lg:col-span-2 space-y-5">
        {/* Business Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">Business Name</label>
          <input
            type="text"
            value={branding.businessName}
            onChange={(e) => setField("businessName", e.target.value)}
            className="w-full rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Logo */}
        <ImageUploadField
          label="Logo (1:1)"
          value={branding.logoUrl || null}
          onChange={(url) => setField("logoUrl", url)}
          aspectRatio="1/1"
          placeholder="Upload logo"
        />

        {/* Primary Color */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">Primary Accent Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={branding.primaryColor}
              onChange={(e) => {
                setColorHex(e.target.value);
                setField("primaryColor", e.target.value);
              }}
              className="h-10 w-14 rounded-lg border border-border bg-card cursor-pointer"
              aria-label="Pick primary color"
            />
            <input
              type="text"
              value={colorHex}
              onChange={handleColorInputChange}
              maxLength={7}
              placeholder="#A3FF3F"
              className="flex-1 rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Hero Image */}
        <ImageUploadField
          label="Hero Image (16:9)"
          value={branding.heroImageUrl || null}
          onChange={(url) => setField("heroImageUrl", url)}
          aspectRatio="16/9"
          placeholder="Upload hero image"
        />

        {/* Homepage Headline */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">Homepage Headline</label>
          <input
            type="text"
            value={branding.heroHeadline}
            onChange={(e) => setField("heroHeadline", e.target.value)}
            className="w-full rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Homepage Subheading */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">Homepage Subheading</label>
          <textarea
            value={branding.heroSubheading}
            onChange={(e) => setField("heroSubheading", e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-border bg-card text-text-primary px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="primary" loading={saving} onClick={handleSave}>
            Save Changes
          </Button>
          <Button variant="outline" onClick={() => setResetOpen(true)}>
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">Live Preview</h3>
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          {/* Color swatch */}
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg border border-border flex-shrink-0"
              style={{ backgroundColor: branding.primaryColor }}
              aria-label="Accent color preview"
            />
            <div>
              <p className="text-xs text-text-secondary">Accent Color</p>
              <p className="text-sm font-mono text-text-primary">{branding.primaryColor}</p>
            </div>
          </div>

          {/* Business name */}
          <div>
            <p className="text-xs text-text-secondary mb-1">Business Name</p>
            <p
              className="text-lg font-bold"
              style={{ color: branding.primaryColor }}
            >
              {branding.businessName || "FutsalPro"}
            </p>
          </div>

          {/* Headline preview */}
          <div>
            <p className="text-xs text-text-secondary mb-1">Hero Headline</p>
            <p className="text-sm font-semibold text-text-primary leading-snug">
              {branding.heroHeadline || "Book Your Court, Play Your Game"}
            </p>
          </div>

          {/* Logo preview */}
          {branding.logoUrl && (
            <div>
              <p className="text-xs text-text-secondary mb-1">Logo</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={branding.logoUrl}
                alt="Logo preview"
                className="h-16 w-16 object-cover rounded-lg border border-border"
              />
            </div>
          )}
        </div>
      </div>

      {/* Reset confirm */}
      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title="Reset Branding"
        description="This will reset all branding settings to their defaults. Are you sure?"
        confirmLabel="Reset"
        confirmVariant="danger"
      />
    </div>
  );
}
