import React from "react";
import Link from "next/link";
import { FileSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center text-center py-16">
        <div className="p-4 rounded-full bg-elevated border border-border mb-6">
          <FileSearch className="h-12 w-12 text-text-secondary" aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
        <h2 className="text-xl font-semibold text-text-primary mb-3">
          Page Not Found
        </h2>
        <p className="text-text-secondary text-sm max-w-xs mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-accent text-black font-semibold px-5 py-2.5 rounded-xl hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
