"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Profondeur douce au défilement : l’élément glisse (y) et s’estompe pendant qu’il sort par le haut.
 * Seuls transform et opacity bougent. En mouvement réduit, l’élément reste immobile.
 */
export function Parallax({ children, className = "", y = [0, -60], opacity = [1, 1] }: { children?: ReactNode; className?: string; y?: [number, number]; opacity?: [number, number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ty = useTransform(scrollYProgress, [0, 1], y);
  const op = useTransform(scrollYProgress, [0, 1], opacity);
  return (
    <motion.div ref={ref} className={className} style={reduced ? undefined : { y: ty, opacity: op }}>
      {children}
    </motion.div>
  );
}
