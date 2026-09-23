"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useContact } from "./ContactContext";
import { Arrow } from "@/components/ui/Button";
import { nudge } from "@/lib/audit";

const KEY = "luma-nudge-seen";

/** Pop-up de la mascotte, quelques secondes après l’arrivée, une fois par session. */
export function AuditNudge() {
  const { open, openContact } = useContact();
  const reduced = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (seen) return;
    const t = setTimeout(() => setShow(true), nudge.delaySeconds * 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (open) dismiss();
  }, [open]);

  function dismiss() {
    setShow(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  }

  return (
    <AnimatePresence>
      {show && !open && (
        <motion.div
          role="dialog"
          aria-label={nudge.title}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-30 bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[380px]"
        >
          <div className="relative rounded-[22px] bg-white border border-line shadow-[0_30px_60px_-30px_rgba(18,16,43,0.45)] p-4 pl-5 pr-10">
            <button type="button" onClick={dismiss} aria-label="Fermer" className="absolute top-3 right-3 size-8 inline-flex items-center justify-center rounded-full text-muted hover:bg-card hover:text-navy">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <div className="flex items-start gap-3">
              <motion.span
                initial={reduced ? false : { x: -40, opacity: 0, rotate: -12 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-violet-tint border border-line overflow-hidden"
                aria-hidden
              >
                <Image src="/images/mascotte-avatar.png" alt="" width={112} height={112} className="h-full w-full object-cover" />
              </motion.span>
              <div>
                <p className="text-[15px] font-semibold leading-tight">{nudge.title}</p>
                <p className="text-[14px] text-body mt-1.5 leading-[1.45]">{nudge.text}</p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      dismiss();
                      openContact();
                    }}
                    className="inline-flex items-center gap-2 h-10 rounded-full bg-violet text-white px-4 text-[14px] font-semibold whitespace-nowrap hover:bg-violet-dark transition-colors"
                  >
                    {nudge.cta}
                    <Arrow />
                  </button>
                  <button type="button" onClick={dismiss} className="text-[13px] font-medium text-muted hover:text-navy whitespace-nowrap">
                    {nudge.dismiss}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
