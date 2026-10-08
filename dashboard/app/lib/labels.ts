import type { Segment, Statut } from "./types";

export const SEGMENTS: Record<Segment, { court: string; long: string }> = {
  montagne: { court: "B · Montagne", long: "B · Montagne, indépendants des stations" },
  pme: { court: "A · PME", long: "A · PME à l'année, Occitanie et Côte d'Azur" },
};

export const STATUTS: Statut[] = ["nouveau", "contacte", "repondu", "rdv", "refus", "desinscrit"];

export const STATUT_LABEL: Record<Statut, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  repondu: "Répondu",
  rdv: "RDV",
  refus: "Refus",
  desinscrit: "Désinscrit",
};

// Un refus est une réponse. Un désinscrit est compté à part.
export const STATUTS_REPONSE: Statut[] = ["repondu", "rdv", "refus"];

// En dessous, une différence entre variantes est une tendance, jamais une preuve (brief, section Rapports).
export const SEUIL_PREUVE = 100;
