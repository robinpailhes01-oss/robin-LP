import Image from "next/image";
import type { CSSProperties } from "react";
import type { Agent } from "@/lib/studio/agents";
import { GLACIER } from "@/components/studio/fx/tokens";

/**
 * Personnages du studio : le portrait 3D de chaque agent (agent.avatar.portrait, carré 768 px sur fond bleu nuit),
 * recadré sur le visage dans un disque, avec un anneau lumineux fin et un halo de la couleur choisie.
 * Composant serveur, sans état. Réservé à /studio (la DA interdit les avatars sur le site public).
 *
 * animated : flottement très léger du portrait et halo qui respire (CSS, coupés en mouvement réduit), réservé aux grands
 * portraits (120 px et plus) : en dessous, il est ignoré, les petits avatars restent immobiles (budget de mouvement du studio).
 * Chaque prénom a son propre décalage : les agents ne flottent jamais tous ensemble.
 * Accessibilité : alt = prénom ; decorative (prénom déjà écrit à côté, ou parent aria-hidden) → alt vide, aria-hidden.
 * priority : portrait principal au-dessus de la ligne de flottaison (chargement immédiat, priorité réseau haute).
 */

/** Décalage propre à chaque prénom (0 à 6,9 s). */
function delayOf(name: string) {
  let sum = 0;
  for (const ch of name) sum += ch.codePointAt(0) ?? 0;
  return (sum % 70) / 10;
}

/** Recadrage : plus l’avatar est petit, plus on resserre sur le visage pour qu’il reste lisible. */
function zoomOf(size: number) {
  if (size < 56) return 1.6;
  if (size < 120) return 1.42;
  return 1.28;
}

export function AgentAvatar({
  agent,
  size = 56,
  animated = false,
  ring = GLACIER,
  decorative = false,
  priority = false,
  className = "",
}: {
  agent: Pick<Agent, "name" | "avatar">;
  size?: number;
  animated?: boolean;
  /** Couleur de l’anneau et du halo (par défaut : bleu glacier). */
  ring?: string;
  decorative?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const name = typeof agent.name === "string" ? agent.name : "";
  const src = typeof agent.avatar?.portrait === "string" ? agent.avatar.portrait : "";
  const zoom = zoomOf(size);
  const delay = delayOf(name);
  const moving = animated && size >= 120;
  const style = {
    width: size,
    height: size,
    "--ring": ring,
    "--zoom": zoom,
    "--float-delay": `${(-delay).toFixed(1)}s`,
    "--float-y": `${Math.max(2, Math.min(6, size / 30)).toFixed(1)}px`,
  } as CSSProperties;

  return (
    <span aria-hidden={decorative || undefined} className={`studio-avatar ${className}`} style={style}>
      <span className={`studio-avatar-halo ${moving ? "studio-breathe" : ""}`} />
      <span className={`studio-avatar-disc ${moving ? "studio-float" : ""}`}>
        {src ? (
          <Image
            src={src}
            alt={decorative ? "" : name}
            fill
            sizes={`${Math.ceil(size * zoom)}px`}
            className="studio-avatar-img"
            loading={priority ? "eager" : undefined}
            fetchPriority={priority ? "high" : undefined}
          />
        ) : (
          <span role={decorative ? undefined : "img"} aria-label={decorative ? undefined : name} className="studio-avatar-initial" style={{ fontSize: size * 0.4 }}>
            {name.slice(0, 1)}
          </span>
        )}
      </span>
    </span>
  );
}

/* ---------- Poste prévu, pas encore pourvu ---------- */

/**
 * Chaise vide de l’équipe : disque de verre dépoli, contour pointillé lumineux discret,
 * silhouette (tête et épaules) en trait pointillé bleu poudré, sans visage. Décoratif (aria-hidden).
 * Le trait garde une épaisseur lisible à l’écran quelle que soit la taille (36 à 52 px dans les pages).
 */
export function PlannedAvatar({ size = 56, className = "" }: { size?: number; className?: string }) {
  // Épaisseur visée à l’écran (px), convertie dans le repère 48 du dessin.
  const px = Math.min(1.8, Math.max(1.1, size / 34));
  const w = (px * 48) / Math.max(size, 1);
  return (
    <span aria-hidden="true" className={`studio-avatar studio-avatar--planned ${className}`} style={{ width: size, height: size }}>
      <span className="studio-avatar-disc">
        <svg viewBox="0 0 48 48" width="100%" height="100%" focusable="false" style={{ display: "block" }}>
          <g fill="none" stroke="#CADFED" strokeOpacity="0.6" strokeWidth={w} strokeLinecap="round" strokeDasharray={`${(w * 1.2).toFixed(2)} ${(w * 2.2).toFixed(2)}`}>
            <circle cx="24" cy="19.5" r="7.2" />
            <path d="M10.5 43.5C12 35.6 17.4 31.6 24 31.6S36 35.6 37.5 43.5" />
          </g>
        </svg>
      </span>
    </span>
  );
}
