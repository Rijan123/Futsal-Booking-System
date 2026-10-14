import React from "react";
import { Badge, type BadgeVariant } from "./Badge";
import type { Booking } from "@/types";

interface BookingStatusBadgeProps {
  status: Booking["status"];
  className?: string;
}

const statusToVariant: Record<Booking["status"], BadgeVariant> = {
  confirmed: "confirmed",
  pending: "pending",
  cancelled: "cancelled",
};

const statusLabels: Record<Booking["status"], string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
};

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  return (
    <Badge
      variant={statusToVariant[status]}
      label={statusLabels[status]}
      className={className}
    />
  );
}
