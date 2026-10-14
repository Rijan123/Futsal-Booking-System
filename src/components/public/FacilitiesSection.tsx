import React from "react";
import { Zap, Users, Car, Coffee, Shield, Wifi } from "lucide-react";

const facilities = [
  {
    icon: Zap,
    title: "Professional LED Lighting",
    description:
      "Stadium-grade LED floodlights ensure perfect visibility for every game, day or night.",
  },
  {
    icon: Users,
    title: "Changing Rooms",
    description:
      "Spacious, clean changing rooms with secure lockers, showers, and full amenities.",
  },
  {
    icon: Car,
    title: "Free Parking",
    description:
      "Ample free parking space for all our players and visitors, right at the venue.",
  },
  {
    icon: Coffee,
    title: "Cafeteria & Lounge",
    description:
      "Grab a snack or relax in our comfortable lounge area before and after your game.",
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description:
      "CCTV monitoring and on-site security personnel keep you and your belongings safe.",
  },
  {
    icon: Wifi,
    title: "Free WiFi",
    description:
      "Stay connected with high-speed WiFi throughout the venue — ideal for live streaming.",
  },
];

export function FacilitiesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="facilities">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            World-Class Facilities
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto text-base">
            Every court is equipped with premium amenities to give you the best futsal experience in Kathmandu.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-4 p-6 bg-card border border-border rounded-xl hover:border-accent/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
                <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-text-primary font-semibold text-base mb-1">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
