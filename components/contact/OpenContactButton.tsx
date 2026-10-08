"use client";

import { Arrow, Button } from "@/components/ui/Button";
import { useContact } from "./ContactContext";
import { cta } from "@/lib/content";

/** Ouvre le panneau de l’assistant de Robin. */
export function OpenContactButton({ className = "", variant = "primary", label = cta.primary }: { className?: string; variant?: "primary" | "secondary" | "onDark"; label?: string }) {
  const { openContact } = useContact();
  return (
    <Button onClick={openContact} className={className} variant={variant} aria-haspopup="dialog">
      {label}
      <Arrow />
    </Button>
  );
}
