/* Repères de la voix off du réel Harmonie Yacht v2 (secondes dans le fichier audio). */
(function (root) {
  const O = 0.5;
  const SEG = [
    ["A1", 0.00, 1.12, "Chez Harmonie Yacht,"],
    ["A2", 1.34, 3.49, "un seul outil gère toute la relation client."],
    ["A3", 3.88, 5.53, "Et il fait gagner 3 heures par jour."],
    ["B1", 6.14, 6.59, "D’abord,"],
    ["B2", 6.72, 7.47, "le marketing."],
    ["B3", 8.00, 9.32, "On sait d’où vient chaque client :"],
    ["B4", 9.79, 10.61, "bouche-à-oreille,"],
    ["B5", 10.83, 11.56, "Instagram,"],
    ["B6", 11.74, 12.33, "Google,"],
    ["B7", 12.50, 12.99, "TikTok…"],
    ["B8", 13.41, 14.41, "et dans quelle proportion."],
    ["C1", 15.06, 15.53, "Ensuite,"],
    ["C2", 15.74, 16.16, "Léa,"],
    ["C3", 16.33, 17.19, "l’agent WhatsApp."],
    ["C4", 17.68, 18.88, "Elle répond à tout le monde,"],
    ["C5", 19.00, 19.69, "à toute heure."],
    ["D1", 20.28, 22.47, "Elle vérifie les disponibilités et la météo,"],
    ["D2", 22.61, 23.86, "pour proposer le bon créneau."],
    ["E1", 24.46, 25.84, "Elle qualifie chaque demande :"],
    ["E2", 26.19, 26.75, "la date,"],
    ["E3", 26.92, 28.08, "le nombre de personnes,"],
    ["E4", 28.28, 28.88, "l’occasion."],
    ["E5", 29.40, 31.05, "Et elle donne une note à chaque lead."],
    ["F1", 31.66, 33.47, "Elle remplit elle-même la fiche client,"],
    ["F2", 33.59, 34.60, "dans le tableau de bord."],
    ["G1", 35.20, 36.55, "Puis elle relance au bon moment,"],
    ["G2", 36.70, 38.62, "pour transformer la demande en réservation."],
    ["H1", 39.19, 40.08, "Réservations,"],
    ["H2", 40.22, 41.61, "encaissements, finances :"],
    ["H3", 41.85, 42.86, "tout est au même endroit."],
    ["R1", 43.47, 44.09, "Résultat :"],
    ["R2", 44.44, 46.72, "162 conversations gérées par Léa,"],
    ["R3", 46.98, 48.52, "et 3 heures gagnées chaque jour."],
    ["I1", 49.18, 51.15, "Vous voulez le même outil pour votre entreprise ?"],
    ["I2", 51.65, 52.15, "Luma,"],
    ["I3", 52.35, 53.87, "agence IA à Montpellier."],
  ];
  const T = {};
  for (const [k, a] of SEG) T[k] = +(a + O).toFixed(3);
  const CAPTIONS = SEG.map(([, a, b, s]) => [a + O, b + O, s]);
  const CUES = { O, T, CAPTIONS, DURATION: 56.2 };
  if (typeof module !== "undefined") module.exports = CUES;
  else root.CUES = CUES;
})(this);
