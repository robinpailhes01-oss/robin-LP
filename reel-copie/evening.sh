#!/usr/bin/env bash
# Assemble le Reel « Good evening, Robin » : fond façon app + vidéo Higgsfield dans la carte arrondie.
# Entrées : build/evening/{bg.png,mask.png,robin.mp4}. Sortie : out/reel-good-evening-robin.mp4
set -euo pipefail
cd "$(dirname "$0")"
E=build/evening
X=67; Y=600; W=946; H=752
ffmpeg -y -loglevel error -loop 1 -i $E/bg.png -i $E/robin.mp4 -loop 1 -i $E/mask.png -filter_complex "
[1:v]fps=30,scale=$W:$H:force_original_aspect_ratio=increase:flags=lanczos,crop=$W:$H,format=rgba[v];
[2:v]crop=$W:$H:$X:$Y,format=gray[m];
[v][m]alphamerge[card];
[0:v][card]overlay=$X:$Y:shortest=1,format=yuv420p[out]" \
  -map "[out]" -c:v libx264 -preset slow -crf 19 -maxrate 12M -bufsize 24M -r 30 -movflags +faststart -an out/reel-good-evening-robin.mp4
echo "OK out/reel-good-evening-robin.mp4"
