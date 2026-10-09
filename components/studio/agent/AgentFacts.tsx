import type { ReactNode } from "react";
import type { Agent, Department } from "@/lib/studio/agents";
import type { StudioStats } from "@/lib/studio/data";
import { agentKpi, typo } from "./format";

/** Grille d’infos de la fiche : mission, indicateur, routine, livrable, outils. */

function Fact({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[24px] border border-line bg-white p-5 sm:p-6 ${className}`}>
      <h3 className="t-kicker">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function AgentFacts({ agent, department, stats }: { agent: Agent; department: Department; stats: StudioStats | null }) {
  const kpi = agentKpi(agent, stats);
  return (
    <section aria-labelledby="fiche-titre" className="mt-8">
      <h2 id="fiche-titre" className="sr-only">
        Fiche de poste
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Fact title="Mission" className="md:col-span-2">
          <p className="text-[18px] leading-[1.5] text-night sm:text-[20px]">{typo(agent.mission)}</p>
        </Fact>

        <Fact title="Indicateur">
          <p className="text-[14px] font-medium text-muted">{kpi.label}</p>
          <p className="mt-2 font-display text-[40px] font-extrabold leading-none tracking-[-0.03em] text-night">
            {kpi.value ?? (
              <>
                <span aria-hidden>—</span>
                <span className="sr-only">Pas de valeur</span>
              </>
            )}
          </p>
          <p className="mt-3 flex items-start gap-2 text-[13px] leading-[1.45] text-muted">
            <span aria-hidden className="mt-[5px] size-1.5 shrink-0 rounded-full" style={{ background: kpi.value !== null ? department.accent : "#CADFED" }} />
            {kpi.hint}
          </p>
        </Fact>

        <Fact title="Routine">
          <p className="text-[15px] leading-[1.55] text-ink">{typo(agent.routine)}</p>
        </Fact>

        <Fact title="Livrable">
          <p className="text-[15px] leading-[1.55] text-ink">{typo(agent.deliverable)}</p>
        </Fact>

        <Fact title="Outils" className="md:col-span-2 lg:col-span-1">
          <ul className="grid gap-2">
            {agent.tools.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[15px] leading-[1.45] text-ink">
                <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full" style={{ background: department.accent }} />
                {typo(t)}
              </li>
            ))}
          </ul>
        </Fact>
      </div>
    </section>
  );
}
