---
name: reel-remix
description: Refait un Reel/TikTok tendance avec la propre vidéo de Robin, sans IA ni crédits — on garde de la référence ce qui doit rester (musique, écran de téléphone, cartons noirs et blancs…), on remplace la personne par la vidéo de Robin, on traduit les textes en français dans la même typo, calé à l'image près. Utiliser dès que Robin envoie un Reel de référence (fichier .mp4 ou lien Drive) avec « refais ce réel », « fais exactement pareil », « remplace la personne par moi / par ma vidéo », « garde la musique », « mets le titre en français », « recopie ce trend », même s'il ne dit pas « montage ». Ne pas utiliser quand il faut générer des images ou des vidéos de Robin par IA (voir reel-ia-perso).
---

# Refaire un Reel avec la vidéo de Robin

Robin (Luma, agence IA à Montpellier) repère des Reels tendance et veut la même chose avec lui à l'écran. La valeur
est dans la fidélité : même rythme, mêmes coupes, même musique, même typo — seul le sujet change. Tout se fait
au montage avec ffmpeg, **sans Higgsfield ni crédits**, sauf demande explicite.

## Déroulé

1. **Récupérer les fichiers.** Pièce jointe : elle est dans `/root/.claude/uploads/…`. Lien Drive :
   `curl -sSL -o ref.mp4 "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t"`.
   Ranger chaque fichier dans son propre dossier (`src/<nom>/`), jamais dans le dépôt Git (vidéos de tiers, poids).
   Si Robin dit « attends ma vidéo », préparer l'analyse et les textes mais **ne rien générer** avant de l'avoir.

2. **Analyser la référence.**
   - `python3 scripts/find_cuts.py ref.mp4 --planches build/planches` : coupes à l'image près, durée et couleur de
     chaque passage, planche de vérification. Ouvrir `planche.jpg` pour lire les textes de chaque passage.
   - Pour un plan qui contient du mouvement (téléphone pris/posé), faire une planche 10 i/s avec le temps incrusté :
     `ffmpeg -ss A -i x -t 3 -vf "fps=10,scale=160:-1,drawtext=text='%{pts\:flt}':x=4:y=4:fontsize=18:fontcolor=red,tile=10x3" -frames:v 1 p.jpg`
     (le temps affiché est relatif à A).
   - Mesurer la typo sur une image pleine taille : position verticale, taille, graisse, ombre, couleurs des cartons
     (le script donne la couleur RGB du coin).

3. **Résumer le plan à Robin en un tableau** (passage → ce qui est gardé / remplacé) et ce dont on a besoin dans sa
   vidéo (ex. « le moment où vous prenez le téléphone »). Il valide vite ; ça évite de refaire.

4. **Choisir les moments dans la vidéo de Robin.** Les raccords doivent tomber sur l'action : on coupe au moment où
   il lève le téléphone, on reprend au moment où il l'a encore en main pour le poser. Le passage remplacé garde la
   **durée exacte** de la référence pour que la musique reste calée : `debut = moment_clé − durée`.
   On ne montre jamais la personne de la référence (Robin l'a demandé explicitement).

5. **Textes en français** avec `scripts/text_png.cjs` (calque transparent ou carton plein). Polices disponibles dans
   `assets/fonts/` de ce skill (Inter 700, Roboto Condensed) et, pour plus de choix, celles du skill `reel-kit` : Inter 700 (titres façon Instagram, cartons en capitales), Roboto Condensed
   (titres condensés), Inter Tight 800, Instrument Serif, Source Serif 4.
   - Garder la même place et le même style ; Robin veut le titre **plus lisible** que l'original : un peu plus grand
     et `"shadow": true`.
   - Traduire naturellement, pas mot à mot (« GET CALLED LUCKY. » → « ON DIT QUE T'AS EU DE LA CHANCE. »).
   - Ne jamais nommer une police `Serif`/`Sans-serif` dans un `@font-face` : c'est un mot réservé, la police tombe en
     Times sans erreur. Le script vérifie le chargement et prévient.

6. **Assembler** : écrire un `edl.json` (format en tête de `scripts/assemble.py`) puis `python3 scripts/assemble.py edl.json`.
   Le script convertit seul les vidéos iPhone HDR (HLG), recadre en 9:16, pose les calques, fondus, musique de la
   référence (`"audio": {"src": "ref.mp4"}`).

7. **Vérifier avant d'envoyer** : planche contact du résultat (`fps=4,tile`), une image pleine taille du titre,
   durée identique à la référence (± 1 image). Taille < 30 Mo (sinon `-crf 21 -maxrate 12M`).

8. **Livrer** avec SendUserFile, un court tableau de ce qui a été fait, et proposer un ajustement précis
   (raccord plus tôt/tard, traduction). Committer les scripts/JSON (pas les médias) sur la branche de travail.

## Pièges connus

- `select=gt(scene,…)` rate les coupes sombres (vidéo de nuit → carton noir) : utiliser `find_cuts.py`.
- `page.setContent()` ne charge pas les polices locales : le script écrit un fichier HTML puis `goto`.
- Les vidéos iPhone sont en HLG 10 bits : sans conversion elles sortent grises et délavées.
- La musique de la référence n'appartient pas à Robin : la garder quand il le demande (le format trend le veut),
  et rappeler qu'il peut aussi utiliser « Utiliser cet audio » dans Instagram.
