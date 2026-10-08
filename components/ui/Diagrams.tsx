"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ToolIcon } from "./ToolIcons";
import { usePlay } from "./usePlay";
import { hero, problem, system } from "@/lib/content";

/**
 * Schémas de l’accueil : parcours d’une demande (hero), constat, système en étoile, aperçus d’offre.
 * Animations en CSS (classes fl-*, pb-*, sys-* dans globals.css), lancées quand le schéma est visible.
 * Sans JavaScript ou avec « réduire les animations », chaque schéma s’affiche à son état final.
 */

const vars = (v: Record<string, string | number>) => v as CSSProperties;

function Icon({ children, size = 20, className = "" }: { children: ReactNode; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      {children}
    </svg>
  );
}

const PATHS = {
  inbox: (
    <>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </>
  ),
  spark: <path d="M12 3l1.9 5.6 5.6 1.9-5.6 1.9L12 18l-1.9-5.6-5.6-1.9 5.6-1.9z" />,
  card: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="11" r="2.5" />
      <path d="M5.5 17c.6-1.8 2-2.7 3.5-2.7s2.9.9 3.5 2.7M15 10h3M15 14h3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18M9 15l2 2 4-4" />
    </>
  ),
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  site: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
};

/** Icône d’un canal : marque pour WhatsApp et email, pictogramme sobre pour le reste. */
function ChannelIcon({ name, size = 24 }: { name: string; size?: number }) {
  if (name === "WhatsApp" || name === "Gmail") return <ToolIcon name={name} size={size} />;
  const p = PATHS[name as keyof typeof PATHS];
  const tone = name === "instagram" ? "text-[#C13584]" : "text-night";
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full bg-mist ${tone}`} style={{ width: size, height: size }}>
      <Icon size={size * 0.6}>{p}</Icon>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Hero : parcours d’une demande client                             */
/* ------------------------------------------------------------------ */

const FLOW_ICONS = [PATHS.inbox, PATHS.spark, PATHS.card, PATHS.calendar];

export function HeroFlow() {
  const ref = usePlay<HTMLDivElement>(0.4);
  return (
    <div ref={ref} className="fl mx-auto mt-16 w-full max-w-[46rem] md:mt-20">
      <p className="t-kicker text-center">{hero.flowKicker}</p>
      <ol className="relative mt-6 grid grid-cols-4">
        <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-[22px] h-px bg-powder" />
        <span aria-hidden className="fl-fill absolute left-[12.5%] right-[12.5%] top-[21px] h-[3px] origin-left rounded-full bg-night" />
        {hero.flow.map((s, i) => (
          <li key={s} className="relative flex flex-col items-center px-1 text-center" style={vars({ "--i": i })}>
            <span className="fl-dot relative inline-flex size-11 items-center justify-center rounded-full border">
              <Icon>{FLOW_ICONS[i]}</Icon>
            </span>
            <span className="fl-txt mt-3 text-[13px] font-semibold leading-tight text-night sm:text-[14px]">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Constat : tout converge vers vous                                */
/* ------------------------------------------------------------------ */

function MessageCard({ m, i }: { m: (typeof problem.messages)[number]; i: number }) {
  return (
    <div className="pb-card flex h-16 items-center gap-3 rounded-2xl border border-line bg-white px-4 shadow-[0_12px_28px_-22px_rgba(23,38,61,0.55)]" style={vars({ "--i": i })}>
      <ChannelIcon name={m.icon} />
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold leading-tight text-night">{m.channel}</p>
        <p className="truncate text-[14px] leading-snug text-ink">{m.text}</p>
      </div>
      <span className="shrink-0 text-[12px] tabular-nums text-muted">{m.time}</span>
    </div>
  );
}

function YouNode() {
  return (
    <div className="flex flex-col items-center">
      <span className="inline-flex size-28 flex-col items-center justify-center gap-1 rounded-full bg-night text-white">
        <Icon size={30}>{PATHS.person}</Icon>
        <span className="text-[14px] font-semibold">{problem.you}</span>
      </span>
      <span className="pb-badge mt-4 inline-flex h-8 items-center whitespace-nowrap gap-2 rounded-full border border-line bg-white px-3.5 text-[13px] font-semibold text-night">
        <span className="pb-ping size-2 rounded-full bg-slate" aria-hidden />
        {problem.pending}
      </span>
    </div>
  );
}

// Géométrie fixe (px) du connecteur sur grand écran : 5 cartes de 64 px espacées de 12 px.
const PB_W = 220;
const PB_H = 5 * 64 + 4 * 12;
const pbPath = (i: number) => {
  const y = 32 + i * 76;
  const c = PB_H / 2;
  return `M0 ${y} C ${PB_W / 2} ${y}, ${PB_W / 2} ${c}, ${PB_W} ${c}`;
};

export function ProblemSchema() {
  const ref = usePlay<HTMLElement>();
  return (
    <figure ref={ref} className="pb mt-14 md:mt-16" role="img" aria-label={problem.alt}>
      {/* Grand écran : les messages convergent vers vous */}
      <div className="hidden items-center justify-center lg:flex">
        <div className="flex w-[400px] flex-col gap-3">
          {problem.messages.map((m, i) => (
            <MessageCard key={m.channel} m={m} i={i} />
          ))}
        </div>
        <div className="relative shrink-0" style={{ width: PB_W, height: PB_H }} aria-hidden>
          <svg width={PB_W} height={PB_H} className="absolute inset-0 overflow-visible">
            {problem.messages.map((m, i) => (
              <path key={m.channel} d={pbPath(i)} fill="none" stroke="var(--color-powder)" strokeWidth="1.5" />
            ))}
          </svg>
          {problem.messages.map((m, i) => (
            <i key={m.channel} className="pb-dot" style={vars({ offsetPath: `path("${pbPath(i)}")`, "--i": i })} />
          ))}
        </div>
        <div className="flex w-28 justify-center">
          <YouNode />
        </div>
      </div>
      {/* Mobile : pile de messages, puis vous */}
      <div className="lg:hidden">
        <div className="mx-auto flex max-w-[26rem] flex-col gap-2.5">
          {problem.messages.map((m, i) => (
            <MessageCard key={m.channel} m={m} i={i} />
          ))}
        </div>
        <span aria-hidden className="mx-auto my-4 block h-10 w-px bg-powder" />
        <YouNode />
      </div>
      <p className="mt-6 text-center text-[12px] text-muted">{problem.note}</p>
      <figcaption className="t-lead mx-auto mt-6 max-w-[36rem] text-center">{problem.caption}</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Système : votre outil au centre                                  */
/* ------------------------------------------------------------------ */

type NodeId = keyof typeof system.nodes;

function Sheet({ r }: { r: number }) {
  return (
    <span className="flex h-[68px] w-[50px] flex-col gap-1.5 rounded-lg border border-line bg-paper p-2" style={{ transform: `rotate(${r}deg)` }}>
      <span className="h-1.5 w-3/4 rounded-full bg-slate/70" />
      <span className="h-1 w-full rounded-full bg-powder" />
      <span className="h-1 w-full rounded-full bg-powder" />
      <span className="h-1 w-2/3 rounded-full bg-powder" />
    </span>
  );
}

function NodeArt({ id }: { id: NodeId }) {
  switch (id) {
    case "context":
      return (
        <span className="flex items-end gap-2">
          <Sheet r={-6} />
          <Sheet r={0} />
          <Sheet r={6} />
        </span>
      );
    case "agent":
      return (
        <span className="flex w-full flex-col gap-1.5">
          <span className="h-5 w-[70%] rounded-full rounded-bl-md bg-mist" />
          <span className="h-5 w-[78%] self-end rounded-full rounded-br-md bg-night" />
          <span className="sys-typing flex h-5 w-12 items-center justify-center gap-1 rounded-full bg-mist">
            <i className="size-1 rounded-full bg-slate" />
            <i className="size-1 rounded-full bg-slate" />
            <i className="size-1 rounded-full bg-slate" />
          </span>
        </span>
      );
    case "channels":
      return (
        <span className="flex items-center gap-2.5">
          {["WhatsApp", "Gmail", "phone", "site"].map((n) => (
            <span key={n} className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-white">
              <ChannelIcon name={n} size={24} />
            </span>
          ))}
        </span>
      );
    case "tools":
      return (
        <span className="grid w-full grid-cols-3 gap-1.5">
          {system.tools.map((t, i) => (
            <span key={t} className="relative flex h-8 items-center justify-center rounded-md border border-line bg-paper text-[11px] font-semibold text-ink">
              {t}
              {i === 1 && <i className="sys-ping absolute -right-1 -top-1 size-2.5 rounded-full bg-night" aria-hidden />}
            </span>
          ))}
        </span>
      );
    case "you":
      return (
        <span className="flex flex-col items-center gap-2">
          <span className="inline-flex size-10 items-center justify-center rounded-full border-2 border-powder text-white">
            <Icon size={20}>{PATHS.check}</Icon>
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-powder">{system.nodes.you.action}</span>
        </span>
      );
  }
}

function NodeCard({ id }: { id: NodeId }) {
  const n = system.nodes[id];
  const dark = id === "you";
  return (
    <div className="flex flex-col items-center">
      <div className={`flex h-[120px] w-full items-center justify-center rounded-[20px] border px-4 ${dark ? "border-night bg-night" : "border-line bg-white"}`}>
        <NodeArt id={id} />
      </div>
      <span className="mt-3 inline-flex h-7 items-center rounded-full border border-line bg-white px-3 text-[13px] font-semibold text-night">{n.label}</span>
      <span className="mt-1.5 text-center text-[13px] text-muted">{n.caption}</span>
    </div>
  );
}

function Toasts({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-11 ${className}`} aria-hidden>
      {system.toasts.map((t, i) => (
        <span
          key={t}
          className="sys-toast absolute left-0 top-0 inline-flex h-11 items-center gap-2.5 whitespace-nowrap rounded-xl border border-line bg-white pl-2.5 pr-4 text-[14px] font-semibold text-night shadow-[0_16px_32px_-22px_rgba(23,38,61,0.6)]"
          style={vars({ "--i": i })}
        >
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-night text-white">
            <Icon size={14}>{PATHS.check}</Icon>
          </span>
          {t}
        </span>
      ))}
    </div>
  );
}

