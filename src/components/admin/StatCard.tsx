import React from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardColor = "accent" | "green" | "amber" | "red" | "purple";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: StatCardColor;
}

const colorConfig: Record<
  StatCardColor,
  { iconBg: string; iconText: string }
> = {
  accent: { iconBg: "bg-accent/10", iconText: "text-accent" },
  green: { iconBg: "bg-accent-secondary/10", iconText: "text-accent-secondary" },
  amber: { iconBg: "bg-pending/10", iconText: "text-pending" },
  red: { iconBg: "bg-cancelled/10", iconText: "text-cancelled" },
  purple: { iconBg: "bg-maintenance/10", iconText: "text-maintenance" },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = "accent",
}: StatCardProps) {
  const { iconBg, iconText } = colorConfig[color];

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            iconBg
          )}
          aria-hidden="true"
        >
          <Icon className={cn("w-5 h-5", iconText)} />
        </div>
      </div>

      {trend && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trendUp ? "text-accent-secondary" : "text-cancelled"
          )}
        >
          {trendUp ? (
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
