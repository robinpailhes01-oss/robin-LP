# prospection/

Rôle : récupérer les leads (Outscraper), préparer les mails, envoyer les lots (Resend) et noter les statuts (répondu, rdv, refus).

## Stack

- TypeScript exécuté par Node, comme le site : un seul langage dans le repo.
- Aucun package pour parler aux API : le `fetch` intégré à Node suffit pour Outscraper et Resend.
- Stockage : voir `../CLAUDE.md` (décision en attente).

## Règles

- Toute commande d'envoi tourne en dry-run par défaut. L'envoi réel exige une option explicite ET la validation de Robin pour ce lot précis.
- Aucun fait inventé dans un mail : chaque phrase de personnalisation garde sa source (URL du site ou avis Google du lead).
- Dédoublonner avant d'enregistrer un lead.
- Chaque appel Outscraper a un plafond de résultats, et le coût estimé est montré à Robin avant le lancement.
- Les données de prospects ne sont jamais commitées.

## Ne pas toucher

- Le site, à la racine du repo.
- `../app/` tant que la Phase 2 n'est pas lancée.
