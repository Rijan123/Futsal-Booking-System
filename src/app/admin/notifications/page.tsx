"use client";

import React, { useEffect, useState } from "react";
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
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "@/lib/notificationStore";
import type { Notification } from "@/types";

type FilterTab = "all" | "unread" | "read";

function getNotifIcon(type: string): React.ReactNode {
  const cls = "w-5 h-5";
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

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  function reload() {
    setNotifications(getNotifications());
  }

  useEffect(() => {
    reload();
    window.addEventListener("notifications-updated", reload);
    return () => window.removeEventListener("notifications-updated", reload);
  }, []);

  const filtered = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "read") return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "read", label: "Read" },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Notification Center"
        description="System notifications and alerts"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="w-4 h-4" aria-hidden="true" />
            Mark All Read
          </Button>
        }
      />

      {/* Demo note */}
      <p className="text-xs text-text-secondary/60 mb-6 italic">
        Notifications are simulated for prototype purposes. Real-time notifications
        require a backend.
      </p>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2",
              activeTab === tab.key
                ? "text-accent border-accent"
                : "text-text-secondary border-transparent hover:text-text-primary"
            )}
            aria-current={activeTab === tab.key ? "page" : undefined}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-1.5 px-1.5 py-0.5 rounded-full text-[11px]",
                  activeTab === tab.key
                    ? "bg-accent/20 text-accent"
                    : "bg-elevated text-text-secondary"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description={
            activeTab === "unread"
              ? "You're all caught up — no unread notifications."
              : activeTab === "read"
              ? "No read notifications yet."
              : "No notifications to show."
          }
        />
      ) : (
        <ul className="space-y-3" role="list">
          {filtered.map((notif) => (
            <li
              key={notif.id}
              className={cn(
                "bg-card border border-border rounded-xl p-4 flex items-start gap-4",
                !notif.read && "border-accent/30 bg-accent/5"
              )}
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-elevated border border-border flex items-center justify-center mt-0.5">
                {getNotifIcon(notif.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p
                    className={cn(
                      "text-sm",
                      notif.read
                        ? "text-text-primary"
                        : "text-text-primary font-semibold"
                    )}
                  >
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span
                      className="w-2 h-2 rounded-full bg-accent flex-shrink-0"
                      aria-label="Unread"
                    />
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-1">{notif.message}</p>
                <p className="text-xs text-text-secondary/70">
                  {formatDistanceToNow(new Date(notif.createdAt), {
                    addSuffix: true,
                  })}
                  {" · "}
                  <span
                    className={cn(
                      "capitalize",
                      notif.read ? "text-text-secondary/60" : "text-accent"
                    )}
                    role="status"
                    aria-label={notif.read ? "Read" : "Unread"}
                  >
                    {notif.read ? "Read" : "Unread"}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!notif.read && (
                  <button
                    type="button"
                    onClick={() => markAsRead(notif.id)}
                    className="p-1.5 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-colors"
                    aria-label={`Mark "${notif.title}" as read`}
                    title="Mark as read"
                  >
                    <CheckCheck className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteNotification(notif.id)}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-cancelled hover:bg-cancelled/10 transition-colors"
                  aria-label={`Delete notification "${notif.title}"`}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
