# Site Luma

Site Next.js (App Router), Tailwind CSS v4, Motion et Geist. Design basé sur les maquettes Luma fournies en septembre 2026 : fond blanc cassé, titres bleu nuit, accent violet et mascotte.

## Démarrer

```bash
npm ci
npm run dev
```

```bash
npm run typecheck
npm run build
```

## Pages

- `/` : accueil, six usages concrets, aperçu WhatsApp, méthode, FAQ.
- `/solutions` : solutions et déploiement.
- `/agent-whatsapp` : mascotte, emplacement vidéo, carrousel de conversations, CRM filtrable et garantie.
- `/cas-clients` : parcours de réservation illustratif, identifié comme une démonstration.
- `/a-propos` : vision et méthode Luma.
- `/ressources` : trois guides et leurs pages dédiées.
- `/faq` : questions fréquentes.

La navigation et le formulaire d’audit sont partagés par toutes les pages. Le menu et le formulaire utilisent des dialogues natifs (focus contenu, Échap, restitution du focus). Le scroll reste natif, sans section épinglée ni texte qui disparaît au défilement. Les animations respectent `prefers-reduced-motion`. Le texte est présent dans le HTML avant JavaScript.

## Contenu à raccorder

Copier `.env.example` vers `.env.local` pour le développement et configurer les variables sur l’hébergement :

- `CONTACT_WEBHOOK_URL` : destination des demandes d’audit, POST JSON `{ sector, pain, contact, receivedAt, source }`. Sans destination, retour 503 ; une confirmation n’est affichée qu’après livraison réussie. Aucune coordonnée n’est journalisée en secours.
- `NEXT_PUBLIC_WHATSAPP_VIDEO_URL` : URL publique du MP4. Sans vidéo, le visuel indique « Présentation vidéo à venir » et propose de consulter les conversations. Aucun faux lecteur.

Les conversations et les profils CRM sont des exemples fictifs explicitement identifiés. Les logos et témoignages restent masqués tant que les données réelles ne sont pas renseignées dans `lib/content.ts`. Aucun logo de grand compte ni résultat chiffré de la maquette n’est présenté comme une référence réelle. La garantie de 14 jours reprend le texte de la maquette fournie ; son périmètre commercial doit correspondre aux conditions de vente de Luma.

La nouvelle mascotte `public/images/luma-whatsapp.webp` est une illustration générée à partir de la maquette fournie, utilisée sur le site. Les anciens visuels d’accueil restent ceux du dépôt (basse résolution).