function Hub({ className = "" }: { className?: string }) {
  return (
    <span className={`sys-hub relative inline-flex size-[150px] flex-col items-center justify-center rounded-full bg-night text-white ${className}`}>
      <span className="inline-flex items-start gap-0.5 font-display text-[32px] font-extrabold leading-none tracking-[-0.045em]">
        Luma
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="-mt-0.5 text-powder" aria-hidden>
          <path d="M8 0c.6 4.6 3.4 7.4 8 8-4.6.6-7.4 3.4-8 8-.6-4.6-3.4-7.4-8-8 4.6-.6 7.4-3.4 8-8z" fill="currentColor" />
        </svg>
      </span>
      <span className="mt-1.5 text-[12px] font-semibold text-powder">{system.hub}</span>
    </span>
  );
}

// Plan du schéma (unités du viewBox 1000 × 740) : centre et cartes.
const HUB = { x: 500, y: 420 };
const POS: Record<NodeId, { x: number; y: number; out: boolean }> = {
  you: { x: 500, y: 100, out: true },
  context: { x: 180, y: 320, out: false },
  agent: { x: 820, y: 320, out: true },
  channels: { x: 300, y: 600, out: false },
  tools: { x: 700, y: 600, out: true },
};
const ORDER: NodeId[] = ["channels", "context", "agent", "tools", "you"];

