# Réel Instagram — présentation Luma (9:16)

Adaptation verticale (1080×1920, 60 fps, 38 s) de la vidéo de présentation v1. Elle a une voix off masculine (gérant de PME, la trentaine), une musique légère et des effets sonores calés sur le motion design. Se termine sur la signature standard (voir `../README.md`).

## Fichiers

- `reel.html` : l'animation, avec la même timeline que la v1 et des mises en page recomposées pour le vertical. Expose `render(t)`.
- `audio.js` : génère `audio/sfx3.wav` (effets) et `audio/music3.wav` (musique). La musique est à 100 BPM, une mesure de 2,4 s par accord : Dmaj7 – Bm7 – Gmaj7 – Asus2, puis Dmaj9 sur la signature. Elle comprend une nappe, une basse, un arpège et une pulsation légère. Tout est synthétisé, sans échantillon externe.
- `render.js` : capture chaque image avec Playwright et encode avec ffmpeg.
- `audio/voix-off.mp3` : la prise de voix off, faite avec Higgsfield (ElevenLabs, voix Julian).
- `mix.js` : découpe la voix phrase par phrase et pose chaque phrase sur sa scène. Les 4 étapes tombent sur l'allumage des pastilles et les 3 bénéfices sur leur titre. Il mixe aussi la musique et les effets (−9 dB, atténués sous la voix) et écrit `audio/final.wav` et les sous-titres `Luma-presentation-reel.fr.vtt`.

## Rendu

```bash
node audio.js                       # effets + musique
node render.js                      # → Luma-presentation-reel-9x16.mp4 (sans son)
ffmpeg -i audio/music3.wav -i audio/sfx3.wav -filter_complex \
  "[1]asplit[s][key];[0]volume=-5dB,highpass=f=35[m];[m][key]sidechaincompress=threshold=0.03:ratio=3:attack=5:release=250[md];[md][s]amix=inputs=2:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1.5:LRA=11" \
  -ar 48000 audio/mix3.wav          # musique + effets
node mix.js                         # + voix off → audio/final.wav
ffmpeg -i Luma-presentation-reel-9x16.mp4 -i audio/final.wav -map 0:v -map 1:a -c:v copy \
  -af apad -c:a aac -b:a 192k -t 38 -movflags +faststart final.mp4
```

Le mix vise −14 LUFS (Instagram). La musique passe sous les effets, et l'ensemble passe sous la voix grâce au sidechain.
