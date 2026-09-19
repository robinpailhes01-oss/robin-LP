"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const appear = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};
const t = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

function useAppear() {
  const reduced = useReducedMotion();
  return reduced ? { initial: false as const, animate: appear.animate } : { ...appear, transition: t };
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`w-full max-w-[420px] rounded-[20px] bg-white border border-line p-4 sm:p-5 flex flex-col gap-3 shadow-[0_24px_60px_-40px_rgba(17,18,20,0.25)] ${className}`}
    >
      {children}
    </div>
  );
}

export function Timestamp({ children }: { children: ReactNode }) {
  const a = useAppear();
  return (
    <motion.p {...a} className="text-center text-[12px] text-muted tabular-nums">
      {children}
    </motion.p>
  );
}

export function ClientBubble({ children }: { children: ReactNode }) {
  const a = useAppear();
  return (
    <motion.div {...a} className="self-start max-w-[85%] rounded-[16px] rounded-bl-[6px] bg-card border border-line px-4 py-2.5 text-[15px] leading-[1.4] text-navy">
      {children}
    </motion.div>
  );
}

export function LumaBubble({ children }: { children: ReactNode }) {
  const a = useAppear();
  return (
    <motion.div {...a} className="self-end max-w-[85%] rounded-[16px] rounded-br-[6px] bg-navy px-4 py-2.5 text-[15px] leading-[1.4] text-white">
      {children}
    </motion.div>
  );
}

export function Typing() {
  const a = useAppear();
  return (
    <motion.div {...a} className="self-end rounded-[16px] rounded-br-[6px] bg-navy px-4 py-3 flex gap-1.5" aria-label="Luma écrit">
      <span className="typing-dot block size-1.5 rounded-full bg-white" />
      <span className="typing-dot block size-1.5 rounded-full bg-white" />
      <span className="typing-dot block size-1.5 rounded-full bg-white" />
    </motion.div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  const a = useAppear();
  return (
    <motion.span {...a} className="self-start -mt-1 inline-flex items-center gap-1.5 rounded-full border border-violet/40 px-2.5 h-6 text-[12px] font-medium text-violet">
      <span className="size-1.5 rounded-full bg-violet" />
      {children}
    </motion.span>
  );
}

export function Action({ children }: { children: ReactNode }) {
  const a = useAppear();
  return (
    <motion.p {...a} className="flex items-center gap-2 text-[13px] text-muted pl-1">
      <span className="size-1.5 rounded-full bg-violet" aria-hidden />
      {children}
    </motion.p>
  );
}

export function Treated({ children }: { children: ReactNode }) {
  const a = useAppear();
  return (
    <motion.p {...a} className="self-center mt-1 inline-flex items-center gap-2 rounded-full bg-violet px-3.5 h-8 text-[13px] font-medium text-white">
      {children}
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.p>
  );
}
