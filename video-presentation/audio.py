"""Musique douce, sound design discret et mixage de la vidéo de présentation Luma (tout est synthétisé ici).

Sortie : out/luma-presentation-audio.wav (48 kHz stéréo). Timings lus dans cues.json, comme l'animation.
"""
import json
import subprocess
from pathlib import Path

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

DIR = Path(__file__).parent
C = json.loads((DIR / "cues.json").read_text())
SR = 48000
DUR = C["duration"]
N = int(DUR * SR)
SC = C["scenes"]
rng = np.random.default_rng(7)
L = lambda k: C["lines"][k]["at"]
W = lambda k, i: C["lines"][k]["words"][i][1]

music = np.zeros((N, 2))
sfx = np.zeros((N, 2))
vo = np.zeros((N, 2))


def tt(d):
    return np.arange(int(d * SR)) / SR


def place(buf, sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i + len(sig) <= 0:
        return
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l * 1.414, sig * r * 1.414], axis=1)
    j0, j1 = max(0, -i), min(len(sig), N - i)
    buf[i + j0:i + j1] += sig[j0:j1] * gain


def filt(x, kind, f, order=2):
    if kind == "bp":
        sos = butter(order, [f[0] / (SR / 2), f[1] / (SR / 2)], "bandpass", output="sos")
    else:
        sos = butter(order, f / (SR / 2), kind, output="sos")
    return sosfilt(sos, x, axis=0)


def reverb(x, secs=2.2, mix=0.3, bright=5000):
    n = int(secs * SR)
    ir = rng.standard_normal((n, 2)) * np.exp(-np.arange(n) / SR / (secs / 5))[:, None]
    ir = filt(ir, "low", bright)
    ir /= np.sqrt(np.sum(ir ** 2, axis=0))
    wet = np.stack([fftconvolve(x[:, k], ir[:, k])[: len(x)] for k in range(2)], axis=1)
    return x + wet * mix


def note(n):
    return 440 * 2 ** ((n - 69) / 12)


def saw(f, t, dt=0.0):
    ph = f * (1 + dt) * t
    return 2 * (ph - np.floor(ph + 0.5))


def pad(notes, d, cutoff=1400, att=1.2, rel=1.5):
    t = tt(d)
    s = sum(saw(note(n), t, dt) for n in notes for dt in (-0.003, 0.0, 0.0035)) / (len(notes) * 3)
    s = filt(s, "low", cutoff)
    return s * np.minimum(1, t / att) * np.minimum(1, np.maximum(0, d - t) / rel)


def keys(f, d=1.6):
    """Piano électrique doux : sinus + harmonique, léger trémolo."""
    t = tt(d)
    s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 3) + 0.08 * np.sin(2 * np.pi * f * 3 * t) * np.exp(-t * 6)
    return s * np.exp(-t * 1.8) * (1 + 0.08 * np.sin(2 * np.pi * 5 * t)) * np.minimum(1, t / 0.004)


def bell(f, d=2.0, bright=0.6):
    t = tt(d)
    mod = np.sin(2 * np.pi * f * 3.5 * t) * 2.0 * bright * np.exp(-t * 6)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 2.6) * np.minimum(1, t / 0.002)


def kick(d=0.5):
    t = tt(d)
    f = 42 + 70 * np.exp(-t * 25)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)


def shaker(d=0.09):
    t = tt(d)
    return filt(rng.standard_normal(len(t)), "high", 6500) * np.sin(np.pi * np.minimum(1, t / d)) ** 2


def rim(d=0.08):
    t = tt(d)
    return filt(rng.standard_normal(len(t)), "bp", (1500, 3500)) * np.exp(-t * 70) * 0.6 + np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 90) * 0.3


def sub(f, d):
    t = tt(d)
    return np.sin(2 * np.pi * f * t) * np.minimum(1, t / 0.05) * np.minimum(1, np.maximum(0, d - t) / 0.4)


