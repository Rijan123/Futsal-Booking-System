import type { Court } from "@/types";

/**
 * Demo court data for FutsalPro prototype.
 * Images sourced from Unsplash (sports/futsal courts).
 */
export const DEMO_COURTS: Court[] = [
  {
    id: "court-1",
    name: "Arena Court 1",
    description:
      "Our flagship 5-a-side indoor court with premium synthetic turf and professional-grade LED lighting. Perfect for competitive matches and training sessions.",
    type: "5-a-side",
    pricePerHour: 1200,
    status: "available",
    facilities: ["LED Lighting", "Changing Room", "Parking", "Cafeteria"],
    images: [
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    ],
    mainImage:
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80",
    operatingHours: { open: "06:00", close: "22:00" },
  },
  {
    id: "court-2",
    name: "Thunder Court 2",
    description:
      "A high-energy 5-a-side indoor court designed for intense gameplay. Features anti-slip flooring and surrounding spectator seating.",
    type: "5-a-side",
    pricePerHour: 1200,
    status: "available",
    facilities: ["LED Lighting", "Changing Room", "Spectator Seating", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
      "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80",
    ],
    mainImage:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    operatingHours: { open: "06:00", close: "22:00" },
  },
  {
    id: "court-3",
    name: "Champions Court 3",
    description:
      "Spacious 7-a-side outdoor court with natural grass and floodlights. Ideal for larger teams and weekend leagues.",
    type: "7-a-side",
    pricePerHour: 1500,
    status: "available",
    facilities: ["Floodlights", "Natural Grass", "Changing Room", "Parking", "Cafeteria"],
    images: [
      "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80",
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
    ],
    mainImage:
      "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80",
    operatingHours: { open: "06:00", close: "22:00" },
  },
  {
    id: "court-4",
    name: "Elite Court 4",
    description:
      "Premium 7-a-side indoor court with top-tier facilities. Currently undergoing scheduled maintenance to upgrade the turf surface.",
    type: "7-a-side",
    pricePerHour: 1800,
    status: "maintenance",
    facilities: ["LED Lighting", "VIP Changing Room", "Lounge", "Parking", "Cafeteria", "First Aid"],
    images: [
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80",
    ],
    mainImage:
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
    operatingHours: { open: "06:00", close: "22:00" },
  },
];
