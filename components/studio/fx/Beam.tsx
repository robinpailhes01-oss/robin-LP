"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useId, useRef, type CSSProperties } from "react";

/**
 * Connecteur lumineux entre deux éléments d’un schéma de flux (Léo → Inès → Hugo…) : un trait SVG fin
 * et une lumière qui le parcourt. La lumière avance par transform (composité, 60 fps), joue seulement
 * quand le connecteur est à l’écran, et disparaît en mouvement réduit (le trait reste).
 *
 * orientation : "horizontal" (s’étire dans une rangée flex), "vertical" (hauteur = length),
 * ou "responsive" (vertical sous 768 px, horizontal au-delà : le schéma passe en colonne sur mobile).
 * active={false} : lien pas encore en service (poste prévu) → trait pointillé, sans lumière.
 * Décoratif (aria-hidden) : le sens du flux doit être dit dans le texte du schéma.
 */
export type BeamOrientation = "horizontal" | "vertical" | "responsive";

type BeamProps = {
  orientation?: BeamOrientation;
  color?: string;
  /** Durée d’un passage, en secondes. */
  duration?: number;
  /** Décalage du premier passage, en secondes (pour enchaîner plusieurs connecteurs). */
  delay?: number;
  /** La lumière va de droite à gauche (ou de bas en haut). */
  reverse?: boolean;
  active?: boolean;
  /** Pastilles aux deux extrémités. */
  caps?: boolean;
  /** Longueur minimale en vertical (valeur CSS). */
  length?: string;
  className?: string;
};

export function Beam({ orientation = "horizontal", className = "", ...props }: BeamProps) {
  if (orientation === "responsive") {
    return (
      <>
        <BeamLine {...props} orientation="vertical" className={`md:hidden ${className}`} />
        <BeamLine {...props} orientation="horizontal" className={`hidden md:block ${className}`} />
      </>
    );
  }
  return <BeamLine {...props} orientation={orientation} className={className} />;
}

function BeamLine({
  orientation,
  color = "#4C8DFF",
  duration = 3.2,
  delay = 0,
  reverse = false,
  active = true,
  caps = true,
  length = "2.5rem",
  className = "",
}: BeamProps & { orientation: "horizontal" | "vertical" }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0 });
  const reduce = useReducedMotion();
  const gid = `beam-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const h = orientation === "horizontal";
  const run = active && inView && !reduce;

  const style = {
    "--beam": color,
    "--beam-dur": `${duration}s`,
    "--beam-delay": `${delay}s`,
    "--beam-len": length,
  } as CSSProperties;

  const cap = (pos: "start" | "end"): CSSProperties => ({
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 9999,
    background: color,
    opacity: active ? 0.9 : 0.45,
    boxShadow: active ? `0 0 8px ${color}` : undefined,
    ...(h ? { top: "50%", marginTop: -2.5, [pos === "start" ? "left" : "right"]: 0 } : { left: "50%", marginLeft: -2.5, [pos === "start" ? "top" : "bottom"]: 0 }),
  });

  return (
    <span
      ref={ref}
      aria-hidden
      className={`studio-beam ${className}`}
      data-orientation={orientation}
      data-run={run ? "" : undefined}
      data-reverse={reverse ? "" : undefined}
      data-idle={active ? undefined : ""}
      style={style}
    >
      <svg className="studio-beam-track" focusable="false">
        <defs>
          <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={h ? "100%" : "0"} y2={h ? "0" : "100%"}>
            <stop offset="0" stopColor={color} stopOpacity={active ? 0.5 : 0.3} />
            <stop offset="0.5" stopColor={color} stopOpacity={active ? 0.32 : 0.22} />
            <stop offset="1" stopColor={color} stopOpacity={active ? 0.5 : 0.3} />
          </linearGradient>
        </defs>
        <line
          x1={h ? "0" : "50%"}
          y1={h ? "50%" : "0"}
          x2={h ? "100%" : "50%"}
          y2={h ? "50%" : "100%"}
          stroke={`url(#${gid})`}
          strokeWidth={active ? 1.25 : 1}
          strokeDasharray={active ? undefined : "3 5"}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {active && (
        <span className="studio-beam-runner">
          <span className="studio-beam-comet" />
        </span>
      )}
      {caps && (
        <>
          <span style={cap("start")} />
          <span style={cap("end")} />
        </>
      )}
    </span>
  );
}
