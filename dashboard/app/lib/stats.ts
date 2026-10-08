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
  const premierDe = new Map<string, Envoi>();
  for (const e of premiers) if (!premierDe.has(e.lead_id)) premierDe.set(e.lead_id, e);
  const contactes = new Set(premierDe.keys());

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

  // Test en cours : l'objet du dernier premier mail envoyé dans chaque variante. On ne compte que les leads
  // qui ont reçu cet objet-là, pour ne jamais mélanger les résultats de deux objets différents.
  const testEnCours = (v: Variante) => {
    const envoisV = premiers.filter((e) => e.variante === v);
    if (!envoisV.length) return { ...bloc([]), objet: null };
    const dernier = envoisV.reduce((a, b) => ((b.envoye_le ?? "") >= (a.envoye_le ?? "") ? b : a));
    const recus = leads.filter((l) => {
      const p = premierDe.get(l.id);
      return p?.variante === v && p.objet === dernier.objet;
    });
    return { ...bloc(recus), objet: dernier.objet };
  };

  return {
    total: bloc(leads),
    segments: {
      montagne: bloc(leads.filter((l) => l.segment === "montagne")),
      pme: bloc(leads.filter((l) => l.segment === "pme")),
    },
    variantes: {
      "1": testEnCours("1"),
      "2": testEnCours("2"),
    },
    relances: envois.filter((e) => e.type === "relance").length,
    // Leads qui ont répondu et attendent une suite (même sans envoi enregistré, par exemple contactés à la main).
    dernieresReponses: leads
      .filter((l) => l.statut === "repondu")
      .sort((a, b) => (b.statut_le ?? b.maj_le).localeCompare(a.statut_le ?? a.maj_le))
      .slice(0, 5),
  };
}
