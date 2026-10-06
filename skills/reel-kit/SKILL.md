---
name: reel-kit
description: Boîte à outils de montage des Reels de Robin (1080×1920) — textes stylés en PNG (titres avec ombre, cartons noir/blanc en capitales), texte qui passe derrière la personne, interface façon app (Claude « Good evening, Robin »), musique originale libre de droits calée sur les coupes, conversion HDR iPhone, polices prêtes. Utiliser dès qu'un Reel, une vidéo verticale ou un montage pour Instagram/TikTok a besoin de texte incrusté, de cartons, d'un effet « texte derrière le sujet », d'une musique sans droits ou d'une maquette d'interface, même si Robin ne cite pas ces termes. Sert aussi de base aux skills reel-remix et reel-ia-perso.
---

# Kit de montage Reels

Briques testées sur les Reels « locked in », « Good evening, Robin », « pause » et « chance ». Chaque script a son
mode d'emploi en tête de fichier.

| Besoin | Outil |
|---|---|
| Titre ou carton en image | `scripts/text_png.cjs spec.json` (police locale, ombre, fond plein ou transparent) |
| Texte derrière la personne | `scripts/text_behind.py video texte.png sortie.mp4` (détourage u2net ; garde le texte devant s'il serait illisible) |
| Musique libre calée sur les coupes | `scripts/music_synth.py reperes.json sortie.wav` |
| Interface façon app Claude | `assets/ui-app-claude.html` (modifier `#greet` et `#cap`, capture 1080×1920 avec Playwright ; classe `mask` sur `body` = masque de la carte vidéo) |
| Polices | `assets/fonts/` : Inter 400/700, Inter Tight 800, Roboto Condensed, Instrument Serif, Source Serif 4 |

## Recettes

- **Lisibilité sur vidéo** : blanc + `text-shadow: 0 3px 10px rgba(0,0,0,.75), 0 0 3px rgba(0,0,0,.6)` ; garder le
  texte hors des zones Instagram (haut ~250 px, bas ~420 px, droite ~120 px).
- **Cartons rythmés** : couleurs mesurées sur la référence (souvent `#070002` / `#fbf5fa`), texte en capitales
  Inter 700 ~34 px centré ; durées à l'image près (sortie de `reel-remix/scripts/find_cuts.py`).
- **HDR iPhone (HLG)** → SDR : `zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p`.
- **Look film** : `noise=alls=7:allf=t` + léger vignettage appliqué seulement aux plans filmés (pas aux cartons blancs,
  sinon coins gris).
- **Poids** : `-crf 19-21 -maxrate 12M -bufsize 24M` ; au-delà de 30 Mo l'envoi échoue.
- **Polices** : ne jamais appeler une `@font-face` `Serif` ou `Sans-serif` (mots réservés → Times silencieusement) ;
  ouvrir la page via un fichier, pas `setContent`, pour charger les polices locales.
- **Rendu image par image** (animations HTML) : page avec `window.render(t)`, captures Playwright envoyées à ffmpeg
  (`image2pipe`, mjpeg). Playwright : `NODE_PATH=/opt/node-tools/node_modules`.
- **Contrôle** : planche contact (`fps=4,scale=120:-1,tile=12x5`) + Whisper sur le mix si voix ; Claude ne peut pas
  écouter : le dire à Robin et lui demander de vérifier la musique.
