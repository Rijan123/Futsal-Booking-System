"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { AnnouncementModal } from "@/components/public/AnnouncementModal";
import { CourtCard } from "@/components/public/CourtCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { DEMO_COURTS } from "@/data/courts";
import { getItem, STORAGE_KEYS } from "@/lib/storage";
import type { Court } from "@/types";

type TypeFilter = "all" | "5-a-side" | "7-a-side" | "indoor" | "outdoor";
type StatusFilter = "all" | "available" | "maintenance";

export default function CourtsPage() {
  const router = useRouter();
  const [courts, setCourts] = useState<Court[]>(DEMO_COURTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    const stored = getItem<Court[]>(STORAGE_KEYS.COURTS, DEMO_COURTS);
    if (stored.length > 0) setCourts(stored);
  }, []);

  const filtered = useMemo(() => {
    return courts.filter((court) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        court.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || court.type === typeFilter;
      const matchesStatus = statusFilter === "all" || court.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [courts, searchQuery, typeFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementModal />
      {/* Page header */}
      <div className="bg-sidebar border-b border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">Our Courts</h1>
          <p className="text-text-secondary text-base">
            {courts.length} premium futsal courts in Kathmandu — choose your perfect venue.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search courts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-text-secondary flex-shrink-0" aria-hidden="true" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent appearance-none pr-8"
              aria-label="Filter by type"
            >
              <option value="all">All Types</option>
              <option value="5-a-side">5-a-side</option>
              <option value="7-a-side">7-a-side</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent appearance-none pr-8"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        {filtered.length > 0 && (
          <p className="text-text-secondary text-sm mb-5">
            Showing {filtered.length} court{filtered.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((court) => (
              <CourtCard
                key={court.id}
                court={court}
                onViewDetails={(c) => router.push(`/courts/${c.id}`)}
                onBookNow={(c) => router.push(`/book?courtId=${c.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No courts found"
            description="Try adjusting your filters or search query to find available courts."
            action={{
              label: "Clear filters",
              onClick: () => {
                setSearchQuery("");
                setTypeFilter("all");
                setStatusFilter("all");
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
