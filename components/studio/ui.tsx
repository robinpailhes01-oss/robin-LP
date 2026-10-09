import type { ReactNode } from "react";
import { statusLabel, type AgentStatus, type Department } from "@/lib/studio/agents";

/** Petits éléments communs du studio. Composants serveur, sans état. */

export function StatusPill({ status }: { status: AgentStatus }) {
  const tone =
    status === "actif" ? "bg-[#E3F4EA] text-[#1F6B43]" : status === "pret" ? "bg-mist text-night" : "bg-paper text-muted border border-line";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${tone}`}>
      <span aria-hidden className={`size-1.5 rounded-full ${status === "actif" ? "bg-[#2E9E62]" : status === "pret" ? "bg-night" : "bg-slate"}`} />
      {statusLabel[status]}
    </span>
  );
}

/** Indicateur : une valeur réelle, ou « — » avec la raison quand la source n’est pas branchée. */
export function Kpi({ label, value, hint }: { label: string; value: number | null; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-[13px] font-medium text-muted">{label}</p>
      <p className="mt-2 font-display text-[30px] font-extrabold leading-none tracking-[-0.02em] text-night">{value ?? "—"}</p>
      {hint && <p className="mt-2 text-[12px] leading-[1.4] text-muted">{hint}</p>}
    </div>
  );
}

export function DeptBadge({ department }: { department: Pick<Department, "name" | "accent"> }) {
  return (
    <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
      <span aria-hidden className="size-2 rounded-full" style={{ background: department.accent }} />
      {department.name}
    </span>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[24px] border border-line bg-white p-5 sm:p-6 ${className}`}>{children}</section>;
}

export function PanelTitle({ kicker, title, action }: { kicker?: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {kicker && <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">{kicker}</p>}
        <h2 className="mt-1 font-display text-[20px] font-bold tracking-[-0.015em] text-night">{title}</h2>
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
