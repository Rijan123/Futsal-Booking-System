"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle, Zap, Users, Car, Coffee, Shield, Wifi, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DEMO_COURTS } from "@/data/courts";
import { getItem, STORAGE_KEYS } from "@/lib/storage";
import type { Court } from "@/types";
import type { LucideIcon } from "lucide-react";

const facilityIconMap: Record<string, LucideIcon> = {
  "LED Lighting": Zap,
  "Floodlights": Zap,
  "Changing Room": Users,
  "VIP Changing Room": Users,
  "Spectator Seating": Users,
  "Parking": Car,
  "Cafeteria": Coffee,
  "Lounge": Coffee,
  "Security": Shield,
  "First Aid": Shield,
  "WiFi": Wifi,
  "Natural Grass": Star,
  "Synthetic Turf": Star,
};

interface PageProps {
  params: { id: string };
}

export default function CourtDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [court, setCourt] = useState<Court | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    const stored = getItem<Court[]>(STORAGE_KEYS.COURTS, DEMO_COURTS);
    const found = stored.find((c) => c.id === params.id);
    if (found) {
      setCourt(found);
      setMainImage(found.mainImage);
    } else {
      setNotFound(true);
    }
  }, [params.id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <EmptyState
          icon={ArrowLeft}
          title="Court not found"
          description="The court you're looking for doesn't exist or has been removed."
          action={{
            label: "Back to Courts",
            onClick: () => router.push("/courts"),
          }}
        />
      </div>
    );
  }

  if (!court) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <Link
          href="/courts"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courts
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — images and info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main image */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-card border border-border" style={{ aspectRatio: "16/9" }}>
              <Image
                src={mainImage}
                alt={court.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>

            {/* Thumbnail row */}
            {court.images.length > 1 && (
              <div className="flex gap-3">
                {court.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMainImage(img)}
                    className={`relative h-16 w-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${
                      mainImage === img ? "border-accent" : "border-border hover:border-text-secondary"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${court.name} view ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Court name & badges */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-elevated border border-border text-text-secondary capitalize">
                  {court.type}
                </span>
                <Badge
                  variant={court.status === "available" ? "available" : "maintenance"}
                  label={court.status === "available" ? "Available" : "Maintenance"}
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                {court.name}
              </h1>
              <p className="text-text-secondary text-base leading-relaxed">{court.description}</p>
            </div>

            {/* Facilities */}
            <div>
              <h2 className="text-text-primary font-semibold text-lg mb-4">Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {court.facilities.map((f) => {
                  const Icon = facilityIconMap[f] ?? CheckCircle;
                  return (
                    <div
                      key={f}
                      className="flex items-center gap-2.5 p-3 bg-card border border-border rounded-xl"
                    >
                      <Icon className="h-4 w-4 text-accent flex-shrink-0" aria-hidden="true" />
                      <span className="text-text-secondary text-sm">{f}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operating hours */}
            <div>
              <h2 className="text-text-primary font-semibold text-lg mb-4">Operating Hours</h2>
              <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl">
                <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-text-primary font-medium">
                  Daily: {court.operatingHours.open} – {court.operatingHours.close}
                </span>
              </div>
            </div>
          </div>

          {/* Right — pricing card + CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Pricing card */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-accent">
                    NPR {court.pricePerHour.toLocaleString("en-IN")}
                  </span>
                  <span className="text-text-secondary text-sm">/hr</span>
                </div>
                <p className="text-text-secondary text-sm mb-6">
                  Per hour · Inclusive of all facilities
                </p>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={court.status !== "available"}
                  onClick={() => router.push(`/book?courtId=${court.id}`)}
                >
                  {court.status === "available" ? "Book This Court" : "Currently Unavailable"}
                </Button>

                {court.status !== "available" && (
                  <p className="text-text-secondary text-xs text-center mt-3">
                    This court is currently under maintenance.
                  </p>
                )}

                <div className="mt-6 pt-5 border-t border-border space-y-3">
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <CheckCircle className="h-4 w-4 text-accent-secondary flex-shrink-0" />
                    Instant confirmation
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <CheckCircle className="h-4 w-4 text-accent-secondary flex-shrink-0" />
                    Free cancellation (24h notice)
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <CheckCircle className="h-4 w-4 text-accent-secondary flex-shrink-0" />
                    All facilities included
                  </div>
                </div>
              </div>

              {/* CTA section */}
              <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 text-center">
                <p className="text-accent font-semibold text-sm mb-1">Need help?</p>
                <p className="text-text-secondary text-xs mb-3">
                  Call us at +977-1-4567890 or browse all courts.
                </p>
                <Link href="/courts">
                  <Button variant="outline" size="sm" className="w-full">
                    Browse All Courts
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
