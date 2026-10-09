"use client";

import { animate } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useReveal } from "./useReveal";

const nf = new Intl.NumberFormat("fr-FR");

/**
 * Compteur qui monte de 0 à la valeur quand il entre dans l’écran (une fois).
 * Règle d’honnêteté : il ne reçoit que de vraies valeurs (getStudioStats). null → « — » (trait fin, .studio-null), sans animation,
 * avec « Non disponible » pour les lecteurs d’écran ; la raison s’écrit à côté (Kpi hint).
 *
 * Le chiffre final est dans le HTML serveur (sr-only, toujours lu en entier par les lecteurs d’écran) ;
 * le chiffre visible est caché jusqu’au départ du compteur, avec un filet CSS s’il ne démarre jamais.
 * Mouvement réduit : la valeur finale s’affiche tout de suite.
 */
export function CountUp({
  value,
  duration,
  className = "",
  nullText = "Non disponible",
}: {
  value: number | null;
  /** Durée en secondes ; par défaut, de 0,6 s (petits nombres) à 1,6 s. */
  duration?: number;
  className?: string;
  nullText?: string;
}) {
  if (value === null || !Number.isFinite(value)) {
    // Trait fin et discret (studio-null) : une valeur absente ne doit pas ressembler à une barre de chargement.
    return (
      <span className={className}>
        <span aria-hidden className="studio-null">
          —
        </span>
        <span className="sr-only">{nullText}</span>
      </span>
    );
  }
  return <Counter key={value} value={value} duration={duration} className={className} />;
}

function Counter({ value, duration, className }: { value: number; duration?: number; className: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const out = useRef<HTMLSpanElement>(null);
  const phase = useReveal(root, { probe: () => out.current, amount: 0.6 });
  const final = nf.format(value);

  // Avant le premier affichage de la phase « in » : le chiffre visible repart de 0 (pas d’éclair de la valeur finale).
  useLayoutEffect(() => {
    if (phase === "in" && out.current && value !== 0) out.current.textContent = nf.format(0);
  }, [phase, value]);

  useEffect(() => {
    if (phase !== "in" || value === 0) return;
    const node = out.current;
    if (!node) return;
    const d = duration ?? Math.min(1.6, 0.6 + Math.log10(Math.abs(value) + 1) * 0.45);
    const controls = animate(0, value, {
      duration: d,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = nf.format(Math.round(v));
      },
      onComplete: () => {
        node.textContent = final;
      },
    });
    return () => {
      controls.stop();
      node.textContent = final;
    };
  }, [phase, value, duration, final]);

  return (
    <span ref={root} className={`studio-count studio-num ${className}`} data-inview={phase}>
      <span ref={out} aria-hidden className="studio-count-value">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
