import { STATUTS_REPONSE } from "./labels";
import type { Envoi, Lead, Segment, Variante } from "./types";

export type Bloc = {
  leads: number;
  contactes: number;
  reponses: number;
  rdv: number;
  desinscrits: number;
  taux: number | null; // réponses / contactés
};

export type Stats = {
  total: Bloc;
  segments: Record<Segment, Bloc>;
  variantes: Record<Variante, Bloc & { objet: string | null }>;
  relances: number;
  dernieresReponses: Lead[];
};

export function calculerStats(leads: Lead[], envois: Envoi[]): Stats {
  const premiers = envois.filter((e) => e.type === "premier");
  const contactes = new Set(premiers.map((e) => e.lead_id));

  const bloc = (sousEnsemble: Lead[]): Bloc => {
    const touches = sousEnsemble.filter((l) => contactes.has(l.id));
    const reponses = touches.filter((l) => STATUTS_REPONSE.includes(l.statut)).length;
    return {
      leads: sousEnsemble.length,
      contactes: touches.length,
      reponses,
      rdv: touches.filter((l) => l.statut === "rdv").length,
      desinscrits: touches.filter((l) => l.statut === "desinscrit").length,
      taux: touches.length ? reponses / touches.length : null,
    };
  };

  const objetDe = (v: Variante) => premiers.find((e) => e.variante === v)?.objet ?? null;

  return {
    total: bloc(leads),
    segments: {
      montagne: bloc(leads.filter((l) => l.segment === "montagne")),
      pme: bloc(leads.filter((l) => l.segment === "pme")),
    },
    variantes: {
      "1": { ...bloc(leads.filter((l) => l.variante === "1")), objet: objetDe("1") },
      "2": { ...bloc(leads.filter((l) => l.variante === "2")), objet: objetDe("2") },
    },
    relances: envois.filter((e) => e.type === "relance").length,
    dernieresReponses: leads
      .filter((l) => contactes.has(l.id) && (l.statut === "repondu" || l.statut === "rdv"))
      .sort((a, b) => b.maj_le.localeCompare(a.maj_le))
      .slice(0, 5),
  };
}
