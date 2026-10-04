"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Avatar } from "./ContactPanel";
import { useContact } from "./ContactContext";
import { Arrow } from "@/components/ui/Button";
import { nudge } from "@/lib/audit";

const KEY = "luma-nudge-seen";

/** Invitation discrète de Robin, quelques secondes après l’arrivée, une fois par session. */
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
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-30 bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[452px]"
        >
          <div className="relative rounded-[20px] bg-white border border-line shadow-[0_18px_40px_-28px_rgba(23,38,61,0.45)] p-4 pl-5 pr-11">
            <button type="button" onClick={dismiss} aria-label="Fermer" className="absolute top-2 right-2 size-11 inline-flex items-center justify-center rounded-full text-muted hover:bg-mist hover:text-night">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <div className="flex items-start gap-3">
              <Avatar size={56} />
              <div>
                <p className="font-display text-[16px] font-bold leading-tight text-night">{nudge.title}</p>
                <p className="text-[14px] text-ink mt-1.5 leading-[1.5]">{nudge.text}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      dismiss();
                      openContact();
                    }}
                    aria-haspopup="dialog"
                    className="group inline-flex items-center gap-2 min-h-11 rounded-full bg-night text-white px-4 text-[14px] font-semibold whitespace-nowrap hover:bg-night-hover transition-colors"
                  >
                    {nudge.cta}
                    <Arrow />
                  </button>
                  <button type="button" onClick={dismiss} className="min-h-11 px-1 text-[14px] font-medium text-muted hover:text-night whitespace-nowrap">
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
