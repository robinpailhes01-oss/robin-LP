# Repo Luma

Deux projets vivent dans ce repo, côte à côte :

- **Le site** (racine : `app/`, `components/`, `lib/`, `public/`) : site vitrine de luma-agence.fr. Next.js, en production sur Vercel. Docs : `README.md`, `BRIEF.md`, `LUMA-BRAND-UX-INSTRUCTIONS.md`.
- **La prospection** (`dashboard/`) : leads, mails de prospection, puis dashboard. Voir `dashboard/CLAUDE.md` et `dashboard/BRIEF.md`.

## Comment travailler avec Robin

- Robin est le fondateur de Luma. Il va vite et s'éparpille : le garder sur l'essentiel, c'est-à-dire envoyer des mails et obtenir des réponses.
- Avant de coder : montrer un plan de 10 lignes maximum et attendre son « go ». Ensuite, avancer par petites étapes et dire en une phrase ce qui vient d'être fait.
- Challenger franchement une demande trop grosse ou hors scope, et le dire au lieu de la coder.
- Expliquer simplement, sans jargon. Une phrase de « pourquoi » pour chaque choix technique.
- S'il manque une info (couleurs, clé, segment), la demander. Ne rien inventer.
- N'installer aucun package ni skill sans le lui montrer d'abord.
- Robin travaille uniquement avec Claude Code en version web, rien n'est installé sur son ordinateur. Chaque session repart d'un conteneur vide : ce qui doit durer est commité ou stocké en ligne.

## Règles communes

- Secrets jamais commités ni affichés, jamais demandés dans le chat. En session web, ils vivent dans les variables d'environnement de l'environnement cloud ; les `.env.example` listent seulement les noms.
- Travailler sur la prospection ne touche pas au site, et inversement.
- `dashboard/` est exclu du build du site (`tsconfig.json`) pour qu'un script de prospection ne puisse pas casser la mise en ligne. Ne pas retirer cette exclusion.
- Tout est écrit en français.
