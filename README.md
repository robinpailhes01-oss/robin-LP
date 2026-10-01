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

- `CONTACT_WEBHOOK_URL` : destination des demandes du panneau « Préparer notre échange » (POST JSON `{ kind: "mini-audit", contact, answers, receivedAt, source }`). Si vide, la demande est journalisée côté serveur.

## Périmètre actuel

- Accueil : hero, besoins, exemple de fonctionnement, à propos, accompagnement, réalisations, FAQ, contact.
- Pages : `/agent-whatsapp`, `/cas-clients`, `/cas-clients/[slug]`, `/methode`.

À fournir :
- de nouvelles photos de Robin en lumière naturelle, tenue blanche ou bleu marine : un plan large, une photo en situation de travail, un détail (mains, écran, carnet) ;
- des témoignages réels et autorisés, avec nom, fonction et entreprise ;
- un logo Énergies Concept en haute résolution et un logo Barber Saint-Anne ;
- les vidéos (agent WhatsApp, réalisations) : `videoUrl` dans `lib/content.ts`, le bloc s’affiche dès qu’une URL est renseignée ;
- la destination des demandes de contact (`CONTACT_WEBHOOK_URL`).
