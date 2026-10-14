import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/courts", label: "Courts" },
  { href: "/book", label: "Book a Court" },
  { href: "#about", label: "About" },
];

export function PublicFooter() {
  return (
    <footer className="bg-sidebar border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-black font-bold text-sm"
                aria-hidden="true"
              >
                FP
              </span>
              <span className="text-text-primary font-semibold text-lg">FutsalPro</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Premium futsal courts in the heart of Kathmandu. Book instantly, play confidently.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-elevated hover:bg-card text-text-secondary hover:text-text-primary transition-colors text-xs font-medium"
                aria-label="Follow on Facebook"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-elevated hover:bg-card text-text-secondary hover:text-text-primary transition-colors text-xs font-medium"
                aria-label="Follow on Instagram"
              >
                Instagram
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-elevated hover:bg-card text-text-secondary hover:text-text-primary transition-colors text-xs font-medium"
                aria-label="Follow on Twitter"
              >
                Twitter
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-text-secondary text-sm">
                  Thamel, Kathmandu, Nepal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-text-secondary flex-shrink-0" />
                <a
                  href="tel:+97714567890"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  +977-1-4567890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-text-secondary flex-shrink-0" />
                <a
                  href="mailto:info@futsalpro.com.np"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  info@futsalpro.com.np
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-text-secondary text-xs text-center">
            &copy; 2026 FutsalPro. All rights reserved. Kathmandu, Nepal.
          </p>
        </div>
      </div>
    </footer>
  );
}
