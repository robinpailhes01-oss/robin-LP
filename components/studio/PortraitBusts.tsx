import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Agent } from "@/lib/studio/agents";

/**
 * Rangée de portraits en buste qui se chevauchent : découpes verticales arrondies en haut, fondues vers le bas,
 * un buste sur deux un peu plus bas et derrière ses voisins, liseré de la couleur de chacun.
 * Taille « lg » : 150 px de haut sur mobile, 220 px en grand écran (en-têtes des départements) ;
 * « sm » : 104 à 136 px (en-tête du QG). Entrée : chaque buste monte de 30 % depuis sous sa ligne (le pied du buste, découpé),
 * en cascade ; ensuite immobiles (pas de flottement) ; survol souris : le buste monte de 4 px.
 *
 * linked : chaque buste mène à la fiche de l’agent (prénom lisible), sinon la rangée est décorative (aria-hidden).
 * Composant serveur, styles dans app/studio/studio.css (section 12 bis).
 */
type BustAgent = Pick<Agent, "id" | "name" | "avatar">;

const ELISION = /^[aeiouyàâäéèêëîïôöùûüœ]/i;

export function PortraitBusts<T extends BustAgent>({
  people,
  colorOf,
  size = "lg",
  linked = false,
  names = false,
  label,
  delay = 0.2,
  className = "",
}: {
  people: T[];
  /** Couleur du liseré et de la lumière de chacun (couleur du département). */
  colorOf: (agent: T) => string;
  size?: "lg" | "sm";
  linked?: boolean;
  /** Prénom écrit sur le fondu de chaque buste. */
  names?: boolean;
  /** Nom de la liste pour les lecteurs d’écran (rangée liée). */
  label?: string;
  /** Départ de la montée des bustes, en secondes. */
  delay?: number;
  className?: string;
}) {
  const maxH = size === "lg" ? 220 : 136;
  return (
    <ul
      aria-label={linked ? label : undefined}
      aria-hidden={linked ? undefined : true}
      className={`studio-busts studio-busts--${size} ${className}`}
      style={{ "--bust-delay": `${delay}s` } as CSSProperties}
    >
      {people.map((p) => {
        const src = typeof p.avatar?.portrait === "string" ? p.avatar.portrait : "";
        const body = (
          <>
            <span className="studio-bust-frame">
              {src && <Image src={src} alt="" fill sizes={`${maxH}px`} className="object-cover object-top" />}
              <span className="studio-cut-glow" />
            </span>
            {names && <span className="studio-bust-name">{p.name}</span>}
          </>
        );
        return (
          <li key={p.id} className="studio-bust-slot" style={{ "--accent": colorOf(p) } as CSSProperties}>
            {linked ? (
              <Link href={`/studio/agents/${p.id}`} aria-label={`Fiche ${ELISION.test(p.name) ? "d’" : "de "}${p.name}`} className="studio-bust">
                {body}
              </Link>
            ) : (
              <span className="studio-bust">{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Rangée de postes prévus (département fermé) : capsules en pointillés et silhouettes, sans visage. Décorative. */
export function PlannedBusts({ count, color, delay = 0.2, className = "" }: { count: number; color: string; delay?: number; className?: string }) {
  return (
    <ul aria-hidden className={`studio-busts studio-busts--lg ${className}`} style={{ "--bust-delay": `${delay}s` } as CSSProperties}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="studio-bust-slot" style={{ "--accent": color } as CSSProperties}>
          <span className="studio-bust studio-bust--planned">
            <span className="studio-bust-frame flex items-end justify-center">
              <svg viewBox="0 0 70 100" className="mb-[6%] h-[78%] w-auto" fill="none" focusable="false">
                <g stroke="#CADFED" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2.2 3.6">
                  <circle cx="35" cy="34" r="13" />
                  <path d="M10 98c2.5-17 12-26 25-26s22.5 9 25 26" />
                </g>
              </svg>
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
