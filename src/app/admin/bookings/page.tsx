"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, Eye, Pencil, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { BookingStatusBadge } from "@/components/ui/BookingStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import { DEMO_BOOKINGS } from "@/data/bookings";
import { DEMO_COURTS } from "@/data/courts";
import { formatCurrency, formatTime } from "@/lib/utils";
import type { Booking } from "@/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [courtFilter, setCourtFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const stored = getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, DEMO_BOOKINGS);
    setBookings(stored);
  }, []);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !b.customerName.toLowerCase().includes(q) &&
          !b.courtName.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (dateFrom && b.date < dateFrom) return false;
      if (dateTo && b.date > dateTo) return false;
      if (courtFilter !== "all" && b.courtId !== courtFilter) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      return true;
    });
  }, [bookings, search, dateFrom, dateTo, courtFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, dateFrom, dateTo, courtFilter, statusFilter]);

  const handleCancel = () => {
    if (!cancelTarget) return;
    setCancelling(true);
    const updated = bookings.map((b) =>
      b.id === cancelTarget.id ? { ...b, status: "cancelled" as const } : b
    );
    setItem(STORAGE_KEYS.BOOKINGS, updated);
    setBookings(updated);
    setCancelling(false);
    setCancelTarget(null);
  };

  const paymentVariant = (status: Booking["paymentStatus"]) => {
    if (status === "paid") return "confirmed";
    if (status === "partial") return "pending";
    return "cancelled";
  };

  const paymentLabel = (status: Booking["paymentStatus"]) => {
    if (status === "paid") return "Paid";
    if (status === "partial") return "Partial";
    return "Unpaid";
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Bookings"
        description="Manage all court bookings"
        action={
          <Link href="/book">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4" aria-hidden="true" />
              New Booking
            </Button>
          </Link>
        }
      />

      {/* Toolbar */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search by customer or court…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-elevated border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label="Search bookings"
            />
          </div>

          {/* Date from */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="date-from"
              className="text-xs text-text-secondary whitespace-nowrap"
            >
              From
            </label>
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent [color-scheme:dark]"
            />
          </div>

          {/* Date to */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="date-to"
              className="text-xs text-text-secondary whitespace-nowrap"
            >
              To
            </label>
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent [color-scheme:dark]"
            />
          </div>

          {/* Court filter */}
          <select
            value={courtFilter}
            onChange={(e) => setCourtFilter(e.target.value)}
            className="text-sm bg-elevated border border-border rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Filter by court"
          >
            <option value="all">All Courts</option>
            {DEMO_COURTS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm bg-elevated border border-border rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table (desktop) / Cards (mobile) */}
      {pageItems.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No bookings found"
          description="Try adjusting your search or filter criteria."
          action={
            search || dateFrom || dateTo || courtFilter !== "all" || statusFilter !== "all"
              ? {
                  label: "Clear filters",
                  onClick: () => {
                    setSearch("");
                    setDateFrom("");
                    setDateTo("");
                    setCourtFilter("all");
                    setStatusFilter("all");
                  },
                }
              : undefined
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-elevated/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">#</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">Customer</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">Court</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">Time</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">Duration</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">Price</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">Payment</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pageItems.map((b, idx) => (
                    <tr
                      key={b.id}
                      className="hover:bg-elevated/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-text-secondary text-xs">
                        {(safePage - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-text-primary">{b.customerName}</p>
                          <p className="text-xs text-text-secondary">{b.customerPhone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{b.courtName}</td>
                      <td className="px-4 py-3 text-text-secondary">{b.date}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {formatTime(b.startTime)} – {formatTime(b.endTime)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{b.duration}h</td>
                      <td className="px-4 py-3 text-text-primary font-medium">
                        {formatCurrency(b.totalPrice)}
                      </td>
                      <td className="px-4 py-3">
                        <BookingStatusBadge status={b.status} />
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={paymentVariant(b.paymentStatus)}
                          label={paymentLabel(b.paymentStatus)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            title="View booking"
                            className="p-1.5 rounded-md text-text-secondary hover:text-accent hover:bg-elevated transition-colors"
                            aria-label={`View booking for ${b.customerName}`}
                          >
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            title="Edit booking"
                            className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
                            aria-label={`Edit booking for ${b.customerName}`}
                          >
                            <Pencil className="w-4 h-4" aria-hidden="true" />
                          </button>
                          {b.status !== "cancelled" && (
                            <button
                              type="button"
                              title="Cancel booking"
                              onClick={() => setCancelTarget(b)}
                              className="p-1.5 rounded-md text-text-secondary hover:text-cancelled hover:bg-cancelled/10 transition-colors"
                              aria-label={`Cancel booking for ${b.customerName}`}
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {pageItems.map((b) => (
              <div
                key={b.id}
                className="bg-card border border-border rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-text-primary">{b.customerName}</p>
                    <p className="text-xs text-text-secondary">{b.customerPhone}</p>
                  </div>
                  <BookingStatusBadge status={b.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
                  <div>
                    <span className="text-text-secondary/60">Court</span>
                    <p className="text-text-primary mt-0.5">{b.courtName}</p>
                  </div>
                  <div>
                    <span className="text-text-secondary/60">Date</span>
                    <p className="text-text-primary mt-0.5">{b.date}</p>
                  </div>
                  <div>
                    <span className="text-text-secondary/60">Time</span>
                    <p className="text-text-primary mt-0.5">
                      {formatTime(b.startTime)} – {formatTime(b.endTime)}
                    </p>
                  </div>
                  <div>
                    <span className="text-text-secondary/60">Price</span>
                    <p className="text-accent font-semibold mt-0.5">
                      {formatCurrency(b.totalPrice)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <Badge
                    variant={paymentVariant(b.paymentStatus)}
                    label={paymentLabel(b.paymentStatus)}
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="p-1.5 rounded-md text-text-secondary hover:text-accent hover:bg-elevated transition-colors"
                      aria-label={`View booking for ${b.customerName}`}
                    >
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
                      aria-label={`Edit booking for ${b.customerName}`}
                    >
                      <Pencil className="w-4 h-4" aria-hidden="true" />
                    </button>
                    {b.status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={() => setCancelTarget(b)}
                        className="p-1.5 rounded-md text-text-secondary hover:text-cancelled hover:bg-cancelled/10 transition-colors"
                        aria-label={`Cancel booking for ${b.customerName}`}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-text-secondary">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className={cn(
                  "p-2 rounded-lg border border-border text-text-secondary transition-colors",
                  safePage === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:text-text-primary hover:bg-elevated"
                )}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="text-sm text-text-primary font-medium">
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className={cn(
                  "p-2 rounded-lg border border-border text-text-secondary transition-colors",
                  safePage === totalPages
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:text-text-primary hover:bg-elevated"
                )}
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Cancel confirmation dialog */}
      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        description={
          cancelTarget
            ? `Are you sure you want to cancel the booking for ${cancelTarget.customerName} on ${cancelTarget.date}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Cancel Booking"
        confirmVariant="danger"
        loading={cancelling}
      />
    </div>
  );
}
