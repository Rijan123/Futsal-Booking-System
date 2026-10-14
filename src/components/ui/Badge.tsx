import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "maintenance"
  | "available"
  | "default";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  label?: string;
}

const variantConfig: Record<
  BadgeVariant,
  { dot: string; container: string; text: string }
> = {
  confirmed: {
    dot: "bg-accent-secondary",
    container: "bg-accent-secondary/10 border-accent-secondary/20",
    text: "text-accent-secondary",
  },
  available: {
    dot: "bg-accent",
    container: "bg-accent/10 border-accent/20",
    text: "text-accent",
  },
  pending: {
    dot: "bg-pending",
    container: "bg-pending/10 border-pending/20",
    text: "text-pending",
  },
  cancelled: {
    dot: "bg-cancelled",
    container: "bg-cancelled/10 border-cancelled/20",
    text: "text-cancelled",
  },
  maintenance: {
    dot: "bg-maintenance",
    container: "bg-maintenance/10 border-maintenance/20",
    text: "text-maintenance",
  },
  default: {
    dot: "bg-text-secondary",
    container: "bg-elevated border-border",
    text: "text-text-secondary",
  },
};

export function Badge({ variant = "default", label, className, ...props }: BadgeProps) {
  const config = variantConfig[variant];

  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.container,
        config.text,
        className
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
