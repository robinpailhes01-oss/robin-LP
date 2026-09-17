"use client";

import { Button } from "@/components/ui/Button";
import { useContact } from "./ContactContext";
import { cta } from "@/lib/content";

export function OpenContactButton({ className = "" }: { className?: string }) {
  const { openContact } = useContact();
  return (
    <Button onClick={openContact} className={className}>
      {cta.primary}
    </Button>
  );
}
