// Données FICTIVES, affichées tant que Supabase n'est pas branché.
// Noms inventés, adresses mail en .example (réservé, ne mène nulle part),
// téléphones dans la plage réservée à la fiction par l'ARCEP (04 65 71 xx xx).

import type { Evenement, Lead, Message, Segment, Statut, Variante } from "./types";

type Ligne = [nom: string, activite: string, zone: string, avis: number, note: number, score: number, justification: string];

const MONTAGNE: Ligne[] = [
  ["Le Refuge des Marmottes", "Restaurant d'altitude", "Alpe d'Huez", 412, 4.6, 9, "Réservation par téléphone uniquement, 412 avis, ouvert midi et soir."],
  ["Chalet Les Airelles Blanches", "Hôtel", "Alpe d'Huez", 238, 4.4, 8, "Formulaire de contact sans réponse automatique, 238 avis."],
  ["Spa du Pic Blanc", "Spa", "Alpe d'Huez", 156, 4.7, 8, "Prise de rendez-vous par téléphone, créneaux complets en saison."],
  ["La Bergerie d'Huez", "Restaurant", "Alpe d'Huez", 527, 4.3, 9, "527 avis, réservations par téléphone, plusieurs services par soir."],
  ["Gîte du Col de Sarenne", "Gîte", "Alpe d'Huez", 64, 4.8, 6, "Petit volume, réservations par mail."],
  ["École de ski Altitude Libre", "École de ski indépendante", "Alpe d'Huez", 189, 4.9, 7, "Inscriptions par téléphone, pas de réservation en ligne."],
  ["Les Écrins Gourmands", "Restaurant", "Alpe d'Huez", 301, 4.5, 8, "301 avis, réservation par téléphone uniquement."],
  ["Hôtel Le Belvédère des Rousses", "Hôtel", "Alpe d'Huez", 344, 4.2, 7, "Réception ouverte en journée seulement."],
  ["Chambres d'hôtes La Sapinière", "Chambre d'hôtes", "Alpe d'Huez", 48, 4.9, 5, "Faible volume de demandes."],
  ["Glisse & Montagne Location", "Loueur de matériel", "Alpe d'Huez", 211, 4.4, 6, "Réservation en ligne déjà en place."],
  ["Le Balcon des Grandes Rousses", "Restaurant d'altitude", "Alpe d'Huez", 389, 4.5, 9, "389 avis, réservation par téléphone, terrasse très demandée."],
  ["Spa Nordique L'Ourson", "Spa", "Alpe d'Huez", 97, 4.6, 7, "Rendez-vous par téléphone."],
  ["Résidence Le Grand Sertz", "Hôtel", "Alpe d'Huez", 176, 4.1, 6, "Réservations via plateformes surtout."],
  ["La Table du Signal", "Restaurant", "Alpe d'Huez", 265, 4.6, 8, "265 avis, réservation par téléphone."],
  ["Gîte Le Clos des Bouquetins", "Gîte", "Alpe d'Huez", 39, 4.7, 5, "Faible volume."],
  ["École de ski Pente Douce", "École de ski indépendante", "Alpe d'Huez", 142, 4.8, 7, "Inscriptions par téléphone et mail."],
  ["Le Chamois Doré", "Restaurant d'altitude", "Alpe d'Huez", 455, 4.4, 9, "455 avis, réservation par téléphone uniquement."],
  ["Hôtel Les Mélèzes Bleus", "Hôtel", "Alpe d'Huez", 290, 4.5, 8, "Formulaire de contact, pas de chat."],
  ["Bien-être Altitude 1860", "Spa", "Alpe d'Huez", 73, 4.8, 6, "Rendez-vous par téléphone."],
  ["Le Fournil des Neiges", "Restaurant", "Alpe d'Huez", 198, 4.3, 6, "Peu de réservations, surtout du passage."],
  ["Chalet-gîte La Croix de Cassini", "Gîte", "Alpe d'Huez", 52, 4.6, 5, "Faible volume."],
  ["Ski Shop Les Bergers", "Loueur de matériel", "Alpe d'Huez", 164, 4.2, 5, "Réservation en ligne déjà en place."],
  ["La Grange du Lac Blanc", "Restaurant d'altitude", "Alpe d'Huez", 233, 4.7, 8, "233 avis, réservation par téléphone."],
  ["Hôtel Les Trois Glaciers", "Hôtel", "Alpe d'Huez", 121, 4.0, 6, "Réception en journée seulement."],
  ["Le Panoramique 2100", "Restaurant d'altitude", "Les Deux Alpes", 367, 4.4, 8, "367 avis, réservation par téléphone."],
  ["Spa Les Cimes", "Spa", "Les Deux Alpes", 88, 4.5, 6, "Rendez-vous par téléphone."],
  ["Gîte de la Muzelle", "Gîte", "Les Deux Alpes", 41, 4.8, 5, "Faible volume."],
  ["Hôtel L'Alpe Lumière", "Hôtel", "Les Deux Alpes", 209, 4.3, 7, "Formulaire de contact sans réponse automatique."],
  ["École de ski Freeride Vénéon", "École de ski indépendante", "Les Deux Alpes", 133, 4.9, 6, "Inscriptions par téléphone."],
  ["La Cabane des Crêtes", "Restaurant d'altitude", "Les Deux Alpes", 278, 4.6, 7, "278 avis, réservation par téléphone."],
];

