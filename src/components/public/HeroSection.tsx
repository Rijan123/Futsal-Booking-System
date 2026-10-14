"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Users, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80";

const stats = [
  { icon: Trophy, value: "4 Premium Courts", label: "" },
  { icon: Clock, value: "Open 6AM–10PM", label: "" },
  { icon: Users, value: "1000+ Happy Players", label: "" },
];

export function HeroSection() {
  const today = new Date().toISOString().split("T")[0];
  const [searchDate, setSearchDate] = useState(today);
  const [searchTime, setSearchTime] = useState("08:00");

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Premium futsal court"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex flex-col items-center text-center">
        {/* Badge */}
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-sm font-medium mb-6">
          ✦ Premium Futsal Experience
        </span>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
          Book Your Court,
          <br />
          <span className="text-accent">Play Your Game</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg text-white/80 max-w-2xl mb-10 leading-relaxed">
          State-of-the-art futsal courts in the heart of Kathmandu. Book instantly, play confidently.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href="/book">
            <Button variant="primary" size="lg">
              Book a Court
            </Button>
          </Link>
          <Link href="/courts">
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/10"
            >
              Explore Courts
            </Button>
          </Link>
        </div>

        {/* Mini search bar */}
        <div className="w-full max-w-2xl bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="hero-date" className="sr-only">
              Select date
            </label>
            <input
              id="hero-date"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              min={today}
              className="w-full bg-transparent text-white placeholder-white/50 border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="hero-time" className="sr-only">
              Select time
            </label>
            <select
              id="hero-time"
              value={searchTime}
              onChange={(e) => setSearchTime(e.target.value)}
              className="w-full bg-black/60 text-white border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent appearance-none"
            >
              {Array.from({ length: 16 }, (_, i) => {
                const hour = 6 + i;
                const label = `${String(hour).padStart(2, "0")}:00`;
                return (
                  <option key={label} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
          <Link href={`/courts?date=${searchDate}&time=${searchTime}`}>
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              <Search className="h-4 w-4" />
              Find Courts
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative z-10 w-full bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
            {stats.map(({ icon: Icon, value }) => (
              <div key={value} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-accent" />
                <span className="text-white font-semibold text-sm sm:text-base">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
