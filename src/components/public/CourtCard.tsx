import React from "react";
import Image from "next/image";
import { Zap, Users, Car, Coffee, Shield, Wifi, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Court } from "@/types";

interface CourtCardProps {
  court: Court;
  onViewDetails?: (court: Court) => void;
  onBookNow?: (court: Court) => void;
}

// Map facility names to Lucide icons
const facilityIconMap: Record<string, React.ElementType> = {
  "LED Lighting": Zap,
  "Floodlights": Zap,
  "Changing Room": Users,
  "VIP Changing Room": Users,
  "Spectator Seating": Users,
  "Parking": Car,
  "Cafeteria": Coffee,
  "Lounge": Coffee,
  "Security": Shield,
  "First Aid": Shield,
  "WiFi": Wifi,
  "Natural Grass": Star,
  "Synthetic Turf": Star,
};

function FacilityChip({ name }: { name: string }) {
  const Icon = facilityIconMap[name] ?? Star;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-elevated border border-border text-text-secondary text-xs">
      <Icon className="h-3 w-3 text-accent" aria-hidden="true" />
      {name}
    </span>
  );
}

export function CourtCard({ court, onViewDetails, onBookNow }: CourtCardProps) {
  const isUnavailable = court.status !== "available";
  const visibleFacilities = court.facilities.slice(0, 3);

  return (
    <article
      className={cn(
        "bg-card border border-border rounded-xl overflow-hidden",
        "transition-transform duration-200 hover:scale-[1.02]",
        "flex flex-col"
      )}
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={court.mainImage}
          alt={court.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Availability overlay badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={court.status === "available" ? "available" : "maintenance"}
            label={court.status === "available" ? "Available" : "Maintenance"}
          />
        </div>
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white border border-white/20 capitalize">
            {court.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Name & price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-text-primary font-semibold text-base leading-tight">{court.name}</h3>
          <span className="text-accent font-bold text-sm whitespace-nowrap">
            NPR {court.pricePerHour.toLocaleString("en-IN")}/hr
          </span>
        </div>

        {/* Facilities chips */}
        <div className="flex flex-wrap gap-1.5">
          {visibleFacilities.map((f) => (
            <FacilityChip key={f} name={f} />
          ))}
          {court.facilities.length > 3 && (
            <span className="px-2.5 py-1 rounded-lg bg-elevated border border-border text-text-secondary text-xs">
              +{court.facilities.length - 3} more
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(court)}
            disabled={false}
          >
            View Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onBookNow?.(court)}
            disabled={isUnavailable}
          >
            {isUnavailable ? "Unavailable" : "Book Now"}
          </Button>
        </div>
      </div>
    </article>
  );
}
