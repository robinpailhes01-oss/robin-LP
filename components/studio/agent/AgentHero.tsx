import Link from "next/link";
import type { CSSProperties } from "react";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { DeptBadge, StatusPill } from "@/components/studio/ui";
import { FadeIn, Stagger } from "@/components/studio/fx/FadeIn";
import { deptGlow } from "@/components/studio/fx/tokens";
import type { Agent, Department } from "@/lib/studio/agents";
import { HeroPortrait } from "./HeroPortrait";
import { de, glow, typo } from "./format";
import { Chevron, Clock, Lock, Package, Wrench } from "./icons";

/** Fil d’Ariane en pastille de verre : QG / département / agent (avec son mini-portrait). */
export function AgentBreadcrumb({ agent, department }: { agent: Agent; department: Department }) {
  const accent = deptGlow(department.id);
  const link =
    "inline-flex min-h-11 items-center rounded-full px-3.5 font-medium text-white/70 hover:bg-white/[0.07] hover:text-white motion-safe:transition-colors";
  return (
    <FadeIn as="nav" aria-label="Fil d’Ariane">
      <ol className="inline-flex max-w-full flex-wrap items-center gap-0.5 rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-1 text-[14px]">
        <li>
          <Link href="/studio" className={link}>
            QG
          </Link>
        </li>
        <li aria-hidden className="text-white/35">
          <Chevron />
        </li>
        <li className="min-w-0">
          <Link href={`/studio/departements/${department.id}`} className={link}>
            {department.name}
          </Link>
        </li>
        <li aria-hidden className="text-white/35">
          <Chevron />
        </li>
        <li aria-current="page" className="flex min-h-11 items-center gap-2 pl-1.5 pr-3.5 font-semibold text-white">
          <AgentAvatar agent={agent} size={26} ring={accent} decorative />
          {agent.name}
        </li>
      </ol>
    </FadeIn>
  );
}

/**
 * Décor de la scène : fond nuit proche du fond des portraits (#101C2E), lumière du département, trame de points.
 * Pas de halo poudré ici : sur ce fond, il délavait le bleu nuit en gris ardoise (coin haut-droit). Le poudré reste aux liserés.
 */
function Backdrop() {
  const dotsMask = "radial-gradient(ellipse 50% 70% at 72% 40%, #000 10%, transparent 75%)";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgb(202 223 237 / 0.035), rgb(202 223 237 / 0) 30%), radial-gradient(110% 100% at 18% 30%, rgb(16 28 46 / 0.96), rgb(9 16 30 / 0.9) 62%, rgb(6 11 22 / 0.86))",
        }}
      />
      <span className="studio-halo absolute -right-[10%] -top-[40%] aspect-square w-[70%] opacity-[0.22] [--halo:var(--accent)]" />
      <span className="studio-halo absolute left-[18%] top-[30%] hidden aspect-square w-[60%] opacity-40 md:block [--halo:var(--accent)]" />
      <div className="studio-dots absolute inset-0 opacity-70" style={{ maskImage: dotsMask, WebkitMaskImage: dotsMask }} />
      <span className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: `linear-gradient(180deg, transparent, ${glow("var(--accent)", 8)})` }} />
      <span className="studio-rule absolute inset-x-0 top-0 block opacity-70" />
    </div>
  );
}

