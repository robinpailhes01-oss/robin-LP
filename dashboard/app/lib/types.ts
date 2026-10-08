// Miroir des tables de dashboard/prospection/db/schema.sql.

export type Segment = "montagne" | "pme";
export type Statut = "nouveau" | "contacte" | "repondu" | "rdv" | "refus" | "desinscrit";
export type Variante = "1" | "2";

export type Lead = {
  id: string;
  nom: string;
  activite: string;
  segment: Segment;
  zone: string;
  site_web: string | null;
  emails: string[];
  telephone: string | null;
  adresse: string | null;
  nb_avis: number | null;
  note_google: number | null;
  source: string;
  score: number | null;
  score_justification: string | null;
  variante: Variante | null;
  statut: Statut;
  notes: string;
  statut_le: string | null;
  collecte_le: string;
  maj_le: string;
};

export type Message = {
  id: string;
  lead_id: string;
  lot: string;
  type: "premier" | "relance";
  variante: Variante;
  destinataire: string;
  objet: string;
  corps: string;
  statut: "brouillon" | "envoye" | "erreur";
  envoye_le: string | null;
  cree_le: string;
};

export type Envoi = Pick<Message, "lead_id" | "type" | "variante" | "objet" | "envoye_le">;

export type Evenement = {
  id: number;
  lead_id: string;
  type: "statut" | "note";
  detail: string;
  cree_le: string;
};
