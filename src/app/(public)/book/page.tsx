"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookingWizard } from "@/components/booking/BookingWizard";

function BookingPageInner() {
  const searchParams = useSearchParams();
  const courtId = searchParams.get("courtId") ?? undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-sidebar border-b border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Book a Court
          </h1>
          <p className="text-text-secondary text-base">
            Complete the steps below to reserve your futsal court.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BookingWizard initialCourtId={courtId} />

        {/* Demo mode notice */}
        <p className="text-center text-text-secondary text-xs mt-6">
          DEMO MODE — bookings are saved to this browser only and are not connected to a real backend.
        </p>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BookingPageInner />
    </Suspense>
  );
}
