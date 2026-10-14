import React from "react";
import { Search, CalendarDays, ClipboardList, Trophy } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Search,
    title: "Choose Court",
    description:
      "Browse our premium courts and pick the one that suits your team's size and preference.",
  },
  {
    number: 2,
    icon: CalendarDays,
    title: "Pick Date & Time",
    description:
      "Select a date and an available time slot. See real-time availability at a glance.",
  },
  {
    number: 3,
    icon: ClipboardList,
    title: "Enter Details",
    description:
      "Fill in your name and contact details. It only takes a minute to complete your booking.",
  },
  {
    number: 4,
    icon: Trophy,
    title: "Confirm & Play",
    description:
      "Review your booking, confirm it, and get your booking reference. See you on the court!",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-sidebar" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto text-base">
            Booking a court at FutsalPro is quick and easy — just four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop connecting line */}
          <div
            className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-border"
            style={{ top: "2.5rem" }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <div
                key={number}
                className="relative flex flex-col items-center text-center lg:items-center"
              >
                {/* Number circle */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-background border-2 border-border flex flex-col items-center justify-center mb-5">
                  <span className="text-accent font-bold text-xl leading-none">{number}</span>
                  <Icon className="h-5 w-5 text-accent mt-1" aria-hidden="true" />
                </div>
                <h3 className="text-text-primary font-semibold text-base mb-2">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-[220px]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
