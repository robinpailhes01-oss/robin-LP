# Réel Instagram · Harmonie Yacht

Il existe deux versions de ce réel :

- **`reel2.html`, la version actuelle :** elle présente l'outil complet. Elle montre le marketing et l'origine des clients, puis Léa, l'agent WhatsApp, ensuite la qualification, la note, la fiche client et la relance, et enfin les réservations et les finances.
- **`reel.html`, la première version :** elle est centrée sur la conversation.

Les captures du tableau de bord, dans `dash/`, sont anonymisées : les leads ont des prénoms fictifs et tous les montants en euros sont floutés. Les captures d'origine ne sont pas dans le dépôt.

Format 1080 × 1920, à 60 images par seconde, d'environ 58 secondes, avec voix off, sons et sous-titres incrustés.

- **Captures réelles** : `caps/` contient des captures du site public harmonie-yacht.fr, prises avec `cap.js`. Ce sont la page d'accueil, les tarifs et la réservation.
- **Reconstitutions** : la conversation WhatsApp, le calendrier, la météo et le tableau de bord sont des reconstitutions, signalées comme telles à l'écran. Il suffit de les remplacer par de vraies captures anonymisées dès qu'elles sont disponibles.
- **Synchronisation** : `cues.js` contient les repères de la voix off et les sous-titres. `sfx.js` génère les sons et `render.js` exporte l'image.

```bash
cd motion/reel-harmonie-yacht
npm i --no-save playwright-core ffmpeg-static
node sfx.js && FPS=60 OUT=reel-muet.mp4 node render.js
```

Le mixage de la voix et des sons, puis leur ajout à l'image, se font comme pour la vidéo principale : voix décalée de 0,5 s, normalisation à −14 LUFS pour Instagram.
