"use client";

/* Adapté de l’Accordion de motion-primitives (ibelick, 21st.dev), porté sur motion/react. */

import { AnimatePresence, motion, MotionConfig, type Transition } from "motion/react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Ctx = { expanded: string | null; toggle: (v: string) => void };
const AccordionContext = createContext<Ctx | null>(null);
const ItemContext = createContext<string>("");

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem doit être dans un Accordion");
  return ctx;
}

const spring: Transition = { type: "spring", stiffness: 260, damping: 30 };

export function Accordion({ children, className, defaultValue = null }: { children: ReactNode; className?: string; defaultValue?: string | null }) {
  const [expanded, setExpanded] = useState<string | null>(defaultValue);
  const toggle = (v: string) => setExpanded((cur) => (cur === v ? null : v));
  return (
    <MotionConfig transition={spring}>
      <div className={cn("relative", className)}>
        <AccordionContext.Provider value={{ expanded, toggle }}>{children}</AccordionContext.Provider>
      </div>
    </MotionConfig>
  );
}

export function AccordionItem({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { expanded } = useAccordion();
  return (
    <ItemContext.Provider value={value}>
      <div className={cn("overflow-hidden", className)} data-expanded={expanded === value ? "" : undefined}>
        {children}
      </div>
    </ItemContext.Provider>
  );
}

export function AccordionTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const { expanded, toggle } = useAccordion();
  const value = useContext(ItemContext);
  const open = expanded === value;
  return (
    <button type="button" onClick={() => toggle(value)} aria-expanded={open} className={cn("group w-full text-left", className)} data-expanded={open ? "" : undefined}>
      {children}
    </button>
  );
}

export function AccordionContent({ children, className }: { children: ReactNode; className?: string }) {
  const { expanded } = useAccordion();
  const value = useContext(ItemContext);
  return (
    <AnimatePresence initial={false}>
      {expanded === value && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