/** Rail de repères (grand écran) : routine, livrable et outils de l’agent, en trois rangées à filets. */
function HeroRail({ agent, accent }: { agent: Agent; accent: string }) {
  const label = "flex items-center gap-2 text-[11.5px] font-semibold uppercase leading-[1.2] tracking-[0.16em] text-white/62";
  return (
    <FadeIn as="aside" delay={0.55} aria-label={`Repères ${de(agent.name)}`} className="relative z-[2] my-14 hidden min-w-0 flex-col justify-center border-l border-white/[0.08] px-8 xl:flex">
      <dl className="divide-y divide-white/[0.08]">
        <div className="pb-5">
          <dt className={label}>
            <Clock size={14} style={{ color: accent }} />
            Routine
          </dt>
          <dd className="mt-2 text-[14px] leading-[1.5] text-white/85 text-pretty">{typo(agent.routine)}</dd>
        </div>
        <div className="py-5">
          <dt className={label}>
            <Package size={14} style={{ color: accent }} />
            Livrable
          </dt>
          <dd className="mt-2 text-[14px] leading-[1.5] text-white/80 text-pretty">{typo(agent.deliverable)}</dd>
        </div>
        <div className="pt-5">
          <dt className={label}>
            <Wrench size={14} style={{ color: accent }} />
            Outils
          </dt>
          <dd className="mt-2">
            <ul className="grid gap-1.5">
              {agent.tools.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[13.5px] leading-[1.45] text-white/80">
                  <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full" style={{ background: accent, boxShadow: `0 0 6px ${accent}` }} />
                  {typo(t)}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </FadeIn>
  );
}

/**
 * Écran de sélection de personnage : le portrait occupe tout le bord gauche de la carte (en haut sur mobile),
 * le bloc de texte chevauche son bord fondu (un seul bord gauche pour sur-titre, prénom, rôle, citation et puces),
 * sur un voile sombre très doux pour rester lisible ; le prénom immense entre lettre à lettre.
 * Dès 1280 px, un rail de repères (routine, livrable, outils) occupe le tiers droit.
 * Tout entre en cascade au premier affichage (CSS, sans attendre le JavaScript) ; mouvement réduit : tout est là d’emblée.
 */
export function AgentHero({ agent, department }: { agent: Agent; department: Department }) {
  const accent = deptGlow(department.id);
  const letters = Array.from(agent.name);

  return (
    <section
      aria-labelledby="agent-nom"
      className="relative mt-5 overflow-hidden rounded-[28px] border border-white/10 shadow-[0_40px_120px_-60px_rgb(0_0_0/0.9)] sm:rounded-[32px]"
      style={{ "--accent": accent } as CSSProperties}
    >
      <Backdrop />

      <div className="relative grid md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:items-center lg:grid-cols-[32rem_minmax(0,1fr)] xl:grid-cols-[32rem_minmax(0,1fr)_17rem] xl:items-stretch">
        <FadeIn delay={0.05} y={20} duration={1} className="relative md:self-stretch">
          <HeroPortrait agent={agent} accent={accent} />
        </FadeIn>

        {/* Mobile : le bloc remonte de 48 px sur le fondu du portrait. Dès 768 px : tout le bloc chevauche le bord droit du portrait. */}
        <div className="relative z-[2] -mt-12 min-w-0 px-5 pb-10 text-center sm:px-10 sm:pb-12 md:mt-0 md:py-14 md:pl-0 md:pr-10 md:text-left lg:py-16 lg:pr-12 xl:flex xl:flex-col xl:justify-center xl:pr-10">
          <div className="relative md:-ml-14 lg:-ml-20">
            {/* Voile de lisibilité sous le texte, là où il passe sur le portrait (aucun bord visible). */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-x-16 -inset-y-12 hidden md:block"
              style={{ background: "radial-gradient(55% 60% at 22% 50%, rgb(8 14 28 / 0.5), rgb(8 14 28 / 0) 72%)" }}
            />

            <FadeIn delay={0.1} className="relative hidden flex-wrap items-center gap-x-4 gap-y-2 md:flex">
              <DeptBadge department={department} />
              <StatusPill status={agent.status} />
            </FadeIn>

            {/* Prénom : lu d’un bloc par les lecteurs d’écran, affiché lettre par lettre. */}
            <h1
              id="agent-nom"
              className="relative font-display text-[clamp(4.5rem,1.5rem+9vw,9.5rem)] font-extrabold leading-[0.92] tracking-[-0.06em] text-white md:mt-4"
            >
              <span className="sr-only">{agent.name}</span>
              {/* Ombre et lueur du prénom sur une couche à part (un seul passage de texte) : posées sur chaque lettre,
                  l’ombre d’une lettre assombrissait la précédente (l’approche serrée les fait se chevaucher). */}
              <FadeIn
                as="span"
                aria-hidden
                delay={0.3}
                y={0}
                duration={0.9}
                className="pointer-events-none absolute inset-x-0 top-0 -ml-[0.04em] whitespace-nowrap pb-[0.1em] pt-[0.1em] text-transparent"
                style={{ textShadow: `0 4px 40px rgb(6 11 22 / 0.85), 0 0 70px ${glow("var(--accent)", 40)}` }}
              >
                {agent.name}
              </FadeIn>
              <Stagger
                as="span"
                aria-hidden
                delay={0.16}
                step={0.055}
                y={30}
                duration={0.9}
                className="relative -ml-[0.04em] inline-block whitespace-nowrap pb-[0.1em] pt-[0.1em]"
              >
                {letters.map((ch, i) => (
                  <span key={`${ch}-${i}`} className="inline-block">
                    {ch}
                  </span>
                ))}
              </Stagger>
            </h1>

            <FadeIn delay={0.34} className="relative">
              <p className="mt-5 font-display text-[clamp(1.25rem,1.05rem+0.8vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-white/85">{agent.role}</p>
            </FadeIn>

            {/* Mobile : département et statut sous le rôle (le portrait occupe le haut de la carte). */}
            <FadeIn delay={0.38} className="relative mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:hidden">
              <DeptBadge department={department} />
              <StatusPill status={agent.status} />
            </FadeIn>

            <FadeIn delay={0.42} className="relative">
              <blockquote className="mx-auto mt-7 max-w-[34rem] md:mx-0 md:border-l md:pl-5" style={{ borderColor: glow(accent, 60) }}>
                <p className="text-[17px] leading-[1.55] text-white/80 text-pretty sm:text-[19px]">«&nbsp;{typo(agent.tagline)}&nbsp;»</p>
              </blockquote>
            </FadeIn>

            <Stagger as="ul" aria-label="Personnalité" delay={0.5} step={0.06} className="relative mt-7 flex flex-wrap justify-center gap-2 md:justify-start">
              {agent.personality.map((p) => (
                <li
                  key={p}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[13px] font-medium text-white/85 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]"
                >
                  <span aria-hidden className="size-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
                  {p}
                </li>
              ))}
            </Stagger>

            {/* Même libellé que sur le QG : la discussion est annoncée, verrouillée jusqu’à l’étape 2. */}
            <FadeIn delay={0.64} className="relative mt-9 flex flex-wrap justify-center gap-3 md:justify-start">
              <a href="#discussion" aria-label={`Discuter avec ${agent.name}, disponible à l’étape 2`} className="studio-btn studio-btn--ghost gap-2.5 pl-4 pr-2">
                <Lock size={15} className="opacity-70" />
                Discuter avec {agent.name}
                <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">Étape 2</span>
              </a>
            </FadeIn>
          </div>
        </div>

        <HeroRail agent={agent} accent={accent} />
      </div>
    </section>
  );
}
