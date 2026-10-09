import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { manager } from "@/lib/studio/agents";
import type { StudioStats } from "@/lib/studio/data";
import { StatusPill } from "@/components/studio/ui";
import { FadeIn } from "@/components/studio/fx/FadeIn";
import { GlowBorder } from "@/components/studio/fx/GlowBorder";
import { LiveDot } from "@/components/studio/fx/LiveDot";
import { TypeText } from "@/components/studio/fx/TypeText";
import { DEPT_GLOW, GLACIER, POWDER } from "@/components/studio/fx/tokens";
import { ArrowDownIcon, ArrowRightIcon, LockIcon } from "./icons";
import { PRIORITY_TONE, almaPriority, almaSources } from "./priority";

/**
 * Carte de commandement : l’élément clé du QG (la seule bordure animée de l’écran).
 * Alma y figure en vrai personnage, comme future propriétaire de la carte et lien vers sa fiche, pas comme autrice du texte :
 * la priorité est calculée par des règles simples (priority.tsx) à partir des seules données réelles.
 *
 * Mise en page : dès 1024 px, portrait de héros découpé sur toute la hauteur de la carte (colonne de 21,5 rem, 30 rem de haut au moins)
 * | message, avec les sources de données en bande horizontale au pied de la colonne message (filets verticaux).
 * Sur mobile : bandeau portrait 16:10 en haut de la carte, fondu vers le bas, prénom et statut posés sur le fondu ;
 * les sources s’empilent en lignes. Le portrait d’Alma est le seul grand portrait qui flotte sur l’écran.
 * Mise en route : « Comment brancher » mène au module Branchement plus bas (la marche à suivre n’est écrite qu’une fois).
 */
function AlmaPortrait() {
  const alma = manager;
  const src = typeof alma.avatar?.portrait === "string" ? alma.avatar.portrait : "";
  return (
    <div
      className="relative aspect-[16/10] overflow-hidden rounded-t-[26px] lg:aspect-auto lg:h-full lg:min-h-[30rem] lg:rounded-l-[26px] lg:rounded-tr-none"
      style={{ "--accent": GLACIER, "--head-y": "26%" } as CSSProperties}
    >
      {/* Portrait : à droite du bandeau sur mobile (le texte vit à gauche), toute la colonne dès 1024 px. */}
      <div aria-hidden className="studio-cut studio-cut--alma left-[22%] lg:left-0">
        <div className="studio-cut-layer studio-float" style={{ "--float-y": "-6px", "--float-dur": "9s", "--float-delay": "-1.6s" } as CSSProperties}>
          {src && (
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 1024px) 600px, 80vw"
              className="object-cover object-top"
              loading="eager"
              fetchPriority="high"
            />
          )}
        </div>
        <span className="studio-cut-glow" />
      </div>
      <span aria-hidden className="studio-edge-v hidden lg:block" />

      {/* Prénom, rôle et statut, posés sur le fondu. */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
        <p className="font-display text-[34px] font-extrabold leading-none tracking-[-0.045em] text-white [text-shadow:0_2px_24px_rgb(6_11_22/0.85)] sm:text-[40px] lg:text-[54px]">
          {alma.name}
        </p>
        <p className="mt-1.5 text-[14px] leading-[1.4] text-white/75 [text-shadow:0_1px_12px_rgb(6_11_22/0.9)] lg:mt-2 lg:text-[15px]">{alma.role}</p>
        <p className="mt-3">
          <StatusPill status={alma.status} />
        </p>
      </div>
    </div>
  );
}

