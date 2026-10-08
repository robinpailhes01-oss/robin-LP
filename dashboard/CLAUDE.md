# Prospection Luma

Rôle : trouver des leads, préparer et envoyer des mails de prospection, suivre les réponses.
Le brief complet et les décisions prises sont dans `BRIEF.md` : le relire avant toute nouvelle étape, et y noter chaque décision de Robin.

## Organisation

- `prospection/` : scripts, agents, données. Phase 1.
- `app/` : le dashboard. Phase 2, pas avant le feu vert de Robin ET l'envoi du premier lot.
- Les sous-agents sont dans `.claude/agents/` à la racine du repo : lead-scout et mail-writer, puis analyste et explorateur en Phase 3. Chacun n'a que les outils strictement nécessaires.

## Ordre imposé

Phase 1 : leads + mails prêts à envoyer. Phase 2 : dashboard v1. Phase 3 : rapports et agents. Ne sauter aucune étape.

## Règles d'envoi (non négociables)

- Dry-run par défaut. Aucun envoi réel sans validation explicite de Robin, lot par lot.
- Chaque mail porte l'identité claire de l'expéditeur et un lien de désinscription. La liste de suppression est appliquée automatiquement.
- Démarrage progressif : une vingtaine de mails le premier jour.
- Pas de pixel d'ouverture. La métrique principale, ce sont les réponses.
- Segment A (PME à l'année) : aucun envoi tant que Robin n'a pas dit go.
- Resend peut fermer le compte sans prévenir au-delà de 0,08 % de plaintes ou 4 % de rebonds : vérifier les adresses avant envoi et garder de petits volumes.

## Stockage

Décision en attente. SQLite local est impossible, car Robin n'utilise que la version web et le conteneur s'efface à chaque session. Option recommandée : Supabase.
