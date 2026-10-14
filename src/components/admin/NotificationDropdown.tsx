"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  CalendarCheck,
  XCircle,
  Wrench,
  Megaphone,
  Clock,
  TrendingUp,
  MessageSquare,
  Settings2,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "@/lib/notificationStore";
import type { Notification } from "@/types";

interface NotificationDropdownProps {
  onClose: () => void;
}

function getNotifIcon(type: string): React.ReactNode {
  const cls = "w-4 h-4";
  switch (type) {
    case "booking_new":
      return <CalendarCheck className={cn(cls, "text-accent")} />;
    case "booking_cancelled":
      return <XCircle className={cn(cls, "text-cancelled")} />;
    case "booking_pending":
      return <Clock className={cn(cls, "text-pending")} />;
    case "maintenance_reminder":
      return <Wrench className={cn(cls, "text-maintenance")} />;
    case "announcement_published":
      return <Megaphone className={cn(cls, "text-accent")} />;
    case "revenue_milestone":
      return <TrendingUp className={cn(cls, "text-accent")} />;
    case "customer_feedback":
      return <MessageSquare className={cn(cls, "text-accent-secondary")} />;
    case "system_update":
      return <Settings2 className={cn(cls, "text-text-secondary")} />;
    default:
      return <Bell className={cn(cls, "text-text-secondary")} />;
  }
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  function reload() {
    setNotifications(getNotifications());
  }

  useEffect(() => {
    reload();
    window.addEventListener("notifications-updated", reload);
    return () => window.removeEventListener("notifications-updated", reload);
  }, []);

  const recent = notifications.slice(0, 8);

  function handleItemClick(notif: Notification) {
    markAsRead(notif.id);
    onClose();
    router.push("/admin/notifications");
  }

  function handleMarkAll() {
    markAllAsRead();
  }

  return (
    <div
      className="absolute top-full right-0 mt-1 w-80 bg-elevated border border-border shadow-xl rounded-xl z-50 overflow-hidden"
      role="region"
      aria-label="Notifications panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
        <button
          type="button"
          onClick={handleMarkAll}
          className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
          aria-label="Mark all notifications as read"
        >
          <CheckCheck className="w-3.5 h-3.5" aria-hidden="true" />
          Mark all read
        </button>
      </div>

      {/* Notification list */}
      <ul className="divide-y divide-border max-h-80 overflow-y-auto" role="list">
        {recent.length === 0 ? (
          <li className="px-4 py-8 text-center">
            <Bell className="w-8 h-8 text-text-secondary mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-text-secondary">No notifications</p>
          </li>
        ) : (
          recent.map((notif) => (
            <li key={notif.id}>
              <button
                type="button"
                onClick={() => handleItemClick(notif)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 text-left",
                  "hover:bg-card transition-colors",
                  !notif.read && "bg-accent/5"
                )}
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center mt-0.5">
                  {getNotifIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm leading-snug",
                      notif.read ? "text-text-secondary" : "text-text-primary font-semibold"
                    )}
                  >
                    {notif.title}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                  <p className="text-[11px] text-text-secondary mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {/* Unread dot */}
                {!notif.read && (
                  <div
                    className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5"
                    aria-label="Unread"
                  />
                )}
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3">
        <button
          type="button"
          onClick={() => {
            onClose();
            router.push("/admin/notifications");
          }}
          className="text-sm text-accent hover:text-accent/80 transition-colors font-medium"
        >
          View all notifications →
        </button>
      </div>
    </div>
  );
}
