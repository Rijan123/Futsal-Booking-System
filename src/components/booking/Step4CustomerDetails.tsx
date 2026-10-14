import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

interface Step4Props {
  details: CustomerDetails;
  onChange: (details: CustomerDetails) => void;
  onValidate: (valid: boolean) => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-cancelled text-xs mt-1">{message}</p>;
}

export function Step4CustomerDetails({ details, onChange, onValidate }: Step4Props) {
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false,
  });

  const errors = {
    name: details.name.trim() === "" ? "Full name is required." : "",
    phone:
      details.phone.trim() === ""
        ? "Phone number is required."
        : !/^\+?[\d\s\-()]{7,}$/.test(details.phone)
        ? "Enter a valid phone number."
        : "",
    email:
      details.email.trim() !== "" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)
        ? "Enter a valid email address."
        : "",
  };

  const isValid = !errors.name && !errors.phone && !errors.email;

  // Propagate validation state upward on each change
  function handleChange<K extends keyof CustomerDetails>(key: K, value: CustomerDetails[K]) {
    const updated = { ...details, [key]: value };
    onChange(updated);

    const updatedErrors = {
      name: updated.name.trim() === "",
      phone:
        updated.phone.trim() === "" ||
        !/^\+?[\d\s\-()]{7,}$/.test(updated.phone),
      email:
        updated.email.trim() !== "" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updated.email),
    };
    onValidate(!updatedErrors.name && !updatedErrors.phone && !updatedErrors.email);
  }

  function handleBlur(key: keyof typeof touched) {
    setTouched((t) => ({ ...t, [key]: true }));
  }

  const inputClass = (error: string, isTouched: boolean) =>
    cn(
      "w-full bg-card border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none transition-colors",
      error && isTouched ? "border-cancelled focus:border-cancelled" : "border-border focus:border-accent"
    );

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">Your Details</h2>
      <p className="text-text-secondary text-sm mb-6">
        Enter your contact information to complete the booking.
      </p>

      <div className="space-y-5 max-w-lg">
        {/* Full name */}
        <div>
          <label htmlFor="customer-name" className="block text-text-primary text-sm font-medium mb-1.5">
            Full Name <span className="text-cancelled">*</span>
          </label>
          <input
            id="customer-name"
            type="text"
            value={details.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="e.g. Rajan Shrestha"
            className={inputClass(errors.name, touched.name)}
            aria-required="true"
            aria-describedby="name-error"
          />
          {touched.name && <FieldError message={errors.name} />}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="customer-phone" className="block text-text-primary text-sm font-medium mb-1.5">
            Phone Number <span className="text-cancelled">*</span>
          </label>
          <input
            id="customer-phone"
            type="tel"
            value={details.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            placeholder="e.g. +977-9841234567"
            className={inputClass(errors.phone, touched.phone)}
            aria-required="true"
            aria-describedby="phone-error"
          />
          {touched.phone && <FieldError message={errors.phone} />}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="customer-email" className="block text-text-primary text-sm font-medium mb-1.5">
            Email Address <span className="text-text-secondary font-normal">(optional)</span>
          </label>
          <input
            id="customer-email"
            type="email"
            value={details.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="e.g. rajan@gmail.com"
            className={inputClass(errors.email, touched.email)}
            aria-describedby="email-error"
          />
          {touched.email && <FieldError message={errors.email} />}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="customer-notes" className="block text-text-primary text-sm font-medium mb-1.5">
            Additional Notes <span className="text-text-secondary font-normal">(optional)</span>
          </label>
          <textarea
            id="customer-notes"
            value={details.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Any special requirements or notes..."
            rows={3}
            className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        {!isValid && (touched.name || touched.phone) && (
          <p className="text-text-secondary text-xs">
            Fields marked with <span className="text-cancelled">*</span> are required.
          </p>
        )}
      </div>
    </div>
  );
}
