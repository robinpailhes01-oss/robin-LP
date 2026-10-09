import type { CSSProperties, ReactNode } from "react";
import { CountUp } from "@/components/studio/fx/CountUp";
import { LiveDot } from "@/components/studio/fx/LiveDot";
import type { KpiView } from "./format";
import { Plug } from "./icons";

/**
 * Petites pièces communes aux pages départements et aux fiches agents (thème sombre).
 * Composants serveur ; seul le compteur (CountUp) est client, et il ne reçoit qu’un nombre réel ou null.
 */

/** Titre de section : sur-titre précédé d’un filet lumineux à la couleur du département, grand titre serré, chapô. */
export function SectionHeading({
  id,
  kicker,
  title,
  accent,
  children,
  action,
  as: Tag = "h2",
  size = "lg",
}: {
  id?: string;
  kicker: string;
  title: string;
  accent: string;
  /** Chapô sous le titre. */
  children?: ReactNode;
  /** Élément aligné à droite (lien, compteur). */
  action?: ReactNode;
  as?: "h2" | "h3";
  size?: "lg" | "md";
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0 max-w-[48rem]">
        <p className="studio-kicker flex items-center gap-2.5">
          <span aria-hidden className="h-px w-7 shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${accent})` }} />
          {kicker}
        </p>
        <Tag
          id={id}
          className={
            size === "lg"
              ? "studio-h2 mt-3"
              : "mt-2 font-display text-[26px] font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-[28px]"
          }
        >
          {title}
        </Tag>
        {children && <p className="studio-body mt-3 max-w-[42rem]">{children}</p>}
      </div>
      {action}
    </div>
  );
}

/** Pastille d’icône en verre, éclairée par la couleur du département. Décorative. */
export function IconChip({ children, accent, size = 36 }: { children: ReactNode; accent: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="relative flex shrink-0 items-center justify-center rounded-[12px] border border-white/10 bg-white/[0.05]"
      style={{ width: size, height: size, color: accent, boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.08), 0 0 24px -8px ${accent}` }}
    >
      {children}
    </span>
  );
}

/** Intitulé d’un panneau de la fiche : icône + petit titre en capitales. */
export function FactLabel({ icon, accent, children, id }: { icon: ReactNode; accent: string; children: ReactNode; id?: string }) {
  return (
    <h3 id={id} className="relative flex items-center gap-3 text-[12px] font-semibold uppercase leading-[1.2] tracking-[0.16em] text-white/70">
      <IconChip accent={accent}>{icon}</IconChip>
      {children}
    </h3>
  );
}

/**
 * Indicateur d’un agent, en bas de carte : une valeur réelle qui monte de 0, dans son encadré ;
 * sans valeur, une seule ligne discrète (prise débranchée et raison), jamais un encadré vide avec un « — » au milieu
 * (répété sur chaque carte, il se lisait comme un squelette de chargement). Le libellé reste lu par les lecteurs d’écran.
 */
export function KpiInline({ kpi, className = "" }: { kpi: KpiView; className?: string }) {
  if (kpi.value === null) {
    return (
      <p className={`flex items-start gap-2 text-[12.5px] leading-[1.45] text-white/62 text-pretty ${className}`}>
        <Plug size={14} className="mt-px text-white/50" />
        <span>
          <span className="sr-only">
            {kpi.label}
            {"\u00a0"}: non disponible.{" "}
          </span>
          {kpi.hint}
        </span>
      </p>
    );
  }
  return (
    <div className={`relative overflow-hidden rounded-[14px] border border-white/[0.12] bg-[rgb(202_223_237/0.05)] p-3.5 ${className}`}>
      <p className="flex items-center gap-2 text-[12px] font-medium leading-[1.35] text-white/70">
        <LiveDot tone="ok" size={6} />
        {kpi.label}
      </p>
      <p className="mt-2 font-display text-[30px] font-extrabold leading-none tracking-[-0.03em] text-white">
        <CountUp value={kpi.value} />
      </p>
      <p className="mt-2 text-[12px] leading-[1.45] text-white/60 text-pretty">{kpi.hint}</p>
    </div>
  );
}

/** État vide ou indisponible, en verre pointillé : icône, titre, explication. */
export function EmptyState({ icon, title, children, className = "" }: { icon: ReactNode; title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`studio-glass studio-glass--dashed rounded-[20px] px-5 py-9 text-center sm:py-10 ${className}`}>
      <span aria-hidden className="mx-auto flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70">
        {icon}
      </span>
      <p className="mt-4 font-display text-[17px] font-bold tracking-[-0.01em] text-white">{title}</p>
      <p className="mx-auto mt-1.5 max-w-[30rem] text-[14px] leading-[1.55] text-white/65 text-pretty">{children}</p>
    </div>
  );
}

/** Pastille courte en verre (personnalité, échéance, type de demande). */
export function GlassTag({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[12px] font-medium leading-[1.3] text-white/75 ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

/** Halo coloré décoratif (couleur du département) ; placement par className. */
export function Halo({ color, className = "", opacity }: { color: string; className?: string; opacity?: number }) {
  return <span aria-hidden className={`studio-halo absolute ${className}`} style={{ "--halo": color, opacity } as CSSProperties} />;
}

