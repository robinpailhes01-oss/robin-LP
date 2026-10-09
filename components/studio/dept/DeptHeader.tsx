import Link from "next/link";
import type { CSSProperties } from "react";
import { PlannedBusts, PortraitBusts } from "@/components/studio/PortraitBusts";
import { FadeIn } from "@/components/studio/fx/FadeIn";
import { SplitTitle } from "@/components/studio/fx/SplitTitle";
import { LiveDot } from "@/components/studio/fx/LiveDot";
import { DEPT_GLOW, GLACIER, deptGlow } from "@/components/studio/fx/tokens";
import { statusLabel, type Agent, type Department } from "@/lib/studio/agents";
import { plural, typo } from "@/components/studio/agent/format";
import { ArrowLeft, Lock } from "@/components/studio/agent/icons";

/**
 * En-tête d’une page département : grand halo de la couleur du département, titre immense en dégradé, description,
 * et l’équipe en bustes qui se chevauchent (découpes verticales fondues vers le bas, décalages en hauteur, prénoms),
 * chacun menant à sa fiche. Département fermé : capsules en pointillés des postes prévus.
 * Agent seul (Direction) : pas de buste ici, sa grande carte suit juste dessous.
 * Département fermé : halo bleu glacier très doux à gauche, bleu électrique à 20 % côté postes (la teinte sourde du futur département,
 * ou le bleu poudré, feraient une tache grise).
 * Les halos restent dans la largeur de la page (pas de défilement horizontal) et s’effacent avant leurs bords.
 */
export function DeptHeader({ department, team }: { department: Department; team: Agent[] }) {
  const accent = deptGlow(department.id);
  const halo = department.open ? accent : GLACIER;
  const planned = department.plannedRoles ?? [];
  const statuses = new Set(team.map((a) => a.status));
  const shared = team.length > 0 && statuses.size === 1 ? team[0].status : null;
  const teamLine =
    team.length === 0 ? null : shared ? `${plural(team.length, "agent", "agents")} · ${statusLabel[shared].toLowerCase()}` : plural(team.length, "agent", "agents");
  const busts = department.open && team.length > 1;

  return (
    <header className="relative" style={{ "--accent": accent } as CSSProperties}>
      {/* Décor : un grand halo du département qui déborde sous la barre du haut (glacier atténué : plein, il grisait le bleu nuit). */}
      <span
        aria-hidden
        className={`studio-halo absolute -top-44 left-0 aspect-square w-full max-w-[56rem] sm:-top-72 ${!department.open ? "opacity-[0.25]" : halo === GLACIER ? "opacity-40" : ""}`}
        style={{ "--halo": halo } as CSSProperties}
      />
      {/* Côté portraits : la lumière du département (ou bleu électrique très doux pour un département fermé), jamais le poudré qui virait au gris. */}
      {(busts || !department.open) && (
        <span
          aria-hidden
          className="studio-halo absolute -top-10 right-0 hidden aspect-square w-[28rem] opacity-[0.2] lg:block"
          style={{ "--halo": department.open ? accent : DEPT_GLOW.prospection } as CSSProperties}
        />
      )}

      <div className="relative">
        <FadeIn>
          <Link href="/studio" aria-label="Retour au QG" className="studio-btn studio-btn--quiet -ml-3 min-h-11 gap-2 px-3 text-[14px] font-medium">
            <ArrowLeft size={16} className="opacity-75" />
            QG
          </Link>
        </FadeIn>

        <div className="mt-6 grid gap-8 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
          <div className="min-w-0">
            {/* Sur-titre « Département » à la pastille lumineuse : le nom, lui, est le grand titre juste dessous. */}
            <FadeIn delay={0.05} className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="studio-kicker inline-flex items-center gap-2 text-white/70">
                <span aria-hidden className="size-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
                Département
              </p>
              {!department.open && (
                <span className="studio-chip">
                  <Lock size={13} className="opacity-80" />
                  Pas encore ouvert
                </span>
              )}
            </FadeIn>
            {/* Mouvement signature : le nom monte mot à mot, chaque mot de sous sa ligne (SplitTitle, dégradé posé sur chaque mot). */}
            <SplitTitle text={department.name} gradient delay={0.1} className="studio-display mt-5 max-w-[15ch] pb-[0.08em] pt-[0.04em]" />
            <FadeIn delay={0.2}>
              <p className="studio-lead mt-5 max-w-[38rem]">{typo(department.description)}</p>
            </FadeIn>
          </div>

          {busts ? (
            <div className="relative flex flex-col gap-4 lg:items-end">
              <span aria-hidden className="studio-halo absolute inset-x-0 -top-10 bottom-0 opacity-60 lg:-inset-x-6 [--halo:var(--accent)]" />
              {/* Chaque buste monte de sous sa ligne, en cascade (CSS, studio-bust). */}
              <PortraitBusts people={team} colorOf={() => accent} linked names label="L’équipe" delay={0.3} className="relative" />
              {teamLine && (
                <FadeIn delay={0.7} y={8} className="relative flex items-center gap-2.5 text-[14px] font-medium text-white/75">
                  {shared ? <LiveDot status={shared} size={7} /> : <LiveDot tone="info" size={7} />}
                  {teamLine}
                </FadeIn>
              )}
            </div>
          ) : !department.open && planned.length > 0 ? (
            <div className="relative flex flex-col gap-4 lg:items-end">
              <span aria-hidden className="studio-halo absolute inset-x-0 -top-10 bottom-0 opacity-[0.2] lg:-inset-x-6" style={{ "--halo": DEPT_GLOW.prospection } as CSSProperties} />
              <PlannedBusts count={planned.length} color={GLACIER} delay={0.3} className="relative" />
              <FadeIn delay={0.6} y={8} className="relative flex items-center gap-2.5 text-[14px] font-medium text-white/70">
                <LiveDot tone="idle" size={7} />
                {plural(planned.length, "poste prévu", "postes prévus")}
              </FadeIn>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
