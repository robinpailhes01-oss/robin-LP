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

- Hero « conversation live » et section Problème : finis et animés.
- Les neuf autres sections : copy en place, sans animation, à finir.
- Formulaire conversationnel et route API : fonctionnels, destination à brancher.
