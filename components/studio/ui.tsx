import type { CSSProperties, ReactNode } from "react";
import { statusLabel, type AgentStatus, type Department, type DepartmentId } from "@/lib/studio/agents";
import { CountUp } from "@/components/studio/fx/CountUp";
import { LiveDot } from "@/components/studio/fx/LiveDot";
import { deptGlow } from "@/components/studio/fx/tokens";

/** Petits éléments communs du studio, en verre sombre. Composants serveur (Kpi délègue le compteur à CountUp, client). */

export function StatusPill({ status }: { status: AgentStatus }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[12px] font-semibold leading-[1.3] text-white/85">
      <LiveDot status={status} size={6} />
      {statusLabel[status]}
    </span>
  );
}

/**
 * Indicateur : une valeur réelle qui monte de 0 à l’entrée dans l’écran,
 * ou « — » avec la raison quand la source n’est pas branchée. Jamais de chiffre inventé.
 */
export function Kpi({ label, value, hint }: { label: string; value: number | null; hint?: string }) {
  const live = value !== null;
  return (
    <div className="studio-glass relative overflow-hidden rounded-[20px] p-4 sm:p-5">
      {live && <span aria-hidden className="studio-halo absolute -right-10 -top-12 size-32 opacity-60" />}
      <p className="relative flex items-center gap-2 text-[13px] font-medium text-white/65">
        <LiveDot tone={live ? "ok" : "idle"} pulse={false} size={6} />
        {label}
      </p>
      <p className={`relative mt-3 font-display text-[36px] font-extrabold leading-none tracking-[-0.035em] sm:text-[40px] ${live ? "text-white" : "text-white/45"}`}>
        <CountUp value={value} />
      </p>
      {hint && <p className="relative mt-2.5 text-[12px] leading-[1.45] text-white/60 text-pretty">{hint}</p>}
    </div>
  );
}

/** Nom du département avec sa pastille lumineuse (couleur DEPT_GLOW ; l’accent clair de agents.ts sert de repli). */
export function DeptBadge({ department }: { department: Pick<Department, "name" | "accent"> & { id?: DepartmentId } }) {
  const color = department.id ? deptGlow(department.id) : `color-mix(in srgb, ${department.accent} 45%, #CADFED)`;
  return (
    <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/65">
      <span aria-hidden className="size-2 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` } as CSSProperties} />
      {department.name}
    </span>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`studio-glass rounded-[24px] p-5 sm:p-6 ${className}`}>{children}</section>;
}

export function PanelTitle({ kicker, title, action }: { kicker?: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {kicker && <p className="studio-kicker">{kicker}</p>}
        <h2 className="mt-1.5 font-display text-[22px] font-bold leading-[1.15] tracking-[-0.025em] text-white">{title}</h2>
      </div>
      {action}
    </div>
  );
}

/** Format court d’une date de demande : « aujourd’hui 14:05 », « hier », « 3 oct. ». */
export function shortDate(iso: string, now = Date.now()) {
  const d = new Date(iso);
  const day = (t: number) => new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", dateStyle: "short" }).format(t);
  const time = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }).format(d);
  if (day(d.getTime()) === day(now)) return `aujourd’hui ${time}`;
  if (day(d.getTime()) === day(now - 86400000)) return `hier ${time}`;
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short" }).format(d);
}