def swish(d=0.9, f0=500, f1=4000):
    n = int(d * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    hop = 1024
    for s in range(0, n, hop):
        fc = f0 * (f1 / f0) ** (s / n)
        seg = noise[s:s + hop * 2]
        y = filt(seg, "bp", (max(40, fc * 0.6), min(SR / 2 - 100, fc * 1.4)))
        out[s:s + len(y)] += y * np.hanning(len(y))
    out /= np.max(np.abs(out)) + 1e-9
    return out * np.sin(np.pi * np.linspace(0, 1, n)) ** 2


def tick(f=2600, d=0.03):
    t = tt(d)
    return filt(rng.standard_normal(len(t)), "bp", (f * 0.7, f * 1.4)) * np.exp(-t * 220)


def pop(f0=900, f1=420, d=0.09):
    t = tt(d)
    f = f1 + (f0 - f1) * np.exp(-t * 55)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40)


# ---------- MUSIQUE ----------
BPM = 84
BEAT = 60 / BPM
BAR = BEAT * 4
CHORDS = [  # (pad, arpège, basse)
    ([50, 57, 61, 64, 69], [62, 66, 69, 73], 38),  # Ré maj7
    ([47, 54, 57, 62, 66], [59, 62, 66, 69], 35),  # Si m7
    ([43, 50, 54, 59, 62], [62, 66, 67, 71], 31),  # Sol maj7
    ([45, 52, 57, 59, 64], [61, 64, 69, 71], 33),  # La 6sus
]


def energy(t):
    """Intensité de l'accompagnement selon la scène (0 calme → 1 plein)."""
    if t < SC["day"][1]:
        return 0.15 + 0.35 * (t / SC["day"][1])
    if t < SC["who"][0]:
        return 0.05  # suspension du « et si »
    if t < SC["board"][0]:
        return 0.55
    if t < SC["fit"][0]:
        return 0.8
    if t < SC["method"][0]:
        return 0.5
    if t < SC["end"][0]:
        return 0.85
    return 0.4


nbars = int(DUR / BAR) + 1
for b in range(nbars):
    t0 = 0.4 + b * BAR
    if t0 > DUR - 2:
        break
    padn, arp, bass = CHORDS[b % 4]
    e = energy(t0)
    last = t0 + BAR > SC["end"][0] + 3.5
    place(music, pad(padn, BAR + 1.6, cutoff=900 + 900 * e, att=0.9, rel=1.6), t0, 0.22)
    if e > 0.3:
        place(music, sub(note(bass), BAR), t0, 0.32 * e)
    for k in range(8):  # arpège en croches
        at = t0 + k * BEAT / 2
        if at < SC["who"][0] and at > SC["spark"][0]:
            continue
        place(music, keys(note(arp[[0, 1, 2, 3, 2, 1, 2, 3][k]] + (12 if k == 7 else 0)), 1.8), at, (0.10 + 0.06 * e) * (1.0 if k % 2 == 0 else 0.7), pan=np.sin(k * 1.3) * 0.5)
    if e > 0.45 and not last:  # rythmique discrète
        for k in range(4):
            at = t0 + k * BEAT
            if k in (0, 2):
                place(music, kick(), at, 0.38 * e)
            if k in (1, 3):
                place(music, rim(), at, 0.10 * e, pan=0.15)
        for k in range(8):
            place(music, shaker(), t0 + k * BEAT / 2 + BEAT / 4, 0.05 * e * (1.3 if k % 2 else 0.8), pan=-0.3)

# accord final tenu + fondu
place(music, pad([38, 50, 57, 62, 66, 69, 74], DUR - SC["end"][0] - 0.5, cutoff=1800, att=1.0, rel=3.0), SC["end"][0] + 0.5, 0.18)

# ---------- SOUND DESIGN (discret) ----------
# tâches qui tombent sur la journée (mêmes instants que l'animation)
chip_times = []
for a, b in [(W("l04", 0), W("l04", 4)), (W("l04", 4), W("l04", 7)), (W("l04", 7), W("l04", 11)), (W("l04", 11), W("l04", 15) + 0.6)]:
    chip_times += [a + (b - a) * (k / 4) * 0.9 for k in range(4)]
chip_times += [W("l05", 0) + 0.25 + k * 0.16 for k in range(10)]
for i, at in enumerate(chip_times):
    place(sfx, pop(1300 + 120 * (i % 4), 600, 0.06), at + 0.12, 0.10, pan=rng.uniform(-0.6, 0.6))