export function AlmaCommand({ stats }: { stats: StudioStats }) {
  const alma = manager;
  const p = almaPriority(stats);
  const sources = almaSources(stats);

  return (
    <FadeIn delay={0.12} y={24} duration={0.9}>
      <GlowBorder as="section" aria-labelledby="priorite-jour" colors={[DEPT_GLOW.prospection, POWDER]} radius={28} speed={9}>
        {/* Décor : halo glacier côté Alma, trame de points qui s’efface vers la gauche. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <span className="studio-halo absolute -left-28 -top-36 size-[32rem] opacity-60 [--halo:#9CC3FF]" />
          <span className="studio-halo absolute -bottom-48 right-[-10%] size-[34rem] opacity-40 [--halo:#4C8DFF]" />
          <span className="studio-dots absolute inset-y-0 right-0 w-3/4 [mask-image:linear-gradient(to_left,#000_5%,transparent_80%)]" />
        </div>

        <div className="relative grid lg:grid-cols-[21.5rem_minmax(0,1fr)]">
          <AlmaPortrait />

          {/* Message du jour, puis les sources en bande au pied de la colonne. */}
          <div className="flex min-w-0 flex-col px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 lg:px-12 lg:py-11">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
              <h2 id="priorite-jour" className="studio-kicker text-[#CADFED]">
                Priorité du jour
              </h2>
              {/* Le seul point qui pulse sur l’écran : c’est l’information vivante du jour. */}
              <span className="studio-chip">
                <LiveDot tone={PRIORITY_TONE[p.tone]} size={6} pulse />
                {p.label}
              </span>
            </div>

            <TypeText
              as="p"
              text={p.headline}
              delay={0.85}
              caret={GLACIER}
              className="mt-5 max-w-[20ch] font-display text-[28px] font-bold leading-[1.08] tracking-[-0.035em] text-balance text-white sm:text-[36px] lg:text-[46px]"
            />
            {p.detail && <p className="studio-body mt-4 max-w-[60ch]">{p.detail}</p>}
            {p.howTo && (
              <a
                href="#demandes"
                className="group/how -mx-3 mt-2 inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-white/[0.06] motion-reduce:transition-none"
              >
                Comment brancher
                <ArrowDownIcon className="size-4 text-[#CADFED] transition-transform duration-300 motion-safe:group-hover/how:translate-y-0.5 motion-reduce:transition-none" />
              </a>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={`/studio/agents/${alma.id}`} className="group/cta studio-btn studio-btn--primary">
                Ouvrir la fiche d’Alma
                <ArrowRightIcon className="size-4 transition-transform duration-300 motion-safe:group-hover/cta:translate-x-0.5 motion-reduce:transition-none" />
              </Link>
              {/* Verrouillé : mène à la discussion de la fiche, qui explique l’étape 2. */}
              <Link
                href={`/studio/agents/${alma.id}#discussion`}
                aria-label={`Discuter avec ${alma.name}, étape 2 : verrouillé pour l’instant`}
                className="studio-btn studio-btn--ghost border-dashed text-white/80"
              >
                <LockIcon className="size-4 text-[#CADFED]" />
                Discuter avec {alma.name}
                <span className="rounded-full border border-white/12 bg-white/[0.06] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#CADFED]">
                  Étape 2
                </span>
              </Link>
            </div>

            {/* Sources de données et leur état réel : seule la source Supabase peut être branchée à l’étape 1. */}
            <div className="mt-auto pt-9">
              <aside aria-labelledby="sources-alma" className="border-t border-white/[0.08] pt-5">
                <h3 id="sources-alma" className="studio-kicker">
                  Sources de données
                </h3>
                <ul className="mt-4 grid divide-y divide-white/[0.07] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {sources.map((s) => (
                    <li key={s.name} className="min-w-0 py-3 first:pt-0 last:pb-0 sm:px-5 sm:py-0 sm:first:pl-0 sm:last:pr-0">
                      <p className="text-[14px] font-semibold leading-[1.35] text-white">{s.name}</p>
                      <p className="mt-1 flex items-center gap-2 text-[13px] leading-[1.45] text-white/65">
                        <LiveDot tone={s.tone} size={7} />
                        {s.state}
                      </p>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Mention d’honnêteté : toujours visible. */}
              <p className="mt-6 max-w-[72ch] text-[13px] leading-[1.6] text-white/62">
                Point calculé par des règles simples à partir des demandes du site{"\u00a0"}: {alma.name} n’est pas encore entraînée. La discussion arrive à l’étape
                2 (branchement à Claude).
              </p>
            </div>
          </div>
        </div>
      </GlowBorder>
    </FadeIn>
  );
}