/**
 * Assemblage au défilement (grand écran) : les cartes sortent du centre et les lignes se tracent
 * à mesure que le schéma monte dans l’écran. Avant hydratation ou en mouvement réduit : état final.
 */
function useAssembly() {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "center center"] });
  const p = useTransform(scrollYProgress, [0.25, 1], [0, 1], { clamp: true });
  return { stage, p, on: ready && !reduced };
}

function AssemblingNode({ id, p, on }: { id: NodeId; p: MotionValue<number>; on: boolean }) {
  const pos = POS[id];
  const x = useTransform(p, [0, 1], [`${(HUB.x - pos.x) / 10}%`, "0%"]);
  const y = useTransform(p, [0, 1], [`${((HUB.y - pos.y) / 740) * 100}%`, "0%"]);
  const opacity = useTransform(p, [0, 0.6], [0, 1]);
  const scale = useTransform(p, [0, 1], [0.6, 1]);
  return (
    <motion.div className="pointer-events-none absolute inset-0" style={on ? { x, y, opacity } : undefined}>
      <motion.div className="pointer-events-auto absolute w-[200px] -translate-x-1/2" style={{ left: `${pos.x / 10}%`, top: `calc(${(pos.y / 740) * 100}% - 60px)`, ...(on ? { scale } : {}) }}>
        <NodeCard id={id} />
      </motion.div>
    </motion.div>
  );
}

