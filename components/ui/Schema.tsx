"use client";

import type { CSSProperties } from "react";
import { usePlay } from "./usePlay";
import { journey } from "@/lib/content";

/**
 * Parcours animé de l’accueil. Les animations sont en CSS (classes jr-* dans globals.css) :
 * elles démarrent quand le schéma entre dans l’écran, et restent désactivées sans JavaScript
 * ou avec la préférence « réduire les animations ». Le contenu est alors affiché à son état final.
 */

const vars = (v: Record<string, string | number>) => v as CSSProperties;

const ICONS = [
  // Appel
  <path key="a" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />,
  // Comprendre
  <g key="b">
    <circle cx="11" cy="11" r="7.5" />
    <path d="M21 21l-4.7-4.7" />
  </g>,
  // Construire et brancher
  <g key="c">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </g>,
  // Il travaille, vous validez
  <g key="d">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4L12 14.01l-3-3" />
  </g>,
];

/** Parcours en quatre étapes : un trait se dessine et allume chaque étape tour à tour. */
export function JourneySchema() {
  const ref = usePlay<HTMLOListElement>();
  const last = journey.steps.length - 1;
  return (
    <ol ref={ref} className="jr mt-14 grid gap-10 md:mt-16 lg:grid-cols-4 lg:gap-8">
      {journey.steps.map((s, i) => (
        <li key={s.name} className="relative flex gap-5 lg:block" style={vars({ "--i": i })}>
          {i < last && (
            <span
              aria-hidden
              className="jr-seg absolute left-6 top-14 h-[calc(100%-16px)] w-px origin-top bg-slate/60 lg:left-14 lg:top-6 lg:h-px lg:w-[calc(100%-24px)] lg:origin-left"
            />
          )}
          <span className="jr-dot relative inline-flex size-12 shrink-0 items-center justify-center rounded-full border" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {ICONS[i]}
            </svg>
          </span>
          <div className="jr-txt lg:mt-6">
            <h3 className="t-h3 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="sr-only">Étape {i + 1} : </span>
              {s.name}
            </h3>
            <p className="t-body mt-2 text-[15px]">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
