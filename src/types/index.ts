/**
 * TypeScript interfaces for the FutsalPro Booking System.
 */

// ─── Court ────────────────────────────────────────────────────────────────────

export interface Court {
  id: string;
  name: string;
  description: string;
  type: "5-a-side" | "7-a-side" | "indoor" | "outdoor";
  pricePerHour: number;
  status: "available" | "maintenance" | "closed";
  facilities: string[];
  images: string[];
  mainImage: string;
  operatingHours: {
    open: string;  // "HH:mm"
    close: string; // "HH:mm"
  };
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;        // "YYYY-MM-DD"
  startTime: string;   // "HH:mm"
  endTime: string;     // "HH:mm"
  duration: number;    // in hours
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "partial";
  notes?: string;
  createdAt: string;   // ISO date string
}

// ─── Announcement ─────────────────────────────────────────────────────────────

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: string;
  displayStyle: "modal" | "banner" | "notification";
  enabled: boolean;
  startDate: string;   // "YYYY-MM-DD"
  endDate: string;     // "YYYY-MM-DD"
  frequency: "always" | "once" | "daily";
  actionLabel?: string;
  actionUrl?: string;
  image?: string;
  createdAt: string;   // ISO date string
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;   // ISO date string
  relatedId?: string;
  relatedType?: string;
}

// ─── BrandingSettings ─────────────────────────────────────────────────────────

export interface BrandingSettings {
  businessName: string;
  logoUrl: string;
  primaryColor: string;
  heroImageUrl: string;
  heroHeadline: string;
  heroSubheading: string;
}

// ─── AppearanceSettings ───────────────────────────────────────────────────────

export interface AppearanceSettings {
  heroImageUrl: string;
  aboutImageUrl: string;
  facilitiesImages: string[];
  bannerImages: string[];
  galleryImages: string[];
}
