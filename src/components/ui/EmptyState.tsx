import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      <div className="p-4 rounded-full bg-elevated border border-border mb-4">
        <Icon className="h-8 w-8 text-text-secondary" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-xs">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
