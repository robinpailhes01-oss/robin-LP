#!/usr/bin/env python3
"""Repère les coupes d'un Reel à l'image près et décrit chaque passage.

Usage : python3 find_cuts.py ref.mp4 [--seuil 18] [--planches dossier]
Sortie : une ligne par passage (début, fin, durée, luminosité moyenne, couleur du coin haut-gauche).
Avec --planches, écrit pour chaque passage une image du milieu (bande centrale) et une planche de vérification.

Pourquoi pas seulement `select=gt(scene,…)` d'ffmpeg : il rate les coupes entre deux images sombres
(vidéo de nuit → carton noir). Ici on compare la luminosité image par image, ce qui les attrape.
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

import numpy as np


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=r_frame_rate,width,height:format=duration", "-of", "json", path],
                         capture_output=True, text=True, check=True).stdout
    j = json.loads(out)
    n, d = j["streams"][0]["r_frame_rate"].split("/")
    return float(n) / float(d), float(j["format"]["duration"])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--seuil", type=float, default=18.0, help="saut de luminosité (0-255) ou de contenu qui compte comme coupe")
    ap.add_argument("--planches", help="dossier où écrire une image par passage")
    a = ap.parse_args()

    fps, dur = probe(a.video)
    W, H = 72, 128
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", a.video, "-vf", f"scale={W}:{H}", "-f", "rawvideo",
                          "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3).astype(np.float32)
    lum = fr.mean(axis=(1, 2, 3))
    diff = np.abs(fr[1:] - fr[:-1]).mean(axis=(1, 2, 3))  # changement de contenu
    cuts = [0]
    for i in range(1, len(fr)):
        if diff[i - 1] > a.seuil or abs(lum[i] - lum[i - 1]) > a.seuil:
            if i - cuts[-1] >= 2:  # ignore les doublons sur 1 image
                cuts.append(i)
    cuts.append(len(fr))

    rows = []
    for k, (s, e) in enumerate(zip(cuts, cuts[1:])):
        m = (s + e) // 2
        corner = fr[m, 5:15, 5:15].mean(axis=(0, 1)).round().astype(int).tolist()
        rows.append({"n": k, "debut": round(s / fps, 4), "fin": round(e / fps, 4), "duree": round((e - s) / fps, 4),
                     "lum": round(float(lum[s:e].mean()), 1), "coin_rgb": corner})
        print(f"{k:02d}  {s / fps:7.3f} → {e / fps:7.3f}  ({(e - s) / fps:5.3f} s)  lum {lum[s:e].mean():6.1f}  coin {corner}")
    print(f"fps {fps:g}, durée {dur:.3f} s, {len(rows)} passages")

    if a.planches:
        d = Path(a.planches)
        d.mkdir(parents=True, exist_ok=True)
        for r in rows:
            t = (r["debut"] + r["fin"]) / 2
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", a.video, "-frames:v", "1",
                            "-vf", f"scale=360:-1,drawtext=text='{r['n']:02d} {r['debut']:.2f}':x=4:y=4:fontsize=18:fontcolor=red",
                            str(d / f"p{r['n']:02d}.png")], check=True)
        cols = min(10, len(rows))
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(d / "p%02d.png"), "-vf",
                        f"tile={cols}x{(len(rows) + cols - 1) // cols}", "-frames:v", "1", str(d / "planche.jpg")], check=True)
        (d / "passages.json").write_text(json.dumps(rows, indent=1, ensure_ascii=False))
        print("planche :", d / "planche.jpg")


if __name__ == "__main__":
    sys.exit(main())
