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
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
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

interface AppSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function AppSidebar({ collapsed = false, onCollapse }: AppSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const handleToggle = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    onCollapse?.(next);
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col bg-sidebar border-r border-border transition-all duration-300 min-h-screen",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 h-16 border-b border-border flex-shrink-0",
          isCollapsed && "justify-center px-2"
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-black" aria-hidden="true" />
        </div>
        {!isCollapsed && (
          <span className="font-bold text-text-primary text-sm leading-tight">
            FutsalPro
            <span className="block text-xs text-text-secondary font-normal">
              Admin Panel
            </span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto" aria-label="Admin navigation">
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-accent/10 text-accent border-l-2 border-accent -ml-0.5 pl-[11px]"
                      : "text-text-secondary hover:text-text-primary hover:bg-elevated",
                    isCollapsed && "justify-center px-2 border-l-0 ml-0 pl-2"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "flex-shrink-0",
                      isCollapsed ? "w-5 h-5" : "w-4 h-4"
                    )}
                    aria-hidden="true"
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          type="button"
          onClick={handleToggle}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
