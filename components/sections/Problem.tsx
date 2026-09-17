"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { problem } from "@/lib/content";
import { useMounted } from "@/lib/useMounted";

/** Seuils de progression : la cadence se resserre, l’écran se remplit un peu trop vite. */
const THRESHOLDS = [0.08, 0.17, 0.25, 0.32, 0.38, 0.43, 0.47];
const CALM_AT = 0.6;
const ease = [0.22, 1, 0.36, 1] as const;

export function Problem() {
  const mounted = useMounted();
  const reduced = useReducedMotion() === true && mounted;
  const ref = useRef<HTMLElement>(null);
  const [count, setCount] = useState(0);
  const [calm, setCalm] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = THRESHOLDS.filter((t) => v >= t).length;
    setCount((prev) => (prev === n ? prev : n));
    const c = v >= CALM_AT;
    setCalm((prev) => (prev === c ? prev : c));
  });

  if (reduced) {
    return (
      <section id="probleme" className="py-24 md:py-40">
        <div className="mx-auto max-w-luma px-6 grid gap-12 md:grid-cols-12">
          <h2 className="t-section md:col-span-5">{problem.title}</h2>
          <ul className="md:col-start-7 md:col-span-6 flex flex-col gap-2">
            {problem.items.map((it) => (
              <Notification key={it.kind} {...it} />
            ))}
          </ul>
          <p className="t-section md:col-span-12 mt-8 max-w-[900px]">
            {problem.conclusion[0]} <span className="text-muted">{problem.conclusion[1]}</span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="probleme" ref={ref} className="relative h-[220svh] md:h-[240vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="mx-auto max-w-luma px-6 h-full grid content-center gap-8 md:grid-cols-12 md:gap-6 pt-16">
          <motion.h2
            className="t-section md:col-span-5 self-center"
            animate={{ opacity: calm ? 0 : 1 }}
            transition={{ duration: 0.7, ease }}
          >
            {problem.title}
          </motion.h2>

          <motion.ul
            className="md:col-start-7 md:col-span-6 flex flex-col gap-2 self-start md:self-center md:min-h-[460px] justify-start md:justify-center"
            animate={{ opacity: calm ? 0 : 1 }}
            transition={{ duration: 0.7, ease }}
            aria-live="polite"
          >
            {problem.items.slice(0, count).map((it, i) => (
              <motion.li
                key={it.kind}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease }}
                style={{ zIndex: i }}
                className="list-none"
              >
                <Notification {...it} as="div" />
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
          initial={false}
          animate={{ opacity: calm ? 1 : 0, y: calm ? 0 : 16 }}
          transition={{ duration: 0.8, delay: calm ? 0.25 : 0, ease }}
          aria-hidden={!calm}
        >
          <p className="t-section text-center max-w-[900px]">
            {problem.conclusion[0]}
            <br />
            <span className="text-muted">{problem.conclusion[1]}</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Notification({ kind, text, as: Tag = "li" }: { kind: string; text: string; as?: "li" | "div" }) {
  return (
    <Tag className="rounded-[12px] bg-white/75 border border-surface-alt px-4 py-3 shadow-[0_12px_30px_-24px_rgba(17,18,20,0.35)]">
      <span className="t-kicker block mb-1">{kind}</span>
      <span className="block text-[15px] leading-[1.4]">{text}</span>
    </Tag>
  );
}
