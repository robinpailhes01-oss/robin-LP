# Site Luma

Site vitrine de l’agence Luma. Les décisions de design sont dans `BRIEF.md`, le positionnement et la copy dans `LUMA-BRAND-UX-INSTRUCTIONS.md`.

## Stack

Next.js (App Router) · Tailwind CSS v4 · Motion · Geist. Déploiement prévu sur Vercel.

## Lancer

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Variables d’environnement

Copier `.env.example` en `.env.local`.

- `CONTACT_WEBHOOK_URL` : destination des demandes du formulaire « Parler de mon entreprise » (POST JSON `{ sector, pain, contact, receivedAt, source }`). Si vide, la demande est journalisée côté serveur.

## Périmètre actuel

Page de vente reproduite d’après la maquette du 19/09 : hero, logos, expertise, bandeau partenaire, témoignages, méthode, FAQ, CTA final.

À fournir pour finir la page :
- les logos clients (`logos.items` dans `lib/content.ts`, fichiers dans `public/logos/`) ;
- les témoignages réels (`testimonials.items`) ;
- la vidéo de 2 minutes du hero ;
- les images du hero et du bandeau en haute résolution (celles en place sont découpées dans la maquette).
