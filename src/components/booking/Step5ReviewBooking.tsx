import React from "react";
import { CalendarDays, Clock, User, Phone, Mail, MapPin, Edit2 } from "lucide-react";
import { formatTime, formatDate, formatCurrency } from "@/lib/utils";
import type { Court } from "@/types";
import type { CustomerDetails } from "./Step4CustomerDetails";

interface Step5Props {
  court: Court | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  customerDetails: CustomerDetails;
  onEditStep: (step: number) => void;
}

function ReviewRow({
  icon: Icon,
  label,
  value,
  onEdit,
  editStep,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onEdit?: (step: number) => void;
  editStep?: number;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="text-text-secondary text-xs mb-0.5">{label}</p>
          <p className="text-text-primary text-sm font-medium">{value}</p>
        </div>
      </div>
      {onEdit && editStep !== undefined && (
        <button
          type="button"
          onClick={() => onEdit(editStep)}
          className="flex items-center gap-1 text-text-secondary hover:text-accent text-xs transition-colors"
          aria-label={`Edit ${label}`}
        >
          <Edit2 className="h-3 w-3" />
          Edit
        </button>
      )}
    </div>
  );
}

export function Step5ReviewBooking({
  court,
  date,
  startTime,
  endTime,
  customerDetails,
  onEditStep,
}: Step5Props) {
  const duration =
    startTime && endTime
      ? parseInt(endTime.split(":")[0], 10) - parseInt(startTime.split(":")[0], 10)
      : 0;
  const totalPrice = court ? duration * court.pricePerHour : 0;

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">Review Your Booking</h2>
      <p className="text-text-secondary text-sm mb-6">
        Please confirm the details below before finalising your booking.
      </p>

      <div className="bg-card border border-border rounded-2xl overflow-hidden max-w-lg">
        {/* Court */}
        <div className="px-5 pt-5 pb-3">
          <ReviewRow
            icon={MapPin}
            label="Court"
            value={court?.name ?? "—"}
            onEdit={onEditStep}
            editStep={1}
          />
          <ReviewRow
            icon={CalendarDays}
            label="Date"
            value={date ? formatDate(date + "T00:00:00") : "—"}
            onEdit={onEditStep}
            editStep={2}
          />
          <ReviewRow
            icon={Clock}
            label="Time"
            value={
              startTime && endTime
                ? `${formatTime(startTime)} – ${formatTime(endTime)}`
                : "—"
            }
            onEdit={onEditStep}
            editStep={3}
          />
          <ReviewRow
            icon={Clock}
            label="Duration"
            value={`${duration} hour${duration !== 1 ? "s" : ""}`}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-border mx-5" />

        {/* Customer details */}
        <div className="px-5 py-3">
          <ReviewRow
            icon={User}
            label="Name"
            value={customerDetails.name || "—"}
            onEdit={onEditStep}
            editStep={4}
          />
          <ReviewRow
            icon={Phone}
            label="Phone"
            value={customerDetails.phone || "—"}
            onEdit={onEditStep}
            editStep={4}
          />
          {customerDetails.email && (
            <ReviewRow
              icon={Mail}
              label="Email"
              value={customerDetails.email}
            />
          )}
        </div>

        {/* Total price */}
        <div className="bg-elevated border-t border-border px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-text-secondary text-xs mb-0.5">Total Amount</p>
            <p className="text-text-primary text-sm">
              {duration} hr × NPR {court?.pricePerHour.toLocaleString("en-IN")}
            </p>
          </div>
          <span className="text-2xl font-bold text-accent">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      {customerDetails.notes && (
        <div className="mt-4 p-4 bg-card border border-border rounded-xl max-w-lg">
          <p className="text-text-secondary text-xs mb-1">Notes</p>
          <p className="text-text-primary text-sm">{customerDetails.notes}</p>
        </div>
      )}
    </div>
  );
}
