# Site Luma

Site de Luma, l’offre d’agents IA et d’automatisations de Robin Pailhes. La direction artistique en vigueur est dans `DIRECTION-ARTISTIQUE.md`. `BRIEF.md` et `LUMA-BRAND-UX-INSTRUCTIONS.md` sont conservés pour le positionnement, mais leurs parties palette et mascotte sont remplacées.

## Stack

Next.js (App Router) · Tailwind CSS v4 · Motion · Inter et Inter Tight. Déploiement sur Vercel.

## Lancer

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Variables d’environnement

Copier `.env.example` en `.env.local`.

Parcours : chaque bouton « Faire mon audit gratuit » mène à `/audit` (la VSL, `vsl.url` dans `lib/content.ts`), puis à l’audit en ligne `/audit/en-ligne` ou à la réservation d’un appel (`booking.url` : lien Calendly, Cal.com… ; vide = l’assistant recueille un numéro). `/video` redirige vers `/audit`.

Les demandes du site arrivent sur `/api/contact` : `mini-audit` (coordonnées en fin de mini-audit, avec réponses et estimation), `rappel` (bouton « Être rappelé par Robin » du résultat) et `assistant` (panneau « Assistant de Robin »). Chaque destination est active si ses variables sont renseignées :

- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` : une ligne par demande dans la table `leads`. Créer la table avec `supabase/migrations/20261008000000_leads.sql` (RLS activé, aucune politique : seule la clé service, côté serveur, peut écrire et lire). Ne jamais exposer la clé service en `NEXT_PUBLIC_`.
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` : notification instantanée à chaque demande, les rappels en tête et les échéances « Dès que possible » signalées.
- `CONTACT_WEBHOOK_URL` : relais libre facultatif (POST JSON).

Sans aucune destination, la demande est journalisée côté serveur. Si toutes les destinations configurées échouent, l’API répond 502 et le visiteur peut réessayer.

## Périmètre actuel

- Accueil : hero, besoins, exemple de fonctionnement, à propos, accompagnement, réalisations, FAQ, contact.
- Pages : `/agent-whatsapp`, `/cas-clients`, `/cas-clients/[slug]`, `/methode`.

À fournir :
- de nouvelles photos de Robin en lumière naturelle, tenue blanche ou bleu marine : un plan large, une photo en situation de travail, un détail (mains, écran, carnet) ;
- des témoignages réels et autorisés, avec nom, fonction et entreprise ;
- un logo Énergies Concept en haute résolution et un logo Barber Saint-Anne ;
- les vidéos (agent WhatsApp, réalisations) : `videoUrl` dans `lib/content.ts`, le bloc s’affiche dès qu’une URL est renseignée ;
- la destination des demandes de contact (`CONTACT_WEBHOOK_URL`).
