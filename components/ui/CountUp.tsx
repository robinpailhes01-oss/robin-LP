"use client";

/* Adapté du composant « Count Up » de unlumen (21st.dev), réduit à l’effet odomètre. */

import * as React from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import useMeasure from "react-use-measure";
import { cn } from "@/lib/utils";

function OdometerDigit({ springValue, place }: { springValue: MotionValue<number>; place: number }) {
  const [ref, { height }] = useMeasure();
  const y = useTransform(springValue, (v) => (height ? -((Math.abs(v) / place) % 10) * height : 0));
  return (
    <span className="relative inline-block w-[1ch] overflow-y-clip overflow-x-visible leading-none tabular-nums">
      <span ref={ref} className="invisible block">0</span>
      <motion.span style={{ y }} className="absolute inset-x-0 top-0 flex flex-col">
        {Array.from({ length: 11 }, (_, i) => (
          <span key={i} className="flex items-center justify-center" style={{ height: height || "1em" }}>
            {i % 10}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function CountUp({ to, duration = 1.6, delay = 0, className }: { to: number; duration?: number; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 20 + 40 / duration, stiffness: 100 / duration });
  const inView = useInView(ref, { once: true, margin: "-40px" });

  React.useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => motionValue.set(to), reduced ? 0 : delay * 1000);
    return () => clearTimeout(t);
  }, [inView, to, delay, motionValue, reduced]);

  if (reduced) return <span className={className}>{to}</span>;

  const digits = String(Math.round(to)).length;
  return (
    <span ref={ref} className={cn("inline-flex items-center", className)}>
      {Array.from({ length: digits }, (_, i) => (
        <OdometerDigit key={i} springValue={springValue} place={Math.pow(10, digits - 1 - i)} />
      ))}
    </span>
  );
}

/** Anime le nombre en tête d’une valeur comme « 3 h », « 3 à 4 h » ou « 24h/24 », et garde le reste en suffixe. */
export function StatValue({ value, className }: { value: string; className?: string }) {
  const m = value.match(/^(\d+)(.*)$/);
  if (!m) return <span className={className}>{value}</span>;
  return (
    <span className={cn("inline-flex items-baseline whitespace-nowrap", className)}>
      <CountUp to={Number(m[1])} />
      <span className="whitespace-pre">{m[2]}</span>
    </span>
  );
}