function AssemblingLine({ d, p, on }: { d: string; p: MotionValue<number>; on: boolean }) {
  const pathLength = useTransform(p, [0.2, 1], [0, 1]);
  return <motion.path d={d} stroke="var(--color-powder)" strokeWidth="1.5" fill="none" style={on ? { pathLength } : undefined} />;
}

export function SystemSchema() {
  const ref = usePlay<HTMLElement>(0.25);
  const { stage, p, on } = useAssembly();
  const hubScale = useTransform(p, [0, 1], [0.7, 1]);
  const late = useTransform(p, [0.85, 1], [0, 1]);
  return (
    <figure ref={ref} className="sys mt-14 md:mt-16" role="img" aria-label={system.alt}>
      {/* Grand écran : schéma en étoile */}
      <div ref={stage} className="relative mx-auto hidden aspect-[1000/740] w-full max-w-[1000px] lg:block">
        <svg viewBox="0 0 1000 740" className="absolute inset-0 h-full w-full" aria-hidden>
          <circle cx={HUB.x} cy={HUB.y} r="300" fill="none" stroke="var(--color-line)" strokeWidth="1.5" strokeDasharray="2 9" />
          {ORDER.map((id, i) => {
            const pos = POS[id];
            const d = pos.out ? `M${HUB.x} ${HUB.y} L${pos.x} ${pos.y}` : `M${pos.x} ${pos.y} L${HUB.x} ${HUB.y}`;
            return (
              <g key={id}>
                <AssemblingLine d={d} p={p} on={on} />
                <path d={d} pathLength={100} className="sys-bead" stroke="var(--color-night)" strokeWidth="5" strokeLinecap="round" fill="none" style={vars({ "--i": i })} />
              </g>
            );
          })}
        </svg>
        {ORDER.map((id) => (
          <AssemblingNode key={id} id={id} p={p} on={on} />
        ))}
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: `${(HUB.y / 740) * 100}%` }}>
          <motion.div style={on ? { scale: hubScale } : undefined}>
            <Hub />
          </motion.div>
        </div>
        <motion.div className="absolute" style={{ left: "calc(50% + 116px)", top: `calc(${(POS.you.y / 740) * 100}% - 52px)`, ...(on ? { opacity: late } : {}) }}>
          <Toasts />
        </motion.div>
      </div>

      {/* Mobile et tablette : le centre, puis les cartes */}
      <div className="lg:hidden">
        <div className="flex justify-center">
          <Hub />
        </div>
        <span aria-hidden className="mx-auto my-4 block h-8 w-px bg-powder" />
        <div className="grid gap-6 sm:grid-cols-2">
          {ORDER.map((id) => (
            <NodeCard key={id} id={id} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Toasts className="w-[17rem]" />
        </div>
      </div>
    </figure>
  );
}
