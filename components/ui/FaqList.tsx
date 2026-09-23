"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";

/** Liste de questions-réponses sur l’accordéon animé. */
export function FaqList({ items, iconBg = "bg-card" }: { items: { q: string; a: string }[]; iconBg?: string }) {
  return (
    <Accordion className="border-t border-line">
      {items.map((f) => (
        <AccordionItem key={f.q} value={f.q} className="border-b border-line transition-colors data-[expanded]:bg-violet-tint/40 data-[expanded]:-mx-4 data-[expanded]:px-4 data-[expanded]:rounded-xl data-[expanded]:border-transparent">
          <AccordionTrigger className="flex items-center justify-between gap-6 py-5 text-[17px] md:text-[18px] font-semibold tracking-[-0.01em]">
            {f.q}
            <span aria-hidden className={`shrink-0 size-8 inline-flex items-center justify-center rounded-full ${iconBg} text-navy transition-transform duration-300 ease-[var(--ease-luma)] group-data-[expanded]:rotate-45 group-data-[expanded]:bg-violet group-data-[expanded]:text-white`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="t-body pb-6 max-w-[560px]">{f.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
