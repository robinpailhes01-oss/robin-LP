"use client";

import { Arrow, Button } from "@/components/ui/Button";
import { useContact } from "./ContactContext";
import { booking, cta } from "@/lib/content";

/**
 * « Réserver un appel » : ouvre le lien de prise de rendez-vous s’il est renseigné (booking.url),
 * sinon l’assistant, qui recueille un numéro pour que Robin rappelle.
 */
export function BookingButton({ className = "", variant = "secondary", label = cta.call }: { className?: string; variant?: "primary" | "secondary" | "onDark"; label?: string }) {
  const { openContact } = useContact();
  if (booking.url) {
    const base = "group inline-flex items-center justify-center gap-2 rounded-full px-6 min-h-12 text-[15px] font-semibold whitespace-nowrap transition-[background-color,color,border-color] duration-200";
    const tone = variant === "primary" ? "bg-night text-white hover:bg-night-hover" : variant === "onDark" ? "bg-white text-night hover:bg-mist" : "bg-white text-night border border-powder hover:border-night/40 hover:bg-paper";
    return (
      <a href={booking.url} target="_blank" rel="noopener noreferrer" className={`${base} ${tone} ${className}`}>
        {label}
        <Arrow />
      </a>
    );
  }
  return (
    <Button onClick={openContact} className={className} variant={variant} aria-haspopup="dialog">
      {label}
      <Arrow />
    </Button>
  );
}
