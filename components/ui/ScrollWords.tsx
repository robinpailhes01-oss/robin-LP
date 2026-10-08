"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Mots appuyés : blanc sur bleu nuit (le soulignement d’accent est réservé au titre d’accueil). */
const STRONG = "rounded-[0.18em] bg-night px-[0.14em] text-white";

/**
 * Manifeste révélé au défilement : la section reste fixe à l’écran et chaque mot s’allume
 * à mesure que l’on descend. Les mots précédés de * sont appuyés.
 * Sans JavaScript, avant hydratation ou avec « réduire les animations » : texte complet, statique.
 */
export function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const words = text.split(" ").map((w) => ({ strong: w.startsWith("*"), word: w.replace(/^\*/, "") }));
  const animate = ready && !reduced;
  const plain = words.map((w) => w.word).join(" ");

  return (
    <div ref={ref} className={animate ? "relative h-[240vh]" : "relative"}>
      <div className={animate ? "sticky top-0 flex h-[100dvh] items-center" : "flex items-center py-24 md:py-32"}>
        <p className="sr-only">{plain}</p>
        <p aria-hidden className="mx-auto max-w-[24ch] text-center font-display text-[clamp(1.9rem,1rem+3.6vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-night">
          {words.map((w, i) => {
            const start = (i / words.length) * 0.8;
            const end = start + 0.8 / words.length + 0.05;
            return (
              <span key={i}>
                {animate ? <Word progress={scrollYProgress} range={[start, end]} strong={w.strong}>{w.word}</Word> : <span className={w.strong ? STRONG : ""}>{w.word}</span>}
                {i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}

function Word({ children, progress, range, strong }: { children: string; progress: MotionValue<number>; range: [number, number]; strong: boolean }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${strong ? STRONG : ""}`}>
      {children}
    </motion.span>
  );
}
