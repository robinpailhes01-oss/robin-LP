"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type Ctx = { open: boolean; openContact: () => void; closeContact: () => void };

const ContactContext = createContext<Ctx | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openContact = useCallback(() => setOpen(true), []);
  const closeContact = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, openContact, closeContact }), [open, openContact, closeContact]);
  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}

export function useContact() {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error("useContact doit être utilisé sous ContactProvider");
  return ctx;
}
