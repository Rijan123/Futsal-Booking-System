"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  MapPin,
  Users,
  BarChart3,
  Megaphone,
  Bell,
  Image,
  Settings,
  X,
  Zap,
} from "lucide-react";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { AppHeader } from "@/components/admin/AppHeader";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Booking Calendar", href: "/admin/calendar", icon: CalendarDays },
  { label: "Bookings", href: "/admin/bookings", icon: BookOpen },
  { label: "Courts", href: "/admin/courts", icon: MapPin },
  { label: "Attendance", href: "/admin/attendance", icon: Users },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Media & Appearance", href: "/admin/media", icon: Image },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <AppSidebar />

      {/* Mobile slide-over sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          aria-modal="true"
          role="dialog"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-border flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <Zap className="w-4 h-4 text-black" aria-hidden="true" />
                </div>
                <span className="font-bold text-text-primary text-sm">
                  FutsalPro
                  <span className="block text-xs text-text-secondary font-normal">
                    Admin Panel
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 py-4 overflow-y-auto" aria-label="Admin navigation">
              <ul className="space-y-0.5 px-2">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          active
                            ? "bg-accent/10 text-accent border-l-2 border-accent -ml-0.5 pl-[11px]"
                            : "text-text-secondary hover:text-text-primary hover:bg-elevated"
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-auto min-w-0">
        <AppHeader onMobileMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 bg-background">
          <div className="opacity-100 transition-opacity duration-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
