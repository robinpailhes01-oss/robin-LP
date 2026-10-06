#!/usr/bin/env bash
# Reel « pause » : votre vidéo (début + retour au travail) autour de l'écran du téléphone de la référence, musique d'origine.
# Entrées : src/pause/robin.mov (HLG iPhone), src/ref4/ref.mp4, build/pause/title.png. Sortie : out/reel-pause.mp4
set -euo pipefail
cd "$(dirname "$0")"
P1_END=9.0                 # vous levez le téléphone → coupe sur l'écran
P1_DUR=5.1667              # durée du 1er passage dans la référence
REF_A=5.1667; REF_B=10.1333 # écran du téléphone dans la référence
P3_START=12.9              # téléphone encore en main, juste avant de le reposer
TOTAL=13.9988
P3_DUR=$(python3 -c "print(round($TOTAL-$REF_B,4))")
P1_START=$(python3 -c "print(round($P1_END-$P1_DUR,4))")
SDR="zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p,eq=saturation=1.08:contrast=1.03"
ffmpeg -y -loglevel error -i src/pause/robin.mov -i src/ref4/ref.mp4 -loop 1 -i build/pause/title.png -filter_complex "
[0:v]trim=$P1_START:$P1_END,setpts=PTS-STARTPTS,$SDR,scale=1080:1920,fps=30,setsar=1[a0];
[2:v]format=rgba,trim=0:$P1_DUR,setpts=PTS-STARTPTS[t];
[a0][t]overlay=0:0:shortest=1,format=yuv420p[a];
[1:v]trim=$REF_A:$REF_B,setpts=PTS-STARTPTS,scale=1080:1920:flags=lanczos,fps=30,setsar=1,format=yuv420p[b];
[0:v]trim=$P3_START:$(python3 -c "print($P3_START+$P3_DUR)"),setpts=PTS-STARTPTS,$SDR,scale=1080:1920,fps=30,setsar=1[c];
[a][b][c]concat=n=3:v=1:a=0[v]" \
  -map "[v]" -map 1:a -c:v libx264 -preset slow -crf 19 -maxrate 12M -bufsize 24M -c:a aac -b:a 192k -shortest -movflags +faststart out/reel-pause.mp4
echo "OK out/reel-pause.mp4"
