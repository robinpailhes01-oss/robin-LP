import Link from "next/link";
import { AgentAvatar, PlannedAvatar } from "@/components/studio/AgentAvatar";
import { DeptBadge } from "@/components/studio/ui";
import { statusLabel, type Agent, type Department } from "@/lib/studio/agents";
import { plural, typo } from "@/components/studio/agent/format";

/** En-tête d’une page département : retour au QG, badge, titre, description et l’équipe en rangée. */
export function DeptHeader({ department, team }: { department: Department; team: Agent[] }) {
  const planned = department.plannedRoles ?? [];
  const statuses = new Set(team.map((a) => a.status));
  const teamLine =
    team.length === 0
      ? null
      : statuses.size === 1
        ? `${plural(team.length, "agent", "agents")} · ${statusLabel[team[0].status].toLowerCase()}`
        : plural(team.length, "agent", "agents");

  return (
    <header>
      <Link
        href="/studio"
        aria-label="Retour au QG"
        className="-ml-3 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[14px] font-medium text-muted hover:bg-mist hover:text-night motion-safe:transition-colors"
      >
        <span aria-hidden>←</span>
        <span>QG</span>
      </Link>

      <div className="hero-in mt-4 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 max-w-[46rem]">
          <DeptBadge department={department} />
          <h1 className="t-h2 mt-3">{department.name}</h1>
          <p className="t-lead mt-4">{typo(department.description)}</p>
        </div>

        {department.open && team.length > 0 ? (
          <div className="flex shrink-0 items-center gap-4">
            <ul aria-label="L’équipe" className="flex -space-x-3">
              {team.map((a) => (
                <li key={a.id} className="relative flex rounded-full ring-4 ring-paper hover:z-10">
                  <Link
                    href={`/studio/agents/${a.id}`}
                    aria-label={`Fiche de ${a.name}`}
                    className="flex rounded-full motion-safe:transition-transform motion-safe:duration-200 hover:-translate-y-0.5"
                  >
                    <AgentAvatar agent={a} size={52} />
                  </Link>
                </li>
              ))}
            </ul>
            {teamLine && <p className="text-[14px] leading-[1.4] text-muted">{teamLine}</p>}
          </div>
        ) : planned.length > 0 ? (
          <div className="flex shrink-0 items-center gap-4">
            <div aria-hidden className="flex -space-x-3">
              {planned.map((r) => (
                <span key={r} className="flex rounded-full bg-paper ring-4 ring-paper">
                  <PlannedAvatar size={52} />
                </span>
              ))}
            </div>
            <p className="text-[14px] leading-[1.4] text-muted">{plural(planned.length, "poste prévu", "postes prévus")}</p>
          </div>
        ) : null}
      </div>
    </header>
  );
}
