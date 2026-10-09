import type { CSSProperties } from "react";
import type { StudioStats } from "@/lib/studio/data";
import { CountUp } from "@/components/studio/fx/CountUp";
import { Stagger } from "@/components/studio/fx/FadeIn";
import { LiveDot } from "@/components/studio/fx/LiveDot";
import { DEPT_GLOW, POWDER } from "@/components/studio/fx/tokens";
import { PlugIcon } from "./icons";

const NBSP = " ";

type Tile = { key: string; label: string; value: number; about: string; color: string };

/**
 * Indicateurs des 7 derniers jours, en tuiles de verre, affichés seulement avec des valeurs réelles
 * (getStudioStats connecté et lu sans erreur ; sinon HqActivity montre le module « Branchement »).
 * Chaque valeur monte de 0 à l’entrée dans l’écran (CountUp). Les brouillons d’Inès ne sont reliés à aucune source
 * pour l’instant : ils restent une ligne fine sous les tuiles, jamais une tuile vide. Aucun graphique.
 */
export function HqKpis({ stats }: { stats: StudioStats }) {
  if (!stats.connected || stats.error) return null;
  const all = [
    { key: "leads", label: "Demandes", value: stats.leadsWeek, about: "Audits, rappels et messages du site", color: POWDER },
    { key: "audits", label: "Audits", value: stats.auditsWeek, about: "Mini-audits complétés", color: DEPT_GLOW.prospection },
    { key: "rappels", label: "Rappels", value: stats.rappelsWeek, about: "Demandes de rappel", color: "#F5C27A" },
  ];
  const tiles = all.filter((t): t is Tile => typeof t.value === "number" && Number.isFinite(t.value));

  return (
    <div>
      <h3 id="indicateurs" className="studio-kicker">
        Indicateurs · 7{NBSP}derniers jours
      </h3>
      {tiles.length > 0 && (
        <Stagger as="ul" trigger="inView" step={0.08} y={18} aria-labelledby="indicateurs" className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
          {tiles.map((t) => (
            <li key={t.key} className="studio-glass relative flex flex-col overflow-hidden rounded-[20px] p-3.5 sm:p-6" style={{ "--halo": t.color } as CSSProperties}>
              <span aria-hidden className="studio-halo absolute -right-14 -top-16 size-44 opacity-70" />
              <span aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }} />
              <div className="relative flex items-center justify-between gap-2">
                <p className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-white/72">
                  <LiveDot tone="ok" size={6} />
                  <span className="truncate">{t.label}</span>
                </p>
                <span aria-hidden className="hidden rounded-full border border-white/[0.08] px-1.5 py-px text-[10.5px] font-semibold text-white/62 sm:inline">
                  7{NBSP}j
                </span>
              </div>
              <p className="relative mt-4 font-display text-[36px] font-extrabold leading-none tracking-[-0.05em] text-white sm:mt-6 sm:text-[56px]">
                <CountUp value={t.value} />
              </p>
              <p className="relative mt-auto hidden pt-3 text-[12.5px] leading-[1.45] text-white/62 text-pretty sm:block">{t.about}</p>
            </li>
          ))}
        </Stagger>
      )}
      <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-[1.45] text-white/62">
        <PlugIcon className="mt-px size-3.5 shrink-0 text-white/50" />
        <span>
          Brouillons d’Inès · 7{NBSP}j{NBSP}: <span aria-hidden className="studio-null">—</span>
          <span className="sr-only">non disponible</span>, branché quand elle sera entraînée.
        </span>
      </p>
    </div>
  );
}