const PME: Ligne[] = [
  ["Atelier Vétérinaire des Arceaux", "Clinique vétérinaire", "Montpellier", 211, 4.7, 7, "Standard saturé aux heures de pointe selon les avis."],
  ["Cabinet Dentaire Antigone Sourire", "Cabinet dentaire", "Montpellier", 158, 4.5, 6, "Rendez-vous par téléphone."],
  ["Garage Méditerranée Auto", "Garage automobile", "Nîmes", 302, 4.3, 7, "Devis par téléphone uniquement."],
  ["Immobilier Capitole Conseil", "Agence immobilière", "Toulouse", 96, 4.6, 6, "Formulaire de contact simple."],
  ["Institut Beauté Promenade", "Institut de beauté", "Nice", 241, 4.8, 7, "Rendez-vous par téléphone."],
  ["Location Riviera Nautic", "Location de bateaux", "Antibes", 187, 4.6, 8, "Activité proche du cas Harmonie Yacht."],
  ["Clinique Vétérinaire du Suquet", "Clinique vétérinaire", "Cannes", 134, 4.4, 6, "Rendez-vous par téléphone."],
  ["Auto-école Garrigue", "Auto-école", "Nîmes", 276, 4.5, 6, "Inscriptions par téléphone."],
  ["Traiteur Les Saveurs d'Oc", "Traiteur", "Toulouse", 119, 4.7, 5, "Devis par mail."],
  ["Conciergerie Baie des Anges", "Conciergerie", "Nice", 68, 4.9, 7, "Demandes par WhatsApp et mail."],
];

const CP: Record<string, string> = {
  "Alpe d'Huez": "38750 L'Alpe d'Huez",
  "Les Deux Alpes": "38860 Les Deux Alpes",
  Montpellier: "34000 Montpellier",
  Nîmes: "30000 Nîmes",
  Toulouse: "31000 Toulouse",
  Nice: "06000 Nice",
  Antibes: "06600 Antibes",
  Cannes: "06400 Cannes",
};

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const jour = (j: number, h = 9) => new Date(Date.UTC(2026, 9, j, h - 2, 0)).toISOString(); // heure de Paris

function creer(l: Ligne, i: number, segment: Segment, collecte: string): Lead {
  const [nom, activite, zone, avis, note, score, justification] = l;
  const s = slug(nom);
  return {
    id: `demo-${String(i + 1).padStart(2, "0")}`,
    nom,
    activite,
    segment,
    zone,
    site_web: `https://${s}.example`,
    emails: [`contact@${s}.example`],
    telephone: `04 65 71 ${String(10 + i).padStart(2, "0")} ${String(20 + i).padStart(2, "0")}`,
    adresse: CP[zone] ?? zone,
    nb_avis: avis,
    note_google: note,
    source: "outscraper",
    score,
    score_justification: justification,
    variante: (i % 2 === 0 ? "1" : "2") as Variante,
    statut: "nouveau",
    notes: "",
    collecte_le: collecte,
    maj_le: collecte,
  };
}

export const demoLeads: Lead[] = [
  ...MONTAGNE.map((l, i) => creer(l, i, "montagne", jour(0, 8))),
  ...PME.map((l, i) => creer(l, MONTAGNE.length + i, "pme", jour(3, 8))),
];

export const demoMessages: Message[] = [];
export const demoEvenements: Evenement[] = [];

// Lot 1 : 20 leads le 1er octobre. Lot 2 : 4 leads le 6 octobre.
demoLeads.slice(0, 24).forEach((lead, i) => {
  const lot1 = i < 20;
  const j = lot1 ? 1 : 6;
  lead.statut = "contacte";
  lead.maj_le = jour(j, 10);
  demoMessages.push({
    id: `demo-m-${lead.id}`,
    lead_id: lead.id,
    lot: lot1 ? "2026-10-01-lot1" : "2026-10-06-lot2",
    type: "premier",
    variante: lead.variante!,
    destinataire: lead.emails[0],
    objet: `Objet de démonstration, variante ${lead.variante}`,
    corps: "Corps de démonstration. Le vrai texte sera rédigé par mail-writer, puis relu par Robin.",
    statut: "envoye",
    envoye_le: jour(j, 10),
    cree_le: jour(j, 9),
  });
});

const changements: [index: number, statut: Statut, j: number][] = [
  [0, "rdv", 3],
  [3, "repondu", 2],
  [10, "repondu", 4],
  [16, "refus", 2],
  [8, "desinscrit", 1],
];
for (const [i, statut, j] of changements) {
  const lead = demoLeads[i];
  lead.statut = statut;
  lead.maj_le = jour(j, 15);
  if (statut === "rdv") {
    demoEvenements.push({ id: demoEvenements.length + 1, lead_id: lead.id, type: "statut", detail: "Répondu", cree_le: jour(j - 1, 18) });
  }
  demoEvenements.push({ id: demoEvenements.length + 1, lead_id: lead.id, type: "statut", detail: statut === "rdv" ? "RDV" : statut === "repondu" ? "Répondu" : statut === "refus" ? "Refus" : "Désinscrit", cree_le: lead.maj_le });
}
demoLeads[0].notes = "Démo : RDV visio prévu, préparer l'exemple des réservations du soir.";
demoEvenements.push({ id: demoEvenements.length + 1, lead_id: demoLeads[0].id, type: "note", detail: "Notes modifiées", cree_le: jour(3, 16) });

// Relance J+3 pour les leads du lot 1 toujours sans réponse.
demoLeads.slice(0, 20).forEach((lead) => {
  if (lead.statut !== "contacte") return;
  demoMessages.push({
    id: `demo-r-${lead.id}`,
    lead_id: lead.id,
    lot: "2026-10-04-relance1",
    type: "relance",
    variante: lead.variante!,
    destinataire: lead.emails[0],
    objet: `Relance de démonstration, variante ${lead.variante}`,
    corps: "Relance de démonstration.",
    statut: "envoye",
    envoye_le: jour(4, 10),
    cree_le: jour(4, 9),
  });
});
