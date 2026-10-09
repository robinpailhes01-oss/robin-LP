"use client";

import { createElement, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { useReveal } from "./useReveal";

/**
 * Entrées en cascade du studio (fondu + légère montée, transform et opacity seulement).
 *
 * trigger="mount" (par défaut) : l’animation CSS joue dès l’affichage, sans attendre le JavaScript.
 *   À utiliser au-dessus de la ligne de flottaison (en-tête, première carte) : rien n’est caché en attendant l’hydratation.
 * trigger="inView" : l’entrée joue quand l’élément arrive à l’écran (useInView de motion), une seule fois.
 *   Rendu serveur caché, avec un filet CSS : sans JavaScript, le contenu apparaît au bout de 1,8 s.
 *
 * Mouvement réduit : aucune animation, contenu visible immédiatement (même avant l’hydratation).
 * Les délais et durées sont en secondes. Le visuel est dans app/studio/studio.css (section 6).
 */
type Tag = "div" | "section" | "article" | "aside" | "header" | "footer" | "nav" | "li" | "ul" | "ol" | "span" | "p" | "figure";

type RevealProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  as?: Tag;
  delay?: number;
  /** Montée de départ en px. */
  y?: number;
  duration?: number;
  trigger?: "mount" | "inView";
  children?: ReactNode;
};

export function FadeIn({ as = "div", delay = 0, y = 14, duration = 0.7, trigger = "mount", className = "", style, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = trigger === "inView";
  const phase = useReveal(ref, { enabled: inView });
  const vars = { "--rise-delay": `${delay}s`, "--rise-y": `${y}px`, "--rise-dur": `${duration}s`, ...style } as CSSProperties;
  return createElement(
    as,
    { ...rest, ref, className: `${inView ? "studio-rise-iv" : "studio-rise"} ${className}`, style: vars, "data-inview": inView ? phase : undefined },
    children,
  );
}

/**
 * Cascade : chaque enfant direct entre à son tour (step secondes d’écart, jusqu’à 20 rangs).
 * Les enfants restent des éléments directs (li d’une liste, cartes d’une grille) : aucune enveloppe ajoutée.
 */
export function Stagger({
  as = "div",
  delay = 0,
  step = 0.07,
  y = 14,
  duration = 0.7,
  trigger = "mount",
  className = "",
  style,
  children,
  ...rest
}: RevealProps & { step?: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = trigger === "inView";
  const phase = useReveal(ref, { enabled: inView, probe: () => ref.current?.firstElementChild ?? null });
  const vars = {
    "--rise-delay": `${delay}s`,
    "--rise-step": `${step}s`,
    "--rise-y": `${y}px`,
    "--rise-dur": `${duration}s`,
    ...style,
  } as CSSProperties;
  return createElement(
    as,
    { ...rest, ref, className: `${inView ? "studio-stagger-iv" : "studio-stagger"} ${className}`, style: vars, "data-inview": inView ? phase : undefined },
    children,
  );
}
