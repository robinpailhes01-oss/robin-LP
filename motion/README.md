# Vidéo de présentation Luma

Motion design de 68 secondes, en 1920 × 1080 et à 60 images par seconde, avec voix off, sons et sous-titres. La vidéo est animée en HTML image par image, avec la charte du site : bleu nuit, bleu clair, Inter Tight et Inter.

| Fichier | Rôle |
| --- | --- |
| `luma.html` | Les huit scènes. `luma.html?play` les lit en temps réel dans un navigateur. |
| `cues.js` | Les repères de la voix off. Les animations et les sons s'y calent. |
| `audio/voix-off.mp3` | La voix off, générée avec ElevenLabs via Higgsfield. |
| `sfx.js` | Synthétise les sons du motion design dans `audio/sfx.wav`. |
| `subs.js` | Écrit les sous-titres français en VTT et en SRT. |
| `render.js` | Exporte l'image en MP4 avec Playwright et ffmpeg. |

## Reconstruire la vidéo

```bash
cd motion
npm i --no-save playwright-core ffmpeg-static
node sfx.js && node subs.js
FPS=60 OUT=video-muette.mp4 node render.js
```

Il reste ensuite à mixer la voix et les sons, puis à les ajouter à l'image. La voix off démarre à 0,8 s.

```bash
FF=$(node -e 'console.log(require("ffmpeg-static"))')
$FF -i audio/voix-off.mp3 -i audio/sfx.wav -filter_complex "[0:a]aresample=48000,adelay=800|800,highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120,apad=whole_dur=68.5,asplit=2[vo][sc];[1:a]volume=0.9[fx];[fx][sc]sidechaincompress=threshold=0.04:ratio=4:attack=15:release=300[fxd];[vo][fxd]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,atrim=0:68.5" -ar 48000 -ac 2 audio/mix.wav
$FF -i video-muette.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart Luma-presentation.mp4
```

Si le texte de la voix off change, il faut régénérer la voix et mettre à jour les repères de `cues.js`. Le chemin de Chromium est défini dans `render.js`.

## Signature standard de fin

Toutes les vidéos et tous les réels Luma se terminent par la même signature, voir `signature-reference.jpg` :

1. La photo de Robin dans un rond, avec « Robin Pailhes » et « Fondateur de Luma ».
2. Le logotype Luma avec son étoile.
3. « Des outils IA personnalisés pour la relation client des PME. »
4. « Agence IA · Montpellier ».
5. Le bouton « Échangeons sur votre projet ».

Fond bleu très clair, texte bleu nuit. En vertical, la phrase passe sur deux lignes et le bloc reste au-dessus des sous-titres. La scène `s10` de `reel-harmonie-yacht/reel2.html` sert de modèle.
