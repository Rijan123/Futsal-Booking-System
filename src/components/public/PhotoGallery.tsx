"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Expand, X, ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const galleryPhotos = [
  {
    src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    alt: "Indoor futsal court with LED lighting",
  },
  {
    src: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80",
    alt: "Players in action on futsal court",
  },
  {
    src: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80",
    alt: "Outdoor futsal court at sunset",
  },
  {
    src: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
    alt: "Premium court with spectator seating",
  },
  {
    src: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
    alt: "Team celebrating on court",
  },
  {
    src: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
    alt: "Futsal match in progress",
  },
  {
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    alt: "Court facilities and amenities",
  },
  {
    src: "https://images.unsplash.com/photo-1509077877-6b4d3e1f4e1e?w=800&q=80",
    alt: "Players warming up before match",
  },
];

function Lightbox({
  photos,
  index,
  onClose,
}: {
  photos: typeof galleryPhotos;
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length);
  const next = () => setCurrent((c) => (c + 1) % photos.length);

  const handleKey = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    },
    [onClose] // eslint-disable-line react-hooks/exhaustive-deps
  );

  React.useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        aria-label="Previous photo"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Image */}
      <div
        className="relative w-full max-w-4xl max-h-[80vh] aspect-video mx-8"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photos[current].src}
          alt={photos[current].alt}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        aria-label="Next photo"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {current + 1} / {photos.length}
      </div>
    </div>,
    document.body
  );
}

export function PhotoGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="gallery">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium mb-4">
            Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            See Our Courts
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto text-base">
            Take a look at our premium futsal facilities and get inspired for your next game.
          </p>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryPhotos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              className={cn(
                "relative overflow-hidden rounded-xl cursor-pointer group",
                "aspect-video",
                // Make first photo span 2 cols on lg
                i === 0 ? "lg:col-span-2" : ""
              )}
              onClick={() => setLightboxIndex(i)}
              aria-label={`View photo: ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Expand className="h-8 w-8 text-white" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={galleryPhotos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
