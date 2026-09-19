"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/** Ligne horizontale qui se trace au scroll, derrière les étapes de la méthode. */
export function ScrollLine({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div ref={ref} className="relative">
      <div aria-hidden className="pointer-events-none absolute left-0 right-0 -top-7 hidden lg:block h-[2px] rounded-full bg-line overflow-hidden">
        <motion.div className="h-full w-full rounded-full bg-violet origin-left" style={{ scaleX: reduced ? 1 : pathLength }} />
      </div>
      {children}
    </div>
  );
}

/** Mise à l’échelle douce à l’entrée : utilisée pour le CTA final, qui se pose et reste. */
export function ScaleIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, scale: 0.94, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
