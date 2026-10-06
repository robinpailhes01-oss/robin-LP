#!/usr/bin/env python3
"""Incruste un texte « derrière » la personne d'une vidéo (effet magazine : la tête ou la main passe devant les lettres).

Usage : python3 text_behind.py video.mp4 texte.png sortie.mp4 [--debut 0] [--duree 2] [--max-cache 0.35]

- texte.png : calque transparent à la taille de la vidéo de sortie (1080×1920 par défaut, voir --taille).
- Le détourage de la personne utilise le modèle u2net_human_seg (176 Mo, téléchargé une fois dans ~/.cache/reel-kit).
- Si la personne cacherait plus de --max-cache des lettres (35 % par défaut), le texte reste devant :
  un mot illisible ruine l'effet. Le choix est fait pour tout le plan, pour éviter que le texte clignote.
"""
import argparse
import subprocess
import urllib.request
from pathlib import Path

import numpy as np
import onnxruntime as ort

URL = "https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net_human_seg.onnx"
MODEL = Path.home() / ".cache" / "reel-kit" / "u2net_human_seg.onnx"


def ff_raw(args, inp=None):
    return subprocess.run(["ffmpeg", "-loglevel", "error", *args], input=inp, capture_output=True, check=True).stdout


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video"); ap.add_argument("texte"); ap.add_argument("sortie")
    ap.add_argument("--debut", type=float, default=0); ap.add_argument("--duree", type=float, default=None)
    ap.add_argument("--taille", default="1080x1920"); ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--max-cache", type=float, default=0.35)
    a = ap.parse_args()
    W, H = map(int, a.taille.split("x"))
    if not MODEL.exists():
        MODEL.parent.mkdir(parents=True, exist_ok=True)
        print("téléchargement du modèle de détourage…")
        urllib.request.urlretrieve(URL, MODEL)
    seg = ort.InferenceSession(str(MODEL), providers=["CPUExecutionProvider"])

    t = ["-t", str(a.duree)] if a.duree else []
    raw = ff_raw(["-ss", str(a.debut), "-i", a.video, *t, "-vf",
                  f"fps={a.fps},scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}",
                  "-f", "rawvideo", "-pix_fmt", "rgb24", "-"])
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
    txt = np.frombuffer(ff_raw(["-i", a.texte, "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgba", "-"]),
                        np.uint8).reshape(H, W, 4).astype(np.float32) / 255
    ta = txt[..., 3]

    masks = []
    for f in fr:
        small = np.frombuffer(ff_raw(["-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-i", "-", "-vf", "scale=320:320",
                                      "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], f.tobytes()), np.uint8)
        x = small.reshape(320, 320, 3).astype(np.float32) / 255
        x = (x / max(x.max(), 1e-6) - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
        o = seg.run(None, {seg.get_inputs()[0].name: x.transpose(2, 0, 1)[None].astype(np.float32)})[0][0, 0]
        o = ((o - o.min()) / (o.max() - o.min() + 1e-6) * 255).astype(np.uint8)
        big = np.frombuffer(ff_raw(["-f", "rawvideo", "-pix_fmt", "gray", "-s", "320x320", "-i", "-", "-vf",
                                    f"scale={W}:{H}:flags=bicubic", "-f", "rawvideo", "-pix_fmt", "gray", "-"], o.tobytes()), np.uint8)
        masks.append(np.clip((big.reshape(H, W).astype(np.float32) / 255 - 0.35) / 0.3, 0, 1))
    hidden = max(float((ta * m).sum() / max(ta.sum(), 1)) for m in masks)
    behind = hidden <= a.max_cache
    print(f"lettres cachées au pire : {hidden:.0%} → texte {'derrière' if behind else 'devant'} la personne")

    enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                            "-r", str(a.fps), "-i", "-", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", a.sortie],
                           stdin=subprocess.PIPE)
    for f, m in zip(fr, masks):
        al = ta * (1 - m) if behind else ta
        o = f.astype(np.float32) / 255 * (1 - al[..., None]) + txt[..., :3] * al[..., None]
        enc.stdin.write((o * 255).astype(np.uint8).tobytes())
    enc.stdin.close(); enc.wait()
    print("OK", a.sortie)


if __name__ == "__main__":
    main()
