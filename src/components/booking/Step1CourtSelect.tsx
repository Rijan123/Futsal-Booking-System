import React from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Court } from "@/types";

interface Step1Props {
  courts: Court[];
  selectedCourtId: string | null;
  onSelect: (court: Court) => void;
}

export function Step1CourtSelect({ courts, selectedCourtId, onSelect }: Step1Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">Choose a Court</h2>
      <p className="text-text-secondary text-sm mb-6">
        Select the court you would like to book.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courts.map((court) => {
          const isSelected = selectedCourtId === court.id;
          const isDisabled = court.status !== "available";

          return (
            <button
              key={court.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(court)}
              className={cn(
                "text-left rounded-xl border overflow-hidden transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                isSelected
                  ? "border-accent ring-1 ring-accent"
                  : "border-border hover:border-text-secondary",
                isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              )}
              aria-pressed={isSelected}
              aria-disabled={isDisabled}
              aria-label={`Select ${court.name}`}
            >
              {/* Image */}
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={court.mainImage}
                  alt={court.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-accent" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={court.status === "available" ? "available" : "maintenance"}
                    label={court.status === "available" ? "Available" : "Maintenance"}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-text-primary font-semibold text-sm">{court.name}</h3>
                    <p className="text-text-secondary text-xs mt-0.5 capitalize">{court.type}</p>
                  </div>
                  <span className="text-accent font-bold text-sm whitespace-nowrap">
                    NPR {court.pricePerHour.toLocaleString("en-IN")}/hr
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
