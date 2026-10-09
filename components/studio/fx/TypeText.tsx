"use client";

import { createElement, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useReveal } from "./useReveal";

/**
 * Saisie progressive d’un texte (le message d’Alma), caractère par caractère, avec un curseur lumineux.
 * - Lecteurs d’écran : le texte complet, d’un bloc, dans un span sr-only ; la partie animée est aria-hidden.
 * - Pas de saut de mise en page : le reste du texte est déjà en place, transparent, et se dévoile.
 * - Démarre à l’entrée dans l’écran, une fois. Filet CSS : si le JavaScript ne démarre pas, le texte apparaît.
 * - Mouvement réduit : texte complet immédiatement, sans curseur.
 * Pauses naturelles après la ponctuation. Texte brut seulement (pas de liens ni de balises dedans).
 */
type Tag = "p" | "span" | "div" | "h1" | "h2" | "h3" | "blockquote";

function pause(ch: string, speed: number) {
  if (".!?…".includes(ch)) return speed * 9;
  if (",;:".includes(ch)) return speed * 5;
  return speed;
}

export function TypeText({
  text,
  as = "p",
  className = "",
  speed = 26,
  delay = 0.3,
  caret = "#9CC3FF",
  id,
}: {
  text: string;
  as?: Tag;
  className?: string;
  /** Millisecondes par caractère. */
  speed?: number;
  /** Attente avant la première lettre, en secondes. */
  delay?: number;
  /** Couleur du curseur. */
  caret?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const restRef = useRef<HTMLSpanElement>(null);
  const phase = useReveal(ref, { probe: () => restRef.current, amount: 0.5 });
  const chars = useMemo(() => Array.from(text), [text]);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (phase !== "in") return;
    let i = 0;
    let timer = window.setTimeout(function tick() {
      i += 1;
      setN(i);
      if (i < chars.length) timer = window.setTimeout(tick, pause(chars[i - 1], speed));
    }, delay * 1000);
    return () => window.clearTimeout(timer);
  }, [phase, chars, speed, delay]);

  const typing = phase === "in";
  const count = phase === "shown" ? chars.length : typing ? n : 0;
  const done = phase === "shown" || (typing && n >= chars.length);

  return createElement(
    as,
    {
      ref,
      id,
      className: `studio-type ${className}`,
      "data-inview": phase,
      "data-done": done ? "" : undefined,
      style: { "--caret": caret } as CSSProperties,
    },
    <span className="sr-only">{text}</span>,
    <span aria-hidden>
      {chars.slice(0, count).join("")}
      <span className="studio-type-caret" />
      <span ref={restRef} className="studio-type-rest">
        {chars.slice(count).join("")}
      </span>
    </span>,
  );
}
