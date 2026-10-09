import type { CSSProperties } from "react";
import type { AgentStatus } from "@/lib/studio/agents";
import { STATUS_TONE, TONE_COLOR, type LiveTone } from "./tokens";

/**
 * Point de statut lumineux. Composant serveur, zéro JavaScript.
 * Couleur : par statut d’agent (status) ou par ton (tone). « À entraîner » est ambre : en attente,
 * jamais le vert d’un agent qui tourne. Décoratif par défaut (le statut est écrit à côté) ; label le rend lisible seul.
 * pulse : onde qui pulse (transform + opacity), réservée au seul point « vivant » de l’écran (la priorité d’Alma au QG,
 * une donnée lue en direct). Par défaut, le point reste fixe. Mouvement réduit : jamais d’onde.
 */
export function LiveDot({
  status,
  tone,
  pulse,
  size = 8,
  label,
  className = "",
}: {
  status?: AgentStatus;
  tone?: LiveTone;
  /** Onde qui pulse (par défaut : non). */
  pulse?: boolean;
  size?: number;
  /** Texte pour les lecteurs d’écran quand rien n’est écrit à côté. */
  label?: string;
  className?: string;
}) {
  const t: LiveTone = tone ?? (status ? STATUS_TONE[status] : "info");
  const doPulse = pulse === true && t !== "idle";
  const style = {
    "--dot": TONE_COLOR[t],
    "--dot-size": `${size}px`,
    "--dot-speed": t === "warn" ? "3.2s" : "2.4s",
  } as CSSProperties;
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`studio-dot ${className}`}
      data-pulse={doPulse ? "" : undefined}
      data-flat={t === "idle" ? "" : undefined}
      style={style}
    />
  );
}
