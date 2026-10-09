import type { AgentStatus, DepartmentId } from "@/lib/studio/agents";

/**
 * Couleurs du studio sombre « centre de commande ».
 * Fichier sans dépendance d’exécution (seulement des types) : il peut être importé par un composant client
 * sans envoyer lib/studio/agents.ts au navigateur.
 */

/** Lueur de chaque département sur fond nuit (les accents de agents.ts sont pensés pour un fond clair). */
export const DEPT_GLOW: Record<DepartmentId, string> = {
  direction: "#9CC3FF", // bleu glacier
  prospection: "#4C8DFF", // bleu électrique doux
  contenu: "#A9B9D6", // pièces pas encore ouvertes : teintes plus sourdes
  clients: "#8CCFB5",
  production: "#D9B98C",
};

/** Bleu poudré de la charte Luma : touches neutres (pastille Studio, filets actifs, focus). */
export const POWDER = "#CADFED";
export const GLACIER = DEPT_GLOW.direction;

/** Lueur d’un département ; un id inconnu retombe sur le bleu glacier. */
export function deptGlow(id: string | undefined | null): string {
  return id && Object.hasOwn(DEPT_GLOW, id) ? DEPT_GLOW[id as DepartmentId] : GLACIER;
}

/** Tons des points de statut (LiveDot) et des pastilles. */
export type LiveTone = "ok" | "info" | "warn" | "error" | "idle" | "live";

export const TONE_COLOR: Record<LiveTone, string> = {
  ok: "#5EE0A0",
  info: "#9CC3FF",
  warn: "#F5C27A",
  error: "#FF8F8F",
  idle: "rgb(226 234 245 / 0.4)",
  live: "#4C8DFF",
};

/** Statut d’un agent → ton. « À entraîner » : ambre doux (en attente), jamais le vert d’un agent qui tourne. */
export const STATUS_TONE: Record<AgentStatus, LiveTone> = {
  "a-entrainer": "warn",
  pret: "info",
  actif: "ok",
};
