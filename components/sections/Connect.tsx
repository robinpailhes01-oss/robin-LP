"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ToolIcon } from "@/components/ui/ToolIcons";
import { useMedia } from "@/lib/useMedia";
import { connect } from "@/lib/content";

type Pt = { x: number; y: number };
type Layout = { w: number; h: number; center: Pt; mascot: number; tile: number; tools: Pt[] };

/** Coordonnées de la scène, en unités du viewBox. */
const DESKTOP: Layout = {
  w: 1000,
  h: 640,
  center: { x: 500, y: 405 },
  mascot: 250,
  tile: 72,
  tools: [
    { x: 300, y: 178 }, // Notion
    { x: 500, y: 125 }, // WhatsApp
    { x: 712, y: 192 }, // HubSpot
    { x: 190, y: 335 }, // Google Calendar
    { x: 822, y: 340 }, // Airbnb
    { x: 262, y: 528 }, // Gmail
    { x: 742, y: 532 }, // Stripe
  ],
};
const MOBILE: Layout = {
  w: 390,
  h: 560,
  center: { x: 195, y: 305 },
  mascot: 170,
  tile: 56,
  tools: [
    { x: 122, y: 150 },
    { x: 232, y: 82 },
    { x: 322, y: 160 },
    { x: 52, y: 280 },
    { x: 338, y: 290 },
    { x: 92, y: 448 },
    { x: 300, y: 456 },
  ],
};

const ease = [0.22, 1, 0.36, 1] as const;
const START = 0.14;
const STEP = 0.085;
const SPAN = 0.12;

/**
 * Deuxième temps fort épinglé : la mascotte seule sur fond clair, puis les outils
 * apparaissent et se relient à elle au rythme du scroll. Sur mobile et en animations
 * réduites, apparition échelonnée à l’entrée dans l’écran, sans épinglage.
 */
export function Connect() {
  const reduced = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)");
  const pinned = desktop && !reduced;
  const layout = desktop ? DESKTOP : MOBILE;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const annotationO = useTransform(scrollYProgress, [0.02, 0.12, 1], [0, 1, 1]);
  const cardO = useTransform(scrollYProgress, [0.8, 0.92, 1], [0, 1, 1]);
  const cardY = useTransform(scrollYProgress, [0.8, 0.92, 1], [16, 0, 0]);

  const stage = (
    <div
      className="relative mx-auto rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#f6f7fd_100%)] overflow-visible"
      style={{ aspectRatio: `${layout.w} / ${layout.h}`, width: desktop ? "min(1000px, 100%, (100vh - 150px) * 1.5625)" : "100%" }}
    >
      <h2 className="sr-only">{connect.title}</h2>

      {/* Lignes de connexion */}
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${layout.w} ${layout.h}`} fill="none" aria-hidden>
        {layout.tools.map((t, i) => (
          <Line key={`${pinned ? "p" : "s"}-${i}`} from={layout.center} to={t} index={i} progress={scrollYProgress} pinned={pinned} reduced={!!reduced} />
        ))}
      </svg>

      {/* Mascotte */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${(layout.center.x / layout.w) * 100}%`, top: `${(layout.center.y / layout.h) * 100}%`, width: `${(layout.mascot / layout.w) * 100}%` }}
      >
        <Image
          src="/images/mascotte.png"
          alt="La mascotte Luma, reliée à vos outils"
          width={480}
          height={330}
          sizes="(max-width: 767px) 45vw, 260px"
          className="w-full h-auto [mask-image:radial-gradient(ellipse_at_center,black_62%,transparent_82%)]"
        />
      </div>

      {/* Outils */}
      {layout.tools.map((t, i) => (
        <Tool key={`${pinned ? "p" : "s"}-${connect.tools[i]}`} name={connect.tools[i]} at={t} layout={layout} index={i} progress={scrollYProgress} pinned={pinned} reduced={!!reduced} />
      ))}

      {/* Annotation manuscrite */}
      <motion.p
        style={pinned ? { opacity: annotationO } : undefined}
        className="absolute left-[4%] top-[4%] md:left-[8%] md:top-[9%] text-[19px] md:text-[28px] leading-[1] text-navy rotate-[-8deg] whitespace-nowrap"
        aria-hidden
      >
        <span style={{ fontFamily: "var(--font-hand)" }}>{connect.annotation}</span>
        <svg className="absolute left-4 top-7 md:left-8 md:top-11" width="34" height="40" viewBox="0 0 34 40" fill="none" aria-hidden>
          <path d="M6 4c6 12 12 20 24 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 34l10 0-1-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.p>

      {/* Notification WhatsApp */}
      <motion.div
        style={pinned ? { opacity: cardO, y: cardY } : undefined}
        initial={pinned || reduced ? false : { opacity: 0, y: 16 }}
        whileInView={pinned ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 1.2, ease }}
        className="hidden sm:flex absolute left-[54%] top-[1%] items-center gap-3 rounded-2xl bg-white border border-line px-4 py-3 shadow-[0_20px_40px_-24px_rgba(18,16,43,0.35)] min-w-[280px]"
        aria-label={connect.notification.title}
      >
        <ToolIcon name="WhatsApp" size={26} />
        <div className="flex-1">
          <p className="text-[13px] font-semibold leading-tight">{connect.notification.title}</p>
          <p className="text-[12px] text-body leading-tight mt-0.5">{connect.notification.text}</p>
        </div>
        <span className="text-[10px] text-muted self-start">{connect.notification.time}</span>
      </motion.div>
    </div>
  );

  if (!pinned) {
    return (
      <section ref={ref} id="outils" className="py-16 md:py-24 scroll-mt-20">
        <div className="mx-auto max-w-luma px-6">{stage}</div>
      </section>
    );
  }

  return (
    <section ref={ref} id="outils" className="relative h-[240vh] scroll-mt-20">
      <div className="sticky top-0 h-screen flex items-center">
        <div className="mx-auto max-w-luma px-6 w-full">{stage}</div>
      </div>
    </section>
  );
}

