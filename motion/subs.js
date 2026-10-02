const fs = require("fs");
const S = [
  [0.80, 4.54, "Quand on dirige une PME,\nla relation client, c’est le cœur de tout."],
  [5.10, 7.47 + 0.8, "Mais répondre aux messages, aux appels,\naux demandes de devis…"],
  [7.81 + 0.8, 10.32, "ça prend des heures, chaque jour."],
  [11.08, 13.60, "Luma, c’est une agence IA\nbasée à Montpellier."],
  [14.14, 18.99, "On crée des outils IA personnalisés, qui améliorent\net simplifient votre relation client."],
  [19.75, 20.73, "Votre client écrit."],
  [21.30, 23.61, "L’agent lui répond, avec vos informations."],
  [24.33, 25.61, "La demande est enregistrée."],
  [26.14, 27.03, "Et vous gardez la main."],
  [27.78, 33.51, "Chez Harmonie Yacht, un agent WhatsApp est connecté\nau calendrier, à la météo et au site internet."],
  [34.21, 39.86, "Il qualifie chaque demande, propose la meilleure prestation,\net les options qui font grimper le panier moyen."],
  [40.60, 44.67, "Trois heures gagnées par jour, sans rien perdre\nde la qualité de la relation client."],
  [45.41, 51.49, "Chez Énergies Concept, une vingtaine de commerciaux ont chacun\nleur espace, pour créer leurs bons de commande numériques."],
  [52.16, 55.62, "Plusieurs heures gagnées chaque jour,\net des dossiers traités sans erreur."],
  [56.46, 57.49, "Moins de temps perdu."],
  [58.08, 59.55, "Plus de temps pour l’essentiel."],
  [60.29, 64.66, "Luma. Des outils IA personnalisés\npour la relation client des PME."],
  [65.32, 66.80, "Parlons de votre projet."],
];
const ts = (x) => { const h = Math.floor(x / 3600), m = Math.floor(x / 60) % 60, s = (x % 60).toFixed(3).padStart(6, "0"); return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${s}`; };
fs.writeFileSync("Luma-presentation.fr.vtt", "WEBVTT\n\n" + S.map(([a, b, t], i) => `${i + 1}\n${ts(a)} --> ${ts(b)}\n${t}\n`).join("\n"));
fs.writeFileSync("Luma-presentation.fr.srt", S.map(([a, b, t], i) => `${i + 1}\n${ts(a).replace(".", ",")} --> ${ts(b).replace(".", ",")}\n${t}\n`).join("\n"));
console.log("ok", S.length);
