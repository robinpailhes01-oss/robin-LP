# Vidéo de présentation Luma

Motion design de 38 secondes, en 1920 × 1080 et à 60 images par seconde. Il est animé en HTML, image par image, avec la charte du site : bleu nuit, bleu clair, Inter Tight et Inter.

- `luma.html` : la vidéo. Ouvrir `luma.html?play` dans un navigateur pour la voir en temps réel. Les textes et le minutage sont dans le script en bas du fichier.
- `render.js` : exporte la vidéo en MP4 avec Playwright et ffmpeg.

```bash
cd motion
npm i --no-save playwright-core ffmpeg-static
FPS=60 OUT=Luma-presentation-16x9.mp4 node render.js
```

Le chemin de Chromium est défini dans `render.js`. Il est à adapter hors de l'environnement Claude Code.
