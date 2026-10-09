import Link from "next/link";
import type { CSSProperties } from "react";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { FadeIn, Stagger } from "@/components/studio/fx/FadeIn";
import { deptGlow } from "@/components/studio/fx/tokens";
import { agents, departmentOf, manager, type Agent } from "@/lib/studio/agents";
import { listFr } from "./format";
import { ArrowRight } from "./icons";
import { SectionHeading } from "./kit";

/**
 * « Travaille avec » : les autres agents du même département, plus la manager pour les non-managers.
 * Pour la manager (seule en direction), toute l’équipe qu’elle coordonne.
 * Liste compacte de rangées (portrait, prénom, rôle), à la hauteur de la discussion voisine ; chacune mène à la fiche.
 * Le département n’est écrit qu’une fois, dans le chapô : pas d’étiquette répétée sur chaque rangée.
 */
export function AgentColleagues({ agent }: { agent: Agent }) {
  const isManager = agent.id === manager.id;
  const people: Agent[] = isManager
    ? agents.filter((a) => a.id !== agent.id)
    : [...agents.filter((a) => a.department === agent.department && a.id !== agent.id), manager];
  const depts = Array.from(new Set(people.filter((p) => p.id !== manager.id).map((p) => departmentOf(p).name)));
  const lead = isManager
    ? `Coordonne toute l’équipe : ${listFr(depts)}.`
    : depts.length > 0
      ? `Même département (${listFr(depts)}), et la manager de l’agence.`
      : "La manager de l’agence.";

  return (
    <section aria-labelledby="collegues-titre" className="flex flex-col">
      <FadeIn trigger="inView">
        <SectionHeading id="collegues-titre" kicker="Équipe" title="Travaille avec" accent={deptGlow(agent.department)} size="md">
          {lead}
        </SectionHeading>
      </FadeIn>

      <Stagger as="ul" trigger="inView" step={0.07} className="mt-6 grid gap-2.5">
        {people.map((p) => {
          const ring = deptGlow(p.department);
          const isLead = !isManager && p.id === manager.id;
          return (
            <li key={p.id} className="min-w-0">
              <Link
                href={`/studio/agents/${p.id}`}
                className="studio-glass studio-lift group relative flex min-h-[4.5rem] items-center gap-4 overflow-hidden rounded-[20px] py-3 pl-3 pr-4"
              >
                <span
                  aria-hidden
                  className="studio-halo absolute -left-10 top-1/2 size-32 -translate-y-1/2 opacity-40 motion-safe:transition-opacity motion-safe:duration-500 group-hover:opacity-90"
                  style={{ "--halo": ring } as CSSProperties}
                />
                <AgentAvatar agent={p} size={48} ring={ring} decorative />
                <span className="relative min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-display text-[19px] font-extrabold leading-[1.1] tracking-[-0.025em] text-white">{p.name}</span>
                    {isLead && (
                      <span className="rounded-full border border-white/12 bg-white/[0.06] px-2 py-px text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#CADFED]">
                        Manager
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] leading-[1.35] text-white/65">{p.role}</span>
                </span>
                <ArrowRight
                  size={16}
                  className="relative text-white/50 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-0.5 group-hover:text-white/85"
                />
              </Link>
            </li>
          );
        })}
      </Stagger>
    </section>
  );
}
