import Link from "next/link";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { StatusPill } from "@/components/studio/ui";
import type { Agent, Department } from "@/lib/studio/agents";
import type { StudioStats } from "@/lib/studio/data";
import { agentKpi, tint, typo } from "@/components/studio/agent/format";
import { ArrowRight } from "@/components/studio/agent/icons";

/** Carte d’un agent dans la grille d’un département. */
export function AgentCard({ agent, department, stats }: { agent: Agent; department: Department; stats: StudioStats | null }) {
  const kpi = agentKpi(agent, stats);
  return (
    <article className="flex flex-col rounded-[24px] border border-line bg-white p-5 motion-safe:transition-shadow motion-safe:duration-200 hover:shadow-[0_16px_40px_-24px_rgba(23,38,61,0.28)] sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex shrink-0 rounded-full p-1.5" style={{ background: tint(department.accent, 10) }}>
          <AgentAvatar agent={agent} size={72} animated />
        </span>
        <div className="min-w-0 flex-1 pt-1">
          <h3 className="font-display text-[22px] font-bold leading-[1.1] tracking-[-0.02em] text-night">{agent.name}</h3>
          <p className="mt-1 text-[14px] text-muted">{agent.role}</p>
          <div className="mt-2.5">
            <StatusPill status={agent.status} />
          </div>
        </div>
      </div>

      <p className="mt-5 text-[16px] leading-[1.5] text-night">«&nbsp;{typo(agent.tagline)}&nbsp;»</p>

      <dl className="mt-5 grid gap-4 border-t border-line pt-5">
        <div>
          <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Routine</dt>
          <dd className="mt-1 text-[14px] leading-[1.5] text-ink">{typo(agent.routine)}</dd>
        </div>
        <div>
          <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Livrable</dt>
          <dd className="mt-1 text-[14px] leading-[1.5] text-ink">{typo(agent.deliverable)}</dd>
        </div>
      </dl>

      <div className="mt-auto pt-5">
        <div className="rounded-2xl bg-paper p-4">
          <p className="text-[13px] font-medium text-muted">{kpi.label}</p>
          <p className="mt-1.5 font-display text-[28px] font-extrabold leading-none tracking-[-0.02em] text-night">{kpi.value ?? "—"}</p>
          <p className="mt-1.5 text-[12px] leading-[1.4] text-muted">{kpi.hint}</p>
        </div>
        <Link
          href={`/studio/agents/${agent.id}`}
          aria-label={`Voir la fiche de ${agent.name}`}
          className="group mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-powder px-4 text-[14px] font-semibold text-night hover:bg-mist motion-safe:transition-colors"
        >
          Voir sa fiche
          <ArrowRight size={15} className="motion-safe:transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
