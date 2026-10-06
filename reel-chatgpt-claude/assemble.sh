#!/usr/bin/env bash
# Assemble le Reel : plan téléphone (vidéo d'origine) + plan jardin avec mascottes (généré), textes, son d'origine.
# Usage : ./assemble.sh build/garden-mascottes.mp4
set -euo pipefail
cd "$(dirname "$0")"
GEN="$1"
CUT=4.40
mkdir -p out
ffmpeg -y -loglevel error \
  -i src/A.mp4 -i "$GEN" -loop 1 -t 4.4 -i build/txt_a.png -loop 1 -t 5.4 -i build/txt_b.png \
  -filter_complex "\
[0:v]trim=0:${CUT},setpts=PTS-STARTPTS,fps=30,scale=720:1280,setsar=1[p1];\
[1:v]fps=30,scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1,trim=0:5.375,setpts=PTS-STARTPTS[p2];\
[2:v]format=rgba,fade=t=in:st=0.15:d=0.2:alpha=1[ta];\
[3:v]format=rgba,fade=t=in:st=0.0:d=0.15:alpha=1[tb];\
[p1][ta]overlay=0:0:shortest=1[v1];\
[p2][tb]overlay=0:0:shortest=1[v2];\
[v1][v2]concat=n=2:v=1:a=0,format=yuv420p[v]" \
  -map "[v]" -map 0:a:0 -c:v libx264 -preset slow -crf 18 -profile:v high -c:a aac -b:a 192k -shortest -movflags +faststart out/reel-mon-equipe.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 out/reel-mon-equipe.mp4
