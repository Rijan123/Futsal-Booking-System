"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNotifications } from "@/lib/notificationStore";
import { NotificationDropdown } from "./NotificationDropdown";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Overview",
  "/admin/calendar": "Booking Calendar",
  "/admin/bookings": "Bookings",
  "/admin/courts": "Courts",
  "/admin/attendance": "Attendance",
  "/admin/reports": "Reports",
  "/admin/announcements": "Announcements",
  "/admin/notifications": "Notifications",
  "/admin/media": "Media & Appearance",
  "/admin/settings": "Settings",
};

interface AppHeaderProps {
  onMobileMenuToggle: () => void;
}

export function AppHeader({ onMobileMenuToggle }: AppHeaderProps) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  function reloadCount() {
    const notifications = getNotifications();
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }

  useEffect(() => {
    reloadCount();
    window.addEventListener("notifications-updated", reloadCount);
    return () => window.removeEventListener("notifications-updated", reloadCount);
  }, []);

  // Close dropdown on click-outside
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const pageTitle = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <header className="sticky top-0 z-30 h-16 bg-sidebar border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">{pageTitle}</h1>
      </div>

      {/* Right: notifications bell + admin avatar */}
      <div className="flex items-center gap-2">
        {/* Notification bell with dropdown */}
        <div className="relative" ref={bellRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={cn(
              "relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span
                className={cn(
                  "absolute top-1 right-1 min-w-[16px] h-4 rounded-full",
                  "bg-cancelled text-white text-[10px] font-bold",
                  "flex items-center justify-center px-0.5 leading-none"
                )}
                aria-hidden="true"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <NotificationDropdown onClose={() => setDropdownOpen(false)} />
          )}
        </div>

        {/* Admin avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <span className="text-black text-xs font-bold">A</span>
          </div>
          <span className="hidden sm:block text-sm font-medium text-text-primary">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
