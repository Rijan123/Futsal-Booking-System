"use client";

import React, { useRef } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

type AspectRatio = "16/9" | "1/1" | "4/3";

interface ImageUploadFieldProps {
  value: string | null;
  onChange: (dataUrl: string) => void;
  label?: string;
  aspectRatio?: AspectRatio;
  placeholder?: string;
  className?: string;
}

const aspectClasses: Record<AspectRatio, string> = {
  "16/9": "aspect-video",
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
};

const SIZE_LIMIT_BYTES = 2 * 1024 * 1024; // 2 MB

export function ImageUploadField({
  value,
  onChange,
  label,
  aspectRatio = "16/9",
  placeholder = "Click to upload an image",
  className,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [warning, setWarning] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setWarning(null);

    if (file.size > SIZE_LIMIT_BYTES) {
      setWarning(
        `This image is ${(file.size / 1024 / 1024).toFixed(1)} MB. Large images may exceed browser localStorage limits. Consider using a smaller image.`
      );
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setWarning(null);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-text-primary">{label}</label>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative w-full rounded-xl border-2 border-dashed border-border bg-card",
          "hover:border-accent/50 hover:bg-elevated transition-colors",
          "overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          aspectClasses[aspectRatio]
        )}
        aria-label={value ? "Change image" : placeholder}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex flex-col items-center gap-1 text-white">
                <Upload className="h-6 w-6" aria-hidden="true" />
                <span className="text-xs font-medium">Change image</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-secondary">
            <Upload className="h-8 w-8" aria-hidden="true" />
            <span className="text-sm">{placeholder}</span>
            <span className="text-xs opacity-70">PNG, JPG, WEBP supported</span>
          </div>
        )}
      </button>

      {warning && (
        <p className="text-xs text-pending" role="alert">
          ⚠ {warning}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
