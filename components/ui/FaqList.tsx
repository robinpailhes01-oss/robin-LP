"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";

/** Liste de questions-réponses, en accordéon. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Accordion className="border-t border-line">
      {items.map((f) => (
        <AccordionItem key={f.q} value={f.q} className="border-b border-line">
          <AccordionTrigger className="flex w-full items-center justify-between gap-6 py-5 min-h-16 text-left text-[17px] md:text-[18px] font-semibold tracking-[-0.01em] text-night">
            {f.q}
            <span aria-hidden className="shrink-0 size-8 inline-flex items-center justify-center rounded-full border border-powder text-night transition-[transform,background-color,color] duration-200 ease-[var(--ease-luma)] group-data-[expanded]:rotate-45 group-data-[expanded]:bg-night group-data-[expanded]:text-white group-data-[expanded]:border-night">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="t-body pb-6 max-w-[600px]">{f.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
