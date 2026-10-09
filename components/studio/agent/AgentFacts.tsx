import type { CSSProperties } from "react";
import { CountUp } from "@/components/studio/fx/CountUp";
import { FadeIn, Stagger } from "@/components/studio/fx/FadeIn";
import { GlassCard } from "@/components/studio/fx/GlassCard";
import { LiveDot } from "@/components/studio/fx/LiveDot";
import { TONE_COLOR, deptGlow } from "@/components/studio/fx/tokens";
import type { Agent, Department } from "@/lib/studio/agents";
import type { StudioStats } from "@/lib/studio/data";
import { agentKpi, typo, type KpiView } from "./format";
import { FactLabel, SectionHeading } from "./kit";
import { Clock, Gauge, Package, Plug, Target, Wrench } from "./icons";

/**
 * Fiche de poste en panneaux de verre : la mission (le grand panneau), puis routine et livrable dans une seule carte
 * à deux colonnes, et les outils. Dès 1280 px, routine, livrable et outils sont déjà dans le rail du héros (AgentHero) :
 * ils ne sont pas répétés ici.
 * Indicateur : avec une vraie valeur Supabase, sa tuile à côté de la mission (compteur) ; sans valeur, une bande fine
 * au pied de la mission (prise débranchée, « — », raison), jamais une grande tuile vide.
 */
export function AgentFacts({ agent, department, stats }: { agent: Agent; department: Department; stats: StudioStats | null }) {
  const accent = deptGlow(department.id);
  const kpi = agentKpi(agent, stats);
  const live = kpi.value !== null;

  return (
    <section aria-labelledby="fiche-titre" className="mt-16 sm:mt-24" style={{ "--accent": accent } as CSSProperties}>
      <FadeIn trigger="inView">
        <SectionHeading id="fiche-titre" kicker="Fiche de poste" title={`Ce que fait ${agent.name}`} accent={accent} />
      </FadeIn>

      <Stagger trigger="inView" step={0.08} className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <GlassCard variant="raised" glow={accent} radius="xl" pad="none" className={`overflow-hidden md:col-span-2 ${live ? "" : "lg:col-span-3"}`}>
          <span aria-hidden className="studio-halo absolute -left-28 -top-36 size-96 opacity-80 [--halo:var(--accent)]" />
          <div className="relative p-6 sm:p-8 lg:p-10">
            <FactLabel icon={<Target size={18} />} accent={accent}>
              Mission
            </FactLabel>
            <p className={`relative mt-6 max-w-[46rem] font-display text-[clamp(1.375rem,1.1rem+1vw,2rem)] font-semibold leading-[1.25] tracking-[-0.02em] text-white text-pretty ${live ? "" : "xl:max-w-[58rem] xl:text-[2.5rem] xl:leading-[1.16] xl:tracking-[-0.025em]"}`}>
              {typo(agent.mission)}
            </p>
          </div>
          {!live && <KpiBand kpi={kpi} accent={accent} />}
        </GlassCard>

        {live && <KpiPanel kpi={kpi} accent={accent} />}

        {/* Routine et livrable : une seule carte, deux colonnes (une carte par ligne de texte laissait de grands vides). */}
        <GlassCard radius="xl" pad="none" className="overflow-hidden md:col-span-2 xl:hidden">
          <div className="grid sm:grid-cols-2">
            <div className="p-6 sm:p-8">
              <FactLabel icon={<Clock size={18} />} accent={accent}>
                Routine
              </FactLabel>
              <p className="mt-5 text-[16px] leading-[1.55] text-white/80 text-pretty">{typo(agent.routine)}</p>
            </div>
            <div className="border-t border-white/[0.08] p-6 sm:border-l sm:border-t-0 sm:p-8">
              <FactLabel icon={<Package size={18} />} accent={accent}>
                Livrable
              </FactLabel>
              <p className="mt-5 text-[16px] leading-[1.55] text-white/80 text-pretty">{typo(agent.deliverable)}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard radius="xl" pad="lg" className="md:col-span-2 lg:col-span-1 xl:hidden">
          <FactLabel icon={<Wrench size={18} />} accent={accent}>
            Outils
          </FactLabel>
          <ul className="mt-5 grid">
            {agent.tools.map((t) => (
              <li key={t} className="flex items-center gap-3 border-t border-white/[0.07] py-2.5 text-[14px] leading-[1.45] text-white/80 first:border-t-0 first:pt-0">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
                {typo(t)}
              </li>
            ))}
          </ul>
        </GlassCard>
      </Stagger>
    </section>
  );
}

/** Indicateur éteint : bande fine au pied de la mission. Libellé, trait fin « — », prise débranchée et raison. */
function KpiBand({ kpi, accent }: { kpi: KpiView; accent: string }) {
  return (
    <div className="relative flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-white/[0.08] bg-[rgb(6_11_22/0.25)] px-6 py-4 sm:px-8 lg:px-10">
      <h3 className="flex items-center gap-2.5 text-[12px] font-semibold uppercase leading-[1.2] tracking-[0.16em] text-white/70">
        <Gauge size={16} style={{ color: accent }} />
        Indicateur
      </h3>
      <p className="flex items-baseline gap-3 text-[14px] font-medium text-white/80">
        {kpi.label}
        <span className="font-display text-[22px] font-extrabold leading-none">
          <CountUp value={null} />
        </span>
      </p>
      <p className="flex items-center gap-2 text-[12.5px] leading-[1.45] text-white/62 sm:ml-auto">
        <Plug size={14} className="text-white/50" />
        {kpi.hint}
      </p>
    </div>
  );
}

/** Indicateur branché : grand chiffre réel qui monte de 0. Jamais de chiffre inventé. */
function KpiPanel({ kpi, accent }: { kpi: KpiView; accent: string }) {
  return (
    <GlassCard variant="raised" glow={accent} radius="xl" pad="lg" className="overflow-hidden md:col-span-2 lg:col-span-1">
      <span aria-hidden className="studio-halo absolute -right-16 -top-20 size-60 opacity-50" style={{ "--halo": TONE_COLOR.ok } as CSSProperties} />
      <FactLabel icon={<Gauge size={18} />} accent={accent}>
        Indicateur
      </FactLabel>
      <p className="relative mt-5 flex items-center gap-2 text-[14px] font-medium text-white/70">
        <LiveDot tone="ok" pulse size={6} />
        {kpi.label}
      </p>
      <p className="relative mt-2 font-display text-[56px] font-extrabold leading-none tracking-[-0.04em] text-white">
        <CountUp value={kpi.value} />
      </p>
      <p className="relative mt-4 text-[13px] leading-[1.5] text-white/65 text-pretty">{kpi.hint}</p>
    </GlassCard>
  );
}
