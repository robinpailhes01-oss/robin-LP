"""Effets sonores du motion design de la VSL : un son discret à chaque apparition d'élément, mixé sous la voix.
Les sons sont synthétisés ici (aucun fichier externe, donc aucun problème de droits).

Usage : python3 vsl_sfx.py vsl.json   (après vsl.py : lit build/spec.json et build/base.mov, remplace l'audio de la vidéo finale)
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt

DIR = Path(__file__).parent
B = DIR / "build"
SR = 48000
C = json.loads(Path(sys.argv[1]).read_text())
spec = json.loads((B / "spec.json").read_text())
rng = np.random.default_rng(7)


def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / decay)


def pop(f0=880.0, dur=0.12):
    """petit « pop » : sinus qui descend vite en hauteur + soupçon de clic"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f0 * (1 + 0.6 * np.exp(-t / 0.012))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.035)
    click = sosfilt(butter(2, 3000, "hp", fs=SR, output="sos"), rng.standard_normal(n)) * env(n, 0.0005, 0.004) * 0.25
    return x + click


def tock():
    """son plus sourd pour les éléments barrés (✕)"""
    return pop(420, 0.14) * 0.9 + pop(210, 0.14) * 0.5


def ding():
    """notification : deux notes de clochette"""
    n = int(0.7 * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f, a, d0 in [(1568, 1.0, 0.0), (2093, 0.8, 0.075)]:
        tt = np.clip(t - d0, 0, None)
        e = (t >= d0) * np.minimum(1, tt / 0.003) * np.exp(-tt / 0.22)
        x += a * e * (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 2.76 * f * tt) * np.exp(-tt / 0.05))
    return x * 0.6


def whoosh(dur=0.45, lo=300, hi=4000, rise=0.7):
    """souffle filtré dont la fréquence balaie de lo à hi"""
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    blk = 480
    for i in range(0, n, blk):
        p = i / n
        fc = lo * (hi / lo) ** min(1, p / rise)
        sos = butter(2, [fc * 0.6, min(fc * 1.6, SR / 2 - 100)], "bp", fs=SR, output="sos")
        out[i:i + blk] = sosfilt(sos, noise[max(0, i - 2000):i + blk])[-len(noise[i:i + blk]):]
    t = np.arange(n) / SR
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
    return out * e / (np.abs(out).max() + 1e-9)


def thump():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 55 * (1 + 1.5 * np.exp(-t / 0.03))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.003, 0.09)


def db(x):
    return 10 ** (x / 20)


# --- placement des sons sur la frise ---
total = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(B / "base.mov")],
                             capture_output=True, text=True).stdout)
track = np.zeros(int((total + 2) * SR))


def put(x, t, gain_db):
    i = int(t * SR)
    if i < 0:
        x, i = x[-i:], 0
    j = min(len(track), i + len(x))
    track[i:j] += x[:j - i] * db(gain_db)


G = sorted(spec["graphics"], key=lambda g: g["t0"])
stack = 0
last_t = -9
for g in G:
    t0 = g["t0"]
    stack = stack + 1 if t0 - last_t < 2.5 else 0     # éléments qui s'empilent : la note monte
    last_t = t0
    ty = g["type"]
    if ty == "chip":
        if g.get("style") == "off" or g.get("icon") == "x":
            put(tock(), t0, -21)
        else:
            put(pop(880 * 2 ** (min(stack, 4) * 2 / 12)), t0, -20)
    elif ty == "notif":
        put(ding(), t0, -19)
    elif ty in ("big", "brand"):
        w = whoosh(0.5, 250, 3500)
        put(w, t0 - 0.38, -24)
        put(thump(), t0, -17)
        put(pop(1320, 0.18), t0 + 0.02, -27)
    elif ty == "kicker":
        put(whoosh(0.6, 400, 5000), t0 - 0.2, -28)
    elif ty == "insert":
        put(whoosh(0.55, 200, 2500, rise=0.5), t0 - 0.25, -22)
        put(whoosh(0.4, 2500, 300, rise=0.5), g["t1"] - 0.35, -28)     # sortie plus douce
sfx = np.clip(track, -1, 1).astype(np.float32)
sfx_path = B / "sfx.wav"
import wave
with wave.open(str(sfx_path), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((sfx * 32767).astype(np.int16).tobytes())

# --- mixage : voix normalisée, effets dessous ; l'image n'est pas réencodée ---
out = DIR / "out" / C.get("name", "vsl-luma.mp4")
tmp = out.with_name(out.stem + "-sfx.mp4")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(out), "-i", str(B / "base.mov"), "-i", str(sfx_path),
                "-filter_complex", "[1:a]loudnorm=I=-16:TP=-2:LRA=11,aresample=48000[v];[2:a]aresample=48000[s];"
                "[v][s]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.94[a]",
                "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(tmp)],
               check=True)
tmp.replace(out)
print(f"OK effets sonores : {len(G)} éléments -> {out}")
