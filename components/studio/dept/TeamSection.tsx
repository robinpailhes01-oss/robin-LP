import Link from "next/link";
import type { CSSProperties } from "react";
import { CharacterCard } from "@/components/studio/CharacterCard";
import { FadeIn } from "@/components/studio/fx/FadeIn";
import { GlowBorder } from "@/components/studio/fx/GlowBorder";
import { POWDER, deptGlow } from "@/components/studio/fx/tokens";
import type { Agent, Department } from "@/lib/studio/agents";
import type { StudioStats } from "@/lib/studio/data";
import { agentKpi, plural, typo } from "@/components/studio/agent/format";
import { KpiInline, SectionHeading } from "@/components/studio/agent/kit";
import { ArrowRight, Lock } from "@/components/studio/agent/icons";

/**
 * « L’équipe » d’un département ouvert, juste sous l’en-tête : les agents en grandes cartes « sélection de personnage »,
 * avec leur routine, leur livrable et leur indicateur honnête en bas de carte (valeur réelle ou « — » et la raison).
 *
 * Dès 640 px : grille dont chaque carte occupe 4 rangées partagées (portrait, identité, détails, pied, grid-rows-subgrid),
 * pour que filets, intitulés « Routine » et indicateurs tombent à la même hauteur d’une carte à l’autre.
 * Mobile : carrousel à défilement accrocheur (une carte et le bord de la suivante), au lieu de quatre cartes empilées.
 * Agent seul (Direction) : sa carte dans un cadre à bordure lumineuse, sa présentation et ses repères à côté.
 */
export function TeamSection({ department, team, stats }: { department: Department; team: Agent[]; stats: StudioStats | null }) {
  if (team.length === 0) return null;
  const accent = deptGlow(department.id);

  return (
    <section aria-labelledby="equipe-titre">
      <FadeIn trigger="inView">
        <SectionHeading id="equipe-titre" kicker={plural(team.length, "agent", "agents")} title="L’équipe" accent={accent}>
          {team.length > 1
            ? "Clique sur un personnage pour ouvrir sa fiche\u00a0: sa mission, ses consignes et son entraînement."
            : "Ouvre sa fiche pour voir sa mission, ses consignes et son entraînement."}
        </SectionHeading>
      </FadeIn>

      {team.length === 1 ? (
        <Solo agent={team[0]} accent={accent} stats={stats} />
      ) : (
        <>
          {/* Pas de fondu-montée générique : chaque carte joue son entrée « sélection de personnage », en cascade (--ci). */}
          <ul
            aria-label={`Équipe ${department.name}`}
            className="-mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-3 [scroll-padding-inline:1rem] [scrollbar-color:rgb(255_255_255/0.16)_transparent] [scrollbar-width:thin] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:p-0 xl:grid-cols-4"
          >
            {team.map((a, i) => (
              <li
                key={a.id}
                className="flex w-[78%] min-w-0 shrink-0 snap-start sm:row-span-4 sm:grid sm:w-auto sm:grid-rows-subgrid sm:gap-y-0"
                style={{ "--ci": i } as CSSProperties}
              >
                <CharacterCard
                  agent={a}
                  accent={accent}
                  size="lg"
                  subgrid
                  sizes="(min-width: 1280px) 310px, (min-width: 640px) 50vw, 78vw"
                  className="group w-full"
                  details={<CardDetails agent={a} />}
                  footer={<CardFooter agent={a} stats={stats} />}
                />
              </li>
            ))}
          </ul>
          <p className="mt-2 flex items-center gap-2 text-[12.5px] text-white/62 sm:hidden">
            <span aria-hidden className="h-px w-5 bg-white/25" />
            Fais défiler pour voir toute l’équipe
          </p>
        </>
      )}
    </section>
  );
}

/** Détails : routine et livrable, sous un filet (à la même hauteur sur toutes les cartes de la rangée). */
function CardDetails({ agent }: { agent: Agent }) {
  return (
    <dl className="grid gap-3.5 border-t border-white/[0.08] pt-4">
      <div>
        <dt className="studio-kicker">Routine</dt>
        <dd className="mt-1 text-[14px] leading-[1.5] text-white/75">{typo(agent.routine)}</dd>
      </div>
      <div>
        <dt className="studio-kicker">Livrable</dt>
        <dd className="mt-1 text-[14px] leading-[1.5] text-white/75 text-pretty">{typo(agent.deliverable)}</dd>
      </div>
    </dl>
  );
}

/** Pied : l’indicateur, puis l’invitation à ouvrir la fiche, seule poussée en bas (la carte entière est le lien). */
function CardFooter({ agent, stats }: { agent: Agent; stats: StudioStats | null }) {
  return (
    <>
      <KpiInline kpi={agentKpi(agent, stats)} />
      <p aria-hidden className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-semibold text-white/80">
        Ouvrir la fiche
        <ArrowRight size={15} className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1" />
      </p>
    </>
  );
}

/** Agent seul dans son département : la pièce maîtresse de la page, une seule bordure lumineuse. */
function Solo({ agent, accent, stats }: { agent: Agent; accent: string; stats: StudioStats | null }) {
  const href = `/studio/agents/${agent.id}`;
  return (
    <div className="mt-8">
      <GlowBorder
        colors={[accent, POWDER]}
        innerClassName="grid gap-6 p-3 sm:p-4 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:p-5"
      >
        <CharacterCard agent={agent} accent={accent} size="lg" priority sizes="(min-width: 1024px) 368px, 100vw" className="h-auto" />

        <div className="min-w-0 px-2 pb-4 sm:px-4 lg:py-6 lg:pr-8">
          <p className="studio-kicker">Sa présentation</p>
          <blockquote className="mt-3 font-display text-[clamp(1.5rem,1.15rem+1.3vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-white text-balance">
            <p>«&nbsp;{typo(agent.tagline)}&nbsp;»</p>
          </blockquote>

          <dl className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="studio-kicker">Routine</dt>
              <dd className="mt-1.5 text-[15px] leading-[1.55] text-white/75">{typo(agent.routine)}</dd>
            </div>
            <div>
              <dt className="studio-kicker">Livrable</dt>
              <dd className="mt-1.5 text-[15px] leading-[1.55] text-white/75 text-pretty">{typo(agent.deliverable)}</dd>
            </div>
          </dl>

          <KpiInline kpi={agentKpi(agent, stats)} className="mt-6 sm:max-w-[22rem]" />

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={href} className="studio-btn studio-btn--primary group">
              Ouvrir sa fiche
              <span className="sr-only"> ({agent.name})</span>
              <ArrowRight size={16} className="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
            </Link>
            <Link href={`${href}#discussion`} aria-label={`Discuter avec ${agent.name}, disponible à l’étape 2`} className="studio-btn studio-btn--ghost gap-2.5 pl-4 pr-2">
              <Lock size={15} className="opacity-70" />
              Discuter
              <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">Étape 2</span>
            </Link>
          </div>
        </div>
      </GlowBorder>
    </div>
  );
}
