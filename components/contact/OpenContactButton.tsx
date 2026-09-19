"use client";

import { Arrow, Button } from "@/components/ui/Button";
import { useContact } from "./ContactContext";
import { cta } from "@/lib/content";

export function OpenContactButton({ className = "", variant = "primary" as const }: { className?: string; variant?: "primary" | "white" }) {
  const { openContact } = useContact();
  return (
    <Button onClick={openContact} className={className} variant={variant}>
      {cta.primary}
      <Arrow />
    </Button>
  );
}
