/* Repères de la voix off du réel Harmonie Yacht (secondes dans le fichier audio). */
(function (root) {
  const O = 0.5;
  const R = {
    S1: 0, S2: 4.20, S2b: 5.14, S2c: 6.69, S2d: 7.73,
    S3: 9.16, S3a: 12.11, S3b: 12.79, S3c: 13.64, S3d: 14.31,
    S4: 15.57, S4b: 18.34,
    S5: 19.62, S5b: 20.95,
    S6: 23.45, S6b: 24.66,
    S7: 26.74,
    S8: 29.53, S8b: 31.17, S8c: 32.34,
    S9: 33.66, S9b: 35.98, S9c: 37.83, S9d: 38.85, S9e: 39.68,
    S10: 40.86, S10b: 42.30,
    S11: 45.22, S11b: 46.28, S11c: 47.77,
    S12: 50.60, S12b: 53.08, S12c: 53.74, END: 55.41,
  };
  const CAPTIONS = [
    [0.00, 1.75, "Cet agent WhatsApp fait gagner"],
    [1.75, 3.58, "3 heures par jour à Harmonie Yacht."],
    [4.20, 4.99, "Harmonie Yacht,"],
    [5.14, 6.59, "c’est un yacht avec skipper,"],
    [6.69, 7.57, "au port de Carnon,"],
    [7.73, 8.53, "près de Montpellier."],
    [9.16, 11.83, "Avant, chaque demande, c’était de longs allers-retours :"],
    [12.11, 12.62, "la date,"],
    [12.79, 13.42, "la météo,"],
    [13.64, 14.12, "le prix,"],
    [14.31, 14.89, "les options."],
    [15.57, 18.23, "Aujourd’hui, c’est un agent IA qui répond sur WhatsApp,"],
    [18.34, 18.99, "à toute heure."],
    [19.62, 20.79, "Il regarde le calendrier,"],
    [20.95, 22.74, "et propose uniquement les créneaux libres."],
    [23.45, 24.56, "Il vérifie la météo,"],
    [24.66, 26.06, "pour conseiller le meilleur moment."],
    [26.74, 28.96, "Il connaît toutes les offres et les tarifs du site."],
    [29.53, 30.78, "Il pose les bonnes questions :"],
    [31.17, 32.10, "combien de personnes,"],
    [32.34, 32.98, "quelle occasion."],
    [33.66, 35.69, "Puis il propose la sortie la plus adaptée,"],
    [35.98, 37.38, "et les options qui font plaisir :"],
    [37.83, 38.75, "plateau de tapas,"],
    [38.85, 39.50, "champagne,"],
    [39.68, 40.16, "paddle."],
    [40.86, 42.16, "Le client réserve en ligne,"],
    [42.30, 44.62, "et la demande arrive complète dans le tableau de bord."],
    [45.22, 45.79, "Résultat :"],
    [46.28, 47.63, "3 heures gagnées chaque jour,"],
    [47.77, 49.89, "sans perdre la qualité de la relation client."],
    [50.60, 52.54, "Vous voulez le même agent pour votre entreprise ?"],
    [53.08, 53.53, "Luma,"],
    [53.74, 55.41, "agence IA à Montpellier."],
  ];
  const T = {};
  for (const k in R) T[k] = +(R[k] + O).toFixed(3);
  const CUES = { O, R, T, CAPTIONS: CAPTIONS.map(([a, b, s]) => [a + O, b + O, s]), DURATION: 57.6 };
  if (typeof module !== "undefined") module.exports = CUES;
  else root.CUES = CUES;
})(this);