function window_(i: number): [number, number] {
  const s = START + i * STEP;
  return [s, s + SPAN];
}

function Line({ from, to, index, progress, pinned, reduced }: { from: Pt; to: Pt; index: number; progress: MotionValue<number>; pinned: boolean; reduced: boolean }) {
  const [s, e] = window_(index);
  const pathLength = useTransform(progress, [s - 0.05, e - 0.02, 1], [0, 1, 1]);
  const opacity = useTransform(progress, [s - 0.05, s, 1], [0, 1, 1]);
  // Courbe légère : point de contrôle décalé perpendiculairement au segment.
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const k = 28 * (index % 2 === 0 ? 1 : -1);
  const cx = mx + (-dy / len) * k;
  const cy = my + (dx / len) * k;
  const d = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  const common = { d, stroke: "#c9c4ff", strokeWidth: 2, strokeLinecap: "round" as const };
  if (pinned) return <motion.path {...common} style={{ pathLength, opacity }} />;
  if (reduced) return <path {...common} />;
  return (
    <motion.path
      {...common}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: 0.3 + index * 0.15, ease }}
    />
  );
}

function Tool({ name, at, layout, index, progress, pinned, reduced }: { name: string; at: Pt; layout: Layout; index: number; progress: MotionValue<number>; pinned: boolean; reduced: boolean }) {
  const [s, e] = window_(index);
  const opacity = useTransform(progress, [s, e, 1], [0, 1, 1]);
  const scale = useTransform(progress, [s, e, 1], [0.6, 1, 1]);
  const style = {
    left: `${(at.x / layout.w) * 100}%`,
    top: `${(at.y / layout.h) * 100}%`,
    width: `${(layout.tile / layout.w) * 100}%`,
  };
  const inner = (
    <>
      <span className="flex aspect-square w-full items-center justify-center rounded-[22%] bg-white border border-line shadow-[0_18px_36px_-22px_rgba(18,16,43,0.45)]">
        <ToolIcon name={name} size={layout.tile * 0.46} />
      </span>
      <span className="mt-2 block text-center text-[11px] md:text-[13px] font-medium text-navy whitespace-nowrap">{name}</span>
    </>
  );
  const cls = "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center";
  if (pinned) {
    return (
      <motion.div className={cls} style={{ ...style, opacity, scale }}>
        {inner}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={cls}
      style={style}
      initial={reduced ? false : { opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.35 + index * 0.15, ease }}
    >
      {inner}
    </motion.div>
  );
}
