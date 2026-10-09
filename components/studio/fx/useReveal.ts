"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { useInView, type UseInViewOptions } from "motion/react";

/**
 * Cycle d’une apparition à l’entrée dans l’écran, partagé par FadeIn, Stagger, CountUp et TypeText.
 *
 *   pending : rendu serveur. Le CSS cache l’élément (sauf en mouvement réduit) et prévoit un filet :
 *             s’il n’est pas armé au bout d’environ 2 s (JavaScript absent ou très lent), il apparaît quand même.
 *   armed   : le JavaScript a démarré, le filet est annulé, on attend que l’élément entre dans l’écran.
 *   in      : l’élément est dans l’écran, l’animation joue (une seule fois).
 *   shown   : affiché tout de suite, sans animation (mouvement réduit, ou filet déjà déclenché).
 *
 * L’attribut data-inview={phase} se pose sur l’élément ; tout le visuel est dans app/studio/studio.css.
 */
export type RevealPhase = "pending" | "armed" | "in" | "shown";

type Options = {
  /** false : pas d’apparition, phase « shown » dès le rendu serveur. */
  enabled?: boolean;
  amount?: UseInViewOptions["amount"];
  margin?: UseInViewOptions["margin"];
  /** Élément dont on lit l’opacité pour savoir si le filet CSS a déjà joué (par défaut : ref). */
  probe?: () => Element | null;
};

/** Ref vide : useInView n’observe rien quand l’apparition est désactivée (trigger="mount"). */
const NO_REF: RefObject<Element | null> = { current: null };

export function useReveal(ref: RefObject<Element | null>, { enabled = true, amount = 0.2, margin = "0px 0px -6% 0px", probe }: Options = {}): RevealPhase {
  const inView = useInView(enabled ? ref : NO_REF, { once: true, amount, margin });
  const [phase, setPhase] = useState<RevealPhase>(enabled ? "pending" : "shown");

  useEffect(() => {
    if (!enabled) return;
    const el = probe ? probe() : ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("shown");
      return;
    }
    // Hydratation tardive : le filet CSS a déjà révélé le contenu. On le laisse tel quel plutôt que de le recacher.
    if (Number.parseFloat(getComputedStyle(el).opacity) > 0.99) {
      setPhase("shown");
      return;
    }
    setPhase("armed");
    // Montage unique : la ref et la sonde ne changent pas pendant la vie du composant.
  }, [enabled]);

  return phase === "armed" && inView ? "in" : phase;
}

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

function subscribeFinePointer(onChange: () => void) {
  const mq = window.matchMedia(FINE_POINTER);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** Vrai si l’appareil a une souris (survol précis). Faux au rendu serveur, à l’hydratation et sur écran tactile. */
export function useFinePointer() {
  return useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
}
