# app/ : le dashboard

Lancé le 8 octobre 2026 à la demande explicite de Robin, en parallèle de la Phase 1, pendant qu'il récupère les clés. Les scripts d'envoi restent la priorité : le dashboard ne fait partir aucun mail.

## Stack
- App Next.js séparée du site (son propre `package.json`), avec les mêmes briques que le site : Next 16, React 19, Tailwind v4, Geist. Aucun package de plus.
- Données : Supabase via son API REST avec `fetch`, côté serveur uniquement (`lib/db.ts`), donc pas de client Supabase à installer. Sans `SUPABASE_URL` ni `SUPABASE_SECRET_KEY`, l'app tourne sur les données fictives de `lib/demo.ts` et n'enregistre rien.
- Protection : `proxy.ts` demande un mot de passe (`DASHBOARD_PASSWORD`). Sans mot de passe, l'app ne s'ouvre qu'en démo ; avec Supabase branché, elle reste fermée.
- Design : voir `DESIGN.md`. Tokens dans `app/globals.css`, repris de la charte du site.

## Écrans
- `/` : taux de réponse, chiffres clés, du lead au rendez-vous, par variante (compteur des 100 envois), par segment, réponses à traiter.
- `/leads` : liste filtrable par segment, activité, zone et statut, plus recherche par nom. Les filtres vivent dans l'URL.
- `/leads/[id]` : fiche lead (contact, score, historique), avec le statut et les notes modifiables. Passer un lead en « Désinscrit » met ses adresses dans la liste de suppression.

## Commandes (depuis `dashboard/app/`)
- `npm install`, puis `npm run dev` (port 3001), `npm run build`, `npm run typecheck`.
- Mise en ligne prévue : un second projet Vercel dont le dossier racine est `dashboard/app`, avec les variables d'environnement de `../.env.example`. Ne pas le créer sans l'accord de Robin.

## Ne pas toucher
- Le site, à la racine du repo.
- Les scripts de `../prospection/`. Le dashboard lit les données et n'écrit que les statuts, les notes et la liste de suppression.
