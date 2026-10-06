"""Musique originale libre de droits (synthèse numpy) : intro sombre ponctuée sur les cartons, montée, drop à ~94 BPM.

Usage : python3 music_synth.py reperes.json sortie.wav
reperes.json : {"total": 14.7, "card_cuts": [0.92, 2.15, ...], "drop": 7.28, "broll_end": 13.02, "eighth": 0.3191}
- card_cuts : instants des coupes de l'intro (une note + un impact sourd sur chacune)
- drop : début du rythme ; broll_end : coupure nette avant le retour en boucle ; eighth : durée d'une croche
Le résultat est limité à -1 dBTP (environ -12 LUFS), prêt pour Instagram.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

DIR = Path(__file__).parent
EDL = json.loads(Path(sys.argv[1]).read_text())
OUT = Path(sys.argv[2])
SR = 48000
DUR = EDL["total"]
N = int(DUR * SR)
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)


def t_(d):
    return np.arange(int(d * SR)) / SR


def lp(x, f, o=2):
    return sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)


def hp(x, f, o=2):
    return sosfilt(butter(o, f, "high", fs=SR, output="sos"), x)


def bp(x, a, b, o=2):
    return sosfilt(butter(o, [a, b], "band", fs=SR, output="sos"), x)


def add(sig, at, g=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    s = sig[: N - i] * g
    L[i:i + len(s)] += s * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(s)] += s * np.sqrt(0.5 * (1 + pan))


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def env(n, a, d):
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na)
    return e * np.exp(-np.arange(n) / SR / d)


def kick(g=1.0):
    t = t_(0.5)
    f = 48 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 6.5)
    click = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 300) * 0.25
    return np.tanh((body + click) * 1.6) * g


def clap():
    t = t_(0.35)
    n = bp(rng.standard_normal(len(t)), 900, 4000)
    e = np.zeros(len(t))
    for k, o in enumerate([0, 0.011, 0.022]):
        i = int(o * SR)
        e[i:] += np.exp(-(t[: len(t) - i]) * (180 if k < 2 else 22))
    return n * e * 0.55


def hat(open_=False):
    t = t_(0.25 if open_ else 0.06)
    return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t * (14 if open_ else 70)) * 0.18


def sub808(m, d):
    t = t_(d)
    f = hz(m) * (1 + 0.6 * np.exp(-t * 40))
    ph = 2 * np.pi * np.cumsum(f) / SR
    e = np.minimum(1, t / 0.005) * np.minimum(1, (d - t) / 0.03).clip(0)
    return np.tanh(np.sin(ph) * 2.2) * e * 0.55


def pad(notes, d, bright=900):
    t = t_(d)
    s = np.zeros(len(t))
    for m in notes:
        for det in (-0.12, 0.0, 0.11):
            ph = 2 * np.pi * hz(m + det) * t + rng.uniform(0, 6.28)
            s += (2 * ((ph / (2 * np.pi)) % 1) - 1)  # dent de scie
    s = lp(s, bright, 2) / (len(notes) * 3)
    a = np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.5).clip(0)
    return s * a


def pluck(m, d=1.6):
    t = t_(d)
    s = sum(np.sin(2 * np.pi * hz(m) * k * t) / k ** 1.6 for k in range(1, 7))
    return s * env(len(t), 0.003, 0.45) * 0.35


def boom(g=1.0):
    t = t_(2.2)
    f = 38 + 30 * np.exp(-t * 6)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    n = lp(rng.standard_normal(len(t)), 300) * np.exp(-t * 4) * 0.4
    return (s + n) * g


def riser(d):
    t = t_(d)
    n = rng.standard_normal(len(t))
    out = np.zeros(len(t))
    seg = int(0.05 * SR)
    for i in range(0, len(t), seg):
        f = 300 + 7000 * (i / len(t)) ** 2
        out[i:i + seg] = bp(n[i:i + seg + 2000], f, min(f * 1.6, 20000))[:len(out[i:i + seg])]
    tone = np.sin(2 * np.pi * np.cumsum(120 + 500 * (t / d) ** 2) / SR) * 0.15
    return (out * 0.5 + tone) * (t / d) ** 2


def reverb(x, rt=2.4, wet=0.25):
    n = int(rt * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 6.9 / rt)
    ir = lp(ir, 5000)
    y = fftconvolve(x, ir)[: len(x)]
    return x + y / np.max(np.abs(y) + 1e-9) * np.max(np.abs(x) + 1e-9) * wet


DROP = EDL["drop"]
END_B = EDL["broll_end"]
E = EDL["eighth"]
cuts = EDL["card_cuts"]  # coupes des cartons avant le drop

# --- intro : nappe Dm sombre + notes de piano à chaque carton ---
add(pad([38, 45, 50, 53], DROP + 0.2, 700), 0.0, 0.4)
mel = [69, 65, 67, 64, 62]
for k, c in enumerate(cuts):
    add(pluck(mel[k % len(mel)]), c, 0.55, pan=(-0.3 if k % 2 else 0.3))
    add(boom(0.3 if k else 0.2), c, 1.0)
add(pluck(62), 0.0, 0.7)
add(riser(DROP - cuts[-1] - 0.08), cuts[-1], 0.55)

# --- drop : 94 BPM, Dm – Bb – F – C ---
prog = [(38, [50, 53, 57]), (34, [46, 50, 53]), (41, [53, 57, 60]), (36, [48, 52, 55])]
bar = 8 * E
nb = int(np.ceil((END_B - DROP) / bar))
add(boom(1.1), DROP)
for b in range(nb):
    b0 = DROP + b * bar
    root, chord = prog[b % 4]
    add(pad(chord, bar + 0.1, 2200), b0, 0.45)
    add(sub808(root, bar * 0.62), b0, 1.0)
    add(sub808(root + 12 if b % 2 else root, bar * 0.3), b0 + 5 * E, 0.8)
    for q in range(4):
        add(kick(), b0 + q * 2 * E, 0.9)
        if q in (1, 3):
            add(clap(), b0 + q * 2 * E, 0.9)
    for s in range(16):
        add(hat(open_=(s % 4 == 2)), b0 + s * E / 2, 0.9 if s % 2 == 0 else 0.55, pan=0.25)
    arp = chord + [chord[0] + 12]
    for s in range(8):
        add(pluck(arp[s % 4] + 12, 0.5), b0 + s * E, 0.45, pan=-0.35 if s % 2 else 0.35)

# coupure nette au retour de la boucle, nappe et souffle inversé
mask = np.ones(N)
i0, i1 = int(END_B * SR), int((END_B + 0.03) * SR)
mask[i0:] = 0
mask[i0 - int(0.02 * SR):i0] = np.linspace(1, 0, int(0.02 * SR))
L *= mask
R *= mask
tail = DUR - END_B
add(pad([38, 45, 50, 53], tail + 0.3, 700), END_B, 0.5)
add(boom(0.6), END_B)
add(pluck(69), END_B, 0.8)
sw = riser(tail * 0.9)[::-1] * 0.25
add(sw, END_B + 0.05)

L, R = reverb(L), reverb(R)
st = np.stack([L, R], 1)
st = np.tanh(st * 1.2) / 1.2
st /= np.max(np.abs(st)) + 1e-9
out = OUT.with_suffix(".raw.wav")
out.parent.mkdir(parents=True, exist_ok=True)
pcm = (st * 0.9 * 32767).astype(np.int16)
import wave

with wave.open(str(out), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(out), "-af", "volume=-0.8dB,alimiter=limit=0.89:level=false",
                "-ar", "48000", str(OUT)], check=True)
out.unlink()
print("musique OK", round(DUR, 2), "s")