# les tâches s'alignent puis la barre se forme
place(sfx, swish(1.2, 3000, 400), W("l05", 6) - 0.2, 0.18)
place(sfx, sub(55, 0.8) * np.exp(-tt(0.8) * 4), W("l05", 6) + 0.9, 0.35)
# déclic : la barre se dissout en étoile
place(sfx, swish(1.6, 400, 6000), L("l06") + 0.3, 0.16)
for i, n in enumerate((81, 86, 90)):
    place(sfx, bell(note(n), 2.4, 0.5), L("l06") + 1.35 + i * 0.07, 0.07, pan=(-0.3, 0.3, 0)[i])
# logo « qui nous sommes » : signature Luma
place(sfx, swish(0.9, 600, 3000), SC["who"][0] - 0.3, 0.12)
for i, n in enumerate((69, 74, 78, 81)):
    place(sfx, bell(note(n), 2.6, 0.6), SC["who"][0] + 0.35 + i * 0.08, 0.10, pan=(-0.3, 0.3, 0, 0.2)[i])
place(sfx, pop(700, 400, 0.08), W("l07", 6) - 0.1, 0.12)
for i, at in enumerate((W("l09", 5), W("l09", 13), W("l09", 13) + 0.35)):
    place(sfx, tick(3000 + 300 * i), at, 0.12)
# tableau : chaque tâche glisse chez Luma, puis coche
for k in ["l11", "l12", "l13", "l14", "l15"]:
    at = L(k) + 0.1
    place(sfx, swish(1.0, 700, 2600), at, 0.10, pan=0.2)
    place(sfx, pop(1100, 600, 0.07), at + 0.95, 0.12, pan=0.5)
    place(sfx, bell(note(86), 1.0, 0.3), at + 1.0, 0.035, pan=0.5)
# sur mesure : satellites, puis anneau Luma
for i in range(6):
    place(sfx, tick(2200 + 200 * i, 0.025), SC["fit"][0] + 0.5 + i * 0.12, 0.08, pan=np.cos(i) * 0.6)
for k, i in (("l16", 10), ("l16", 12), ("l16", 16)):
    place(sfx, bell(note(81), 1.2, 0.3), W(k, i), 0.04)
place(sfx, swish(0.9, 1500, 5000), W("l16", 17) + 0.2, 0.08)
# méthode : un tintement par étape
for j, (k, i) in enumerate((("l17", 3), ("l17", 7), ("l17", 16), ("l17", 23))):
    place(sfx, bell(note([74, 78, 81, 86][j]), 1.6, 0.4), W(k, i) - 0.15, 0.08)
    place(sfx, pop(900, 500, 0.06), W(k, i) - 0.15, 0.06)
# fin : logo, puis bouton
place(sfx, swish(1.0, 500, 3500), SC["end"][0] - 0.2, 0.12)
for i, n in enumerate((69, 74, 78, 81, 86)):
    place(sfx, bell(note(n), 3.0, 0.6), L("l19") + 0.1 + i * 0.08, 0.11, pan=(-0.3, 0.3, 0, 0.2, -0.1)[i])
place(sfx, pop(1200, 500, 0.1), L("l20") + 0.25, 0.14)

# ---------- VOIX ----------
for k, ln in C["lines"].items():
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(DIR / "assets/p" / f"{k}.wav"), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(np.float64).copy()
    f = int(0.01 * SR)
    a[:f] *= np.linspace(0, 1, f)
    a[-f:] *= np.linspace(1, 0, f)
    place(vo, a, ln["at"])
vo = filt(vo, "high", 80)
vo = reverb(vo, 0.5, 0.05, 6000)
vo /= np.max(np.abs(vo)) + 1e-9

# ---------- MIX ----------
music = reverb(music, 2.4, 0.28)
sfx = reverb(sfx, 1.8, 0.3)
e = np.abs(vo).mean(axis=1)
k = int(0.08 * SR)
e = np.convolve(e, np.ones(k) / k, mode="same")
e = np.minimum(1, e / (np.percentile(e[e > 1e-4], 90) + 1e-9))
music *= (1 - 0.42 * e)[:, None]
mix = music * 0.62 + sfx * 0.55 + vo * 1.0
fade_in, fade_out = int(0.8 * SR), int(3.0 * SR)
mix[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
mix[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None] ** 1.5
mix /= np.max(np.abs(mix))
mix = np.tanh(mix * 1.3) / np.tanh(1.3)

out = DIR / "out"
out.mkdir(exist_ok=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
                "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", str(SR), str(out / "luma-presentation-audio.wav")],
               input=(mix * 0.97).astype(np.float32).tobytes(), check=True)
print("audio OK")
