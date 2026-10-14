"use client";

import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Step1CourtSelect } from "./Step1CourtSelect";
import { Step2DateSelect } from "./Step2DateSelect";
import { Step3TimeSelect } from "./Step3TimeSelect";
import { Step4CustomerDetails, type CustomerDetails } from "./Step4CustomerDetails";
import { Step5ReviewBooking } from "./Step5ReviewBooking";
import { Step6Confirmation } from "./Step6Confirmation";
import { DEMO_COURTS } from "@/data/courts";
import { DEMO_BOOKINGS } from "@/data/bookings";
import { getItem, STORAGE_KEYS } from "@/lib/storage";
import { saveBooking } from "@/lib/bookingService";
import { cn } from "@/lib/utils";
import type { Court, Booking } from "@/types";

const STEP_LABELS = [
  "Court",
  "Date",
  "Time",
  "Details",
  "Review",
  "Done",
];

interface BookingWizardProps {
  initialCourtId?: string;
}

export function BookingWizard({ initialCourtId }: BookingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [courts, setCourts] = useState<Court[]>(DEMO_COURTS);
  const [bookings, setBookings] = useState<Booking[]>(DEMO_BOOKINGS);

  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(
    initialCourtId ?? null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [customerDetailsValid, setCustomerDetailsValid] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  useEffect(() => {
    const storedCourts = getItem<Court[]>(STORAGE_KEYS.COURTS, DEMO_COURTS);
    if (storedCourts.length > 0) setCourts(storedCourts);
    const storedBookings = getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, DEMO_BOOKINGS);
    if (storedBookings.length > 0) setBookings(storedBookings);
  }, []);

  // Skip to step 2 if a court was pre-selected
  useEffect(() => {
    if (initialCourtId) setCurrentStep(2);
  }, [initialCourtId]);

  const selectedCourt = courts.find((c) => c.id === selectedCourtId) ?? null;

  function canAdvance(): boolean {
    switch (currentStep) {
      case 1: return selectedCourtId !== null;
      case 2: return selectedDate !== null;
      case 3: return selectedStartTime !== null && (selectedEndTime ?? "") !== "";
      case 4: return customerDetailsValid;
      case 5: return true;
      default: return false;
    }
  }

  function handleNext() {
    if (!canAdvance()) return;
    if (currentStep === 5) {
      // Confirm booking
      const ref = "FP-" + Date.now().toString(36).toUpperCase();
      setBookingRef(ref);

      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        courtId: selectedCourtId!,
        courtName: selectedCourt?.name ?? "",
        customerName: customerDetails.name,
        customerPhone: customerDetails.phone,
        customerEmail: customerDetails.email,
        date: selectedDate!,
        startTime: selectedStartTime!,
        endTime: selectedEndTime!,
        duration:
          parseInt((selectedEndTime ?? "00:00").split(":")[0], 10) -
          parseInt((selectedStartTime ?? "00:00").split(":")[0], 10),
        totalPrice:
          (selectedCourt?.pricePerHour ?? 0) *
          (parseInt((selectedEndTime ?? "00:00").split(":")[0], 10) -
            parseInt((selectedStartTime ?? "00:00").split(":")[0], 10)),
        status: "pending",
        paymentStatus: "unpaid",
        notes: customerDetails.notes,
        createdAt: new Date().toISOString(),
      };

      // Persist to localStorage and fire notification
      saveBooking(newBooking);
    }
    setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(1, s - 1));
  }

  function handleReset() {
    setCurrentStep(1);
    setSelectedCourtId(null);
    setSelectedDate(null);
    setSelectedStartTime(null);
    setSelectedEndTime(null);
    setCustomerDetails({ name: "", phone: "", email: "", notes: "" });
    setCustomerDetailsValid(false);
    setBookingRef("");
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress indicator */}
      {currentStep < 6 && (
        <div className="mb-8">
          <div className="flex items-center">
            {STEP_LABELS.slice(0, 5).map((label, i) => {
              const step = i + 1;
              const isCompleted = step < currentStep;
              const isCurrent = step === currentStep;
              const isUpcoming = step > currentStep;

              return (
                <React.Fragment key={step}>
                  {/* Step circle */}
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                        isCompleted
                          ? "bg-accent text-black"
                          : isCurrent
                          ? "bg-accent text-black ring-4 ring-accent/30"
                          : "bg-elevated border border-border text-text-secondary"
                      )}
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : step}
                    </div>
                    <span
                      className={cn(
                        "text-xs hidden sm:block",
                        isCurrent ? "text-accent font-medium" : isUpcoming ? "text-text-secondary" : "text-text-secondary"
                      )}
                    >
                      {label}
                    </span>
                  </div>
                  {/* Connector line */}
                  {i < 4 && (
                    <div
                      className={cn(
                        "flex-1 h-px mx-2 mt-[-1rem]",
                        step < currentStep ? "bg-accent" : "bg-border"
                      )}
                      aria-hidden="true"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        {currentStep === 1 && (
          <Step1CourtSelect
            courts={courts}
            selectedCourtId={selectedCourtId}
            onSelect={(c) => setSelectedCourtId(c.id)}
          />
        )}
        {currentStep === 2 && (
          <Step2DateSelect
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            bookings={bookings}
            courtId={selectedCourtId}
          />
        )}
        {currentStep === 3 && (
          <Step3TimeSelect
            selectedStartTime={selectedStartTime}
            selectedEndTime={selectedEndTime}
            onSelectStart={(t) => { setSelectedStartTime(t); setSelectedEndTime(null); }}
            onSelectEnd={setSelectedEndTime}
            bookings={bookings}
            courtId={selectedCourtId}
            selectedDate={selectedDate}
          />
        )}
        {currentStep === 4 && (
          <Step4CustomerDetails
            details={customerDetails}
            onChange={setCustomerDetails}
            onValidate={setCustomerDetailsValid}
          />
        )}
        {currentStep === 5 && (
          <Step5ReviewBooking
            court={selectedCourt}
            date={selectedDate}
            startTime={selectedStartTime}
            endTime={selectedEndTime}
            customerDetails={customerDetails}
            onEditStep={(step) => setCurrentStep(step)}
          />
        )}
        {currentStep === 6 && (
          <Step6Confirmation
            bookingRef={bookingRef}
            court={selectedCourt}
            date={selectedDate}
            startTime={selectedStartTime}
            endTime={selectedEndTime}
            customerDetails={customerDetails}
            onBookAnother={handleReset}
          />
        )}
      </div>

      {/* Navigation buttons */}
      {currentStep < 6 && (
        <div className="flex items-center justify-between mt-5">
          <Button
            variant="outline"
            size="md"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            disabled={!canAdvance()}
          >
            {currentStep === 5 ? "Confirm Booking" : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
}
