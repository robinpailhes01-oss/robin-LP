"use client";

import { motion, useReducedMotion } from "motion/react";
import { ToolIcon } from "@/components/ui/ToolIcons";

type Msg = { from: "client" | "agent"; text: string };

/** Carte d’exemple de conversation : les bulles apparaissent une à une à l’entrée dans l’écran. */
export function ConversationCard({ title, sector, time, messages, action }: { title: string; sector: string; time: string; messages: Msg[]; action: string }) {
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  return (
    <article className="h-full flex flex-col rounded-[22px] bg-white border border-line overflow-hidden transition-[transform,box-shadow] duration-300 ease-[var(--ease-luma)] hover:-translate-y-1 hover:shadow-[0_24px_40px_-30px_rgba(18,16,43,0.35)]">
      <header className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-line bg-card">
        <div className="flex items-center gap-2.5">
          <ToolIcon name="WhatsApp" size={22} />
          <div>
            <p className="text-[14px] font-semibold leading-tight">{title}</p>
            <p className="text-[12px] text-muted leading-tight">{sector}</p>
          </div>
        </div>
        <span className="text-[12px] text-muted tabular-nums">{time}</span>
      </header>
      <div className="flex-1 flex flex-col gap-2.5 px-5 py-5 bg-[linear-gradient(180deg,#fbfbfd_0%,#f6f6fb_100%)]">
        {messages.map((m, i) => (
          <motion.p
            key={i}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.15 + i * 0.22, ease }}
            className={
              m.from === "agent"
                ? "self-end max-w-[88%] rounded-[16px] rounded-br-[5px] bg-navy text-white px-3.5 py-2.5 text-[14px] leading-[1.45]"
                : "self-start max-w-[88%] rounded-[16px] rounded-bl-[5px] bg-white border border-line text-navy px-3.5 py-2.5 text-[14px] leading-[1.45]"
            }
          >
            {m.text}
          </motion.p>
        ))}
      </div>
      <footer className="flex items-center gap-2 px-5 py-3.5 border-t border-line text-[13px] font-medium text-violet">
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {action}
      </footer>
    </article>
  );
}
