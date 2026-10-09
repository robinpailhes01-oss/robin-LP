import Link from "next/link";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { PanelTitle } from "@/components/studio/ui";
import { agents, departmentOf, manager, type Agent } from "@/lib/studio/agents";
import { ArrowRight } from "./icons";

/**
 * « Travaille avec » : les autres agents du même département, plus la manager pour les non-managers.
 * Pour la manager (seule en direction), toute l’équipe qu’elle coordonne.
 */
export function AgentColleagues({ agent }: { agent: Agent }) {
  const isManager = agent.id === manager.id;
  const people: { agent: Agent; note: string }[] = isManager
    ? agents.filter((a) => a.id !== agent.id).map((a) => ({ agent: a, note: departmentOf(a).name }))
    : [
        ...agents.filter((a) => a.department === agent.department && a.id !== agent.id).map((a) => ({ agent: a, note: "Même département" })),
        { agent: manager, note: "Manager" },
      ];

  return (
    <section className="rounded-[24px] border border-line bg-white p-5 sm:p-6">
      <PanelTitle kicker="Équipe" title="Travaille avec" />
      {isManager && <p className="mt-1 text-[14px] text-muted">Coordonne toute l’équipe, département par département.</p>}
      <ul className="mt-4 grid gap-1">
        {people.map(({ agent: p, note }) => (
          <li key={p.id}>
            <Link
              href={`/studio/agents/${p.id}`}
              className="group -mx-2 flex min-h-11 items-center gap-3 rounded-2xl px-2 py-2 hover:bg-mist motion-safe:transition-colors"
            >
              <span aria-hidden className="flex">
                <AgentAvatar agent={p} size={44} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-night">{p.name}</span>
                <span className="block truncate text-[13px] text-muted">
                  {p.role} · {note}
                </span>
              </span>
              <ArrowRight size={16} className="text-muted motion-safe:transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
