"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Wrench, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { CourtEditDialog } from "@/components/admin/CourtEditDialog";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import { DEMO_COURTS } from "@/data/courts";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { Court } from "@/types";
import { MapPin } from "lucide-react";

function CourtManagementCard({
  court,
  onEdit,
  onToggleStatus,
}: {
  court: Court;
  onEdit: (court: Court) => void;
  onToggleStatus: (court: Court) => void;
}) {
  const isAvailable = court.status === "available";

  return (
    <Card className="flex flex-col">
      {/* Court image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
        {court.mainImage ? (
          <Image
            src={court.mainImage}
            alt={court.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-elevated flex items-center justify-center">
            <MapPin className="h-8 w-8 text-text-secondary" />
          </div>
        )}
        {/* Status overlay badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={court.status === "available" ? "available" : court.status === "maintenance" ? "maintenance" : "default"}>
            {court.status}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-col gap-3 flex-1">
        {/* Name + type */}
        <div>
          <h3 className="text-base font-semibold text-text-primary">{court.name}</h3>
          <p className="text-xs text-text-secondary mt-0.5">{court.type}</p>
        </div>

        {/* Price */}
        <p className="text-accent font-semibold text-sm">
          {formatCurrency(court.pricePerHour)}<span className="text-text-secondary font-normal"> / hr</span>
        </p>

        {/* Facilities chips */}
        {court.facilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {court.facilities.slice(0, 4).map((f) => (
              <span
                key={f}
                className="px-2 py-0.5 rounded-full bg-elevated border border-border text-xs text-text-secondary"
              >
                {f}
              </span>
            ))}
            {court.facilities.length > 4 && (
              <span className="px-2 py-0.5 rounded-full bg-elevated border border-border text-xs text-text-secondary">
                +{court.facilities.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(court)}
          >
            <Edit2 className="h-4 w-4" /> Edit
          </Button>
          <Button
            variant={isAvailable ? "outline" : "secondary"}
            size="sm"
            className="flex-1"
            onClick={() => onToggleStatus(court)}
          >
            {isAvailable ? (
              <><Wrench className="h-4 w-4" /> Maintenance</>
            ) : (
              <><CheckCircle className="h-4 w-4" /> Set Available</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminCourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  useEffect(() => {
    setCourts(getItem<Court[]>(STORAGE_KEYS.COURTS, DEMO_COURTS));
  }, []);

  function openAdd() {
    setEditingCourt(null);
    setDialogOpen(true);
  }

  function openEdit(court: Court) {
    setEditingCourt(court);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setEditingCourt(null);
  }

  function handleSaved(newCourts: Court[]) {
    setCourts(newCourts);
  }

  function handleToggleStatus(court: Court) {
    const newStatus: Court["status"] =
      court.status === "available" ? "maintenance" : "available";
    const updated = courts.map((c) =>
      c.id === court.id ? { ...c, status: newStatus } : c
    );
    setItem(STORAGE_KEYS.COURTS, updated);
    setCourts(updated);
    toast.success(
      "Status Updated",
      `${court.name} is now ${newStatus}.`
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Courts & Pricing"
        description="Manage your futsal courts, pricing, and availability."
        action={
          <Button variant="primary" size="md" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Court
          </Button>
        }
      />

      {courts.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No Courts Found"
          description="Add your first court to get started."
          action={{ label: "Add Court", onClick: openAdd }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courts.map((court) => (
            <CourtManagementCard
              key={court.id}
              court={court}
              onEdit={openEdit}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      <CourtEditDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        court={editingCourt}
        onSaved={handleSaved}
      />
    </div>
  );
}
