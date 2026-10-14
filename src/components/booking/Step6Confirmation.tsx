import React from "react";
import Link from "next/link";
import { CheckCircle, CalendarDays, Clock, User, MapPin, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatTime, formatDate, formatCurrency } from "@/lib/utils";
import type { Court } from "@/types";
import type { CustomerDetails } from "./Step4CustomerDetails";

interface Step6Props {
  bookingRef: string;
  court: Court | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  customerDetails: CustomerDetails;
  onBookAnother: () => void;
}

export function Step6Confirmation({
  bookingRef,
  court,
  date,
  startTime,
  endTime,
  customerDetails,
  onBookAnother,
}: Step6Props) {
  const duration =
    startTime && endTime
      ? parseInt(endTime.split(":")[0], 10) - parseInt(startTime.split(":")[0], 10)
      : 0;
  const totalPrice = court ? duration * court.pricePerHour : 0;

  function copyRef() {
    navigator.clipboard.writeText(bookingRef).catch(() => {});
  }

  return (
    <div className="flex flex-col items-center text-center">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mb-6">
        <CheckCircle className="h-10 w-10 text-accent" />
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-2">Booking Confirmed!</h2>
      <p className="text-text-secondary text-sm mb-6 max-w-sm">
        Your court has been booked. See you on the pitch!
      </p>

      {/* Booking reference */}
      <div className="flex items-center gap-3 bg-accent/10 border border-accent/30 rounded-xl px-5 py-3 mb-8">
        <div>
          <p className="text-text-secondary text-xs mb-0.5">Booking Reference</p>
          <p className="text-accent font-bold text-lg tracking-wider">{bookingRef}</p>
        </div>
        <button
          type="button"
          onClick={copyRef}
          className="p-2 rounded-lg hover:bg-accent/20 text-accent transition-colors"
          aria-label="Copy booking reference"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>

      {/* Summary card */}
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl overflow-hidden text-left mb-6">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Booking Summary</p>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
            <div>
              <p className="text-text-secondary text-xs">Court</p>
              <p className="text-text-primary text-sm font-medium">{court?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 text-accent flex-shrink-0" />
            <div>
              <p className="text-text-secondary text-xs">Date</p>
              <p className="text-text-primary text-sm font-medium">
                {date ? formatDate(date + "T00:00:00") : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-accent flex-shrink-0" />
            <div>
              <p className="text-text-secondary text-xs">Time</p>
              <p className="text-text-primary text-sm font-medium">
                {startTime && endTime
                  ? `${formatTime(startTime)} – ${formatTime(endTime)} (${duration}h)`
                  : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-accent flex-shrink-0" />
            <div>
              <p className="text-text-secondary text-xs">Customer</p>
              <p className="text-text-primary text-sm font-medium">{customerDetails.name}</p>
            </div>
          </div>
        </div>
        <div className="bg-elevated border-t border-border px-5 py-3 flex items-center justify-between">
          <span className="text-text-secondary text-sm">Total Paid</span>
          <span className="text-accent font-bold text-lg">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button
          variant="outline"
          size="md"
          className="flex-1"
          onClick={onBookAnother}
        >
          Book Another
        </Button>
        <Link href="/" className="flex-1">
          <Button variant="primary" size="md" className="w-full">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
