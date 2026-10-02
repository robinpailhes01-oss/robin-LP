# Réel Instagram — présentation Luma (9:16)

Adaptation verticale (1080×1920, 60 fps, 38 s) de la vidéo de présentation v1, avec une musique légère et des effets sonores calés sur le motion design. Se termine sur la signature standard (voir `../README.md`).

## Fichiers

- `reel.html` : l'animation, avec la même timeline que la v1 et des mises en page recomposées pour le vertical. Expose `render(t)`.
- `audio.js` : génère `audio/sfx3.wav` (effets) et `audio/music3.wav` (musique). La musique est à 100 BPM, une mesure de 2,4 s par accord : Dmaj7 – Bm7 – Gmaj7 – Asus2, puis Dmaj9 sur la signature. Elle comprend une nappe, une basse, un arpège et une pulsation légère. Tout est synthétisé, sans échantillon externe.
- `render.js` : capture chaque image avec Playwright et encode avec ffmpeg.

## Rendu

```bash
node audio.js
node render.js                      # → Luma-presentation-reel-9x16.mp4 (sans son)
ffmpeg -i audio/music3.wav -i audio/sfx3.wav -filter_complex \
  "[1]asplit[s][key];[0]volume=-5dB,highpass=f=35[m];[m][key]sidechaincompress=threshold=0.03:ratio=3:attack=5:release=250[md];[md][s]amix=inputs=2:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1.5:LRA=11" \
  -ar 48000 audio/mix3.wav
ffmpeg -i Luma-presentation-reel-9x16.mp4 -i audio/mix3.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest final.mp4
```

Le mix vise −14 LUFS (Instagram). La musique passe légèrement sous les effets grâce au sidechain.
