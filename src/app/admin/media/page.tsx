"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { BrandingTab } from "@/components/admin/BrandingTab";
import { CourtImagesTab } from "@/components/admin/CourtImagesTab";
import { WebsiteImagesTab } from "@/components/admin/WebsiteImagesTab";
import { cn } from "@/lib/utils";

type TabId = "branding" | "court-images" | "website-images";

const TABS: { id: TabId; label: string }[] = [
  { id: "branding", label: "Branding" },
  { id: "court-images", label: "Court Images" },
  { id: "website-images", label: "Website Images" },
];

export default function AdminMediaPage() {
  const [activeTab, setActiveTab] = useState<TabId>("branding");

  return (
    <div className="p-6">
      <PageHeader
        title="Media & Appearance"
        description="Manage your branding, court images, and website visuals."
      />

      {/* Tab buttons */}
      <div className="flex gap-1 border-b border-border mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors",
              activeTab === tab.id
                ? "text-accent bg-accent/10 border-b-2 border-accent"
                : "text-text-secondary hover:text-text-primary hover:bg-elevated"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "branding" && <BrandingTab />}
        {activeTab === "court-images" && <CourtImagesTab />}
        {activeTab === "website-images" && <WebsiteImagesTab />}
      </div>
    </div>
  );
}
