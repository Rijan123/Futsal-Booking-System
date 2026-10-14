"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnnouncementBanner } from "@/components/public/AnnouncementBanner";
import { AnnouncementModal } from "@/components/public/AnnouncementModal";
import { HeroSection } from "@/components/public/HeroSection";
import { CourtCard } from "@/components/public/CourtCard";
import { FacilitiesSection } from "@/components/public/FacilitiesSection";
import { HowItWorksSection } from "@/components/public/HowItWorksSection";
import { PhotoGallery } from "@/components/public/PhotoGallery";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { Button } from "@/components/ui/Button";
import { DEMO_COURTS } from "@/data/courts";
import { getItem } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { Court } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const [courts, setCourts] = useState<Court[]>(DEMO_COURTS);

  useEffect(() => {
    const stored = getItem<Court[]>(STORAGE_KEYS.COURTS, DEMO_COURTS);
    if (stored.length > 0) setCourts(stored);
  }, []);

  return (
    <>
      <AnnouncementModal />
      <AnnouncementBanner />
      <PublicNavbar />
      <main>
        {/* Hero */}
        <HeroSection />

        {/* Courts section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium mb-3">
                  Our Venues
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
                  Our Courts
                </h2>
              </div>
              <Link
                href="/courts"
                className="text-accent text-sm font-medium hover:text-accent/80 transition-colors hidden sm:block"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {courts.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  onViewDetails={(c) => router.push(`/courts/${c.id}`)}
                  onBookNow={(c) => router.push(`/book?courtId=${c.id}`)}
                />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/courts">
                <Button variant="outline" size="md">
                  View All Courts
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <FacilitiesSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Photo Gallery */}
        <PhotoGallery />

        {/* CTA section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-sidebar">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Ready to Play?
            </h2>
            <p className="text-text-secondary text-base mb-8">
              Book your court now and experience the best futsal in Kathmandu. Instant confirmation, no hassle.
            </p>
            <Link href="/book">
              <Button variant="primary" size="lg">
                Book Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
