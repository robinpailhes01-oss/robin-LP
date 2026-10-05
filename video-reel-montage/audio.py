"""Musique, effets sonores et mixage du Reel monté (voix réelle de Robin + sons synthétisés ici).

Sortie : out/reel-audio.wav (48 kHz stéréo). Les instants viennent de cues.json, comme l'habillage.
"""
import json
import re
import subprocess
from pathlib import Path

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

DIR = Path(__file__).parent
C = json.loads((DIR / "cues.json").read_text())
SR = 48000
VD = C["duration"]
DUR = VD + 1.7  # carte de fin
N = int(DUR * SR)
PT = C["parts"]
rng = np.random.default_rng(11)

music = np.zeros((N, 2))
sfx = np.zeros((N, 2))


def WD(pat, n=0, after=0.0):
    """Instant du n-ième mot correspondant au motif (mêmes repères que l'habillage)."""
    m = [w for w in C["words"] if w[1] >= after and re.search(pat, w[0], re.I)]
    return m[min(n, len(m) - 1)][1]


# ---------- outils (repris du Reel Luma) ----------
def tt(d):
    return np.arange(int(d * SR)) / SR


def place(buf, sig, at, gain=1.0, pan=0.0):
    """Ajoute un signal mono ou stéréo à l'instant `at` (s), avec panoramique -1..1."""
    i = int(at * SR)
    if i >= N or i + len(sig) <= 0:
        return
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l * 1.414, sig * r * 1.414], axis=1)
    j0 = max(0, -i)
    j1 = min(len(sig), N - i)
    buf[i + j0:i + j1] += sig[j0:j1] * gain


def filt(x, kind, f, order=2):
    if kind == "bp":
        sos = butter(order, [f[0] / (SR / 2), f[1] / (SR / 2)], "bandpass", output="sos")
    else:
        sos = butter(order, f / (SR / 2), kind, output="sos")
    return sosfilt(sos, x, axis=0)


def env(d, a=0.005, decay=None, hold=0.0):
    t = tt(d)
    e = np.minimum(1, t / max(a, 1e-4))
    if decay:
        e *= np.exp(-np.maximum(0, t - a - hold) / decay)
    return e


def swept_noise(d, f0, f1, q=0.6, curve=2.0):
    """Bruit filtré passe-bande dont la fréquence glisse de f0 à f1 (souffles, montées)."""
    n = int(d * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    hop = 1024
    win = np.hanning(hop * 2)
    for s in range(0, n, hop):
        p = (s / n) ** curve if f1 > f0 else 1 - (1 - s / n) ** curve
        fc = f0 * (f1 / f0) ** p
        lo, hi = max(30, fc * (1 - q / 2)), min(SR / 2 - 100, fc * (1 + q / 2))
        seg = noise[max(0, s - hop):s + hop]
        y = filt(seg, "bp", (lo, hi))
        w = win[: len(y)] if len(y) == len(win) else np.hanning(len(y))
        a = max(0, s - hop)
        out[a:a + len(y)] += y * w
    return out / (np.max(np.abs(out)) + 1e-9)


def reverb(x, secs=1.2, mix=0.25, bright=6000):
    n = int(secs * SR)
    ir = rng.standard_normal((n, 2)) * np.exp(-np.arange(n) / SR / (secs / 5))[:, None]
    ir = filt(ir, "low", bright)
    ir /= np.sqrt(np.sum(ir ** 2, axis=0))
    wet = np.stack([fftconvolve(x[:, k], ir[:, k])[: len(x)] for k in range(2)], axis=1)
    return x + wet * mix


def saw(f, t, detune=0.0):
    ph = (f * (1 + detune)) * t
    return 2 * (ph - np.floor(ph + 0.5))


def note(n):  # n = numéro MIDI
    return 440 * 2 ** ((n - 69) / 12)


# ---------- éléments sonores ----------
def kick(d=0.45, punch=1.0):
    t = tt(d)
    f = 45 + 110 * np.exp(-t * 28) * punch
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7.5) + 0.25 * filt(rng.standard_normal(len(t)), "high", 3000) * np.exp(-t * 120)


def clap(d=0.25):
    t = tt(d)
    n = filt(rng.standard_normal(len(t)), "bp", (900, 4200))
    e = np.zeros(len(t))
    for o in (0, 0.011, 0.022):
        e += (t >= o) * np.exp(-np.maximum(0, t - o) * (60 if o < 0.02 else 18))
    return n * e * 0.6


def hat(d=0.06, open_=False):
    t = tt(d if not open_ else 0.22)
    return filt(rng.standard_normal(len(t)), "high", 7500) * np.exp(-t * (70 if not open_ else 16))


def boom(d=1.6, f0=120, f1=34, k=3.0):
    t = tt(d)
    f = f1 + (f0 - f1) * np.exp(-t * 9)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * k)
    s += 0.5 * filt(rng.standard_normal(len(t)), "low", 900) * np.exp(-t * 14)
    return np.tanh(s * 1.6)


def crash(d=2.0):
    t = tt(d)
    return filt(rng.standard_normal(len(t)), "high", 3500) * np.exp(-t * 2.4)


def bell(f, d=1.4, bright=1.0):
    t = tt(d)
    mod = np.sin(2 * np.pi * f * 3.5 * t) * 2.2 * bright * np.exp(-t * 6)
    s = np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 3.2)
    s += 0.35 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 5)
    return s * np.minimum(1, t / 0.002)


def ping(f1=1760, f2=2350):
    a = bell(f1, 0.18, 0.4) * 0.8
    b = bell(f2, 0.5, 0.4)
    out = np.zeros(len(b) + int(0.09 * SR))
    out[: len(a)] += a
    out[int(0.09 * SR):] += b
    return out * 0.5


def pop(f0=900, f1=380, d=0.09):
    t = tt(d)
    f = f1 + (f0 - f1) * np.exp(-t * 60)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 45)


def click(d=0.02, f=3000):
    t = tt(d)
    return filt(rng.standard_normal(len(t)), "bp", (f * 0.7, f * 1.4)) * np.exp(-t * 300)


def whoosh(d, f0, f1, curve=1.6):
    s = swept_noise(d, f0, f1, q=0.9, curve=curve)
    t = np.linspace(0, 1, len(s))
    return s * np.sin(np.pi * t) ** 1.5


def buzz(d=0.38):
    t = tt(d)
    s = np.sign(np.sin(2 * np.pi * 155 * t)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 22 * t)))
    return filt(s, "low", 700) * np.minimum(1, t / 0.01) * np.minimum(1, (d - t) / 0.03)


def chord_pad(notes, d, cutoff=1800, att=0.25, rel=0.6):
    t = tt(d)
    s = sum(saw(note(n), t, dt) for n in notes for dt in (-0.004, 0.0, 0.0045)) / (len(notes) * 3)
    s = filt(s, "low", cutoff)
    e = np.minimum(1, t / att) * np.minimum(1, np.maximum(0, d - t) / rel)
    return s * e


def pluck(f, d=0.22):
    t = tt(d)
    s = saw(f, t) * 0.6 + np.sin(2 * np.pi * f * t) * 0.4
    return filt(s, "low", 2600) * np.exp(-t * 16)


def bass_note(f, d=0.22):
    t = tt(d)
    s = np.sin(2 * np.pi * f * t) + 0.35 * saw(f, t)
    return filt(s, "low", 380) * np.minimum(1, t / 0.004) * np.exp(-t * 6)


def marimba(f, d=0.45):
    t = tt(d)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 9) + 0.25 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 30)
    return s * np.minimum(1, t / 0.002)


def keys(f, d=1.4):
    t = tt(d)
    s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 3)
    return s * np.exp(-t * 2.2) * (1 + 0.08 * np.sin(2 * np.pi * 5 * t)) * np.minimum(1, t / 0.004)


# ---------- MUSIQUE : groove léger et chaud, 112 BPM ----------
BPM = 112
BEAT = 60 / BPM
BAR = 4 * BEAT
PROG = [([52, 56, 59, 63], 40), ([49, 52, 56, 59], 37), ([45, 49, 52, 56], 33), ([47, 51, 54, 57], 35)]  # Mi maj7, Do#m7, La maj7, Si
HOOK = {0: 76, 3: 80, 6: 83, 8: 80, 10: 78, 12: 76, 14: 78, 16: 80, 19: 83, 22: 85, 24: 83, 26: 80, 28: 78, 30: 76}
start = 0.0
nb = int(np.ceil(DUR / BAR))
for b in range(nb):
    t0 = start + b * BAR
    if t0 >= DUR:
        break
    notes, root = PROG[b % 4]
    full = b >= 1 and t0 < VD - 0.5          # le 1er temps reste léger pour laisser respirer le hook
    for k in range(4):
        at = t0 + k * BEAT
        place(music, keys(note(notes[k % 4] + 12), 1.2), at, 0.05, pan=(-0.3, 0.3)[k % 2])
        if full:
            place(music, kick(0.4, 0.8), at, 0.55)
            if k % 2 == 1:
                place(music, clap(0.2), at, 0.25)
            place(music, hat(open_=True), at + BEAT / 2, 0.05, pan=0.25)
            for s16 in (0.25, 0.75):
                place(music, hat(), at + s16 * BEAT, 0.035, pan=-0.3)
        place(music, bass_note(note(root), 0.3), at + BEAT / 2, 0.45 if full else 0.25)
    place(music, chord_pad(notes, BAR + 0.05, cutoff=1600, att=0.05, rel=0.2), t0, 0.12)
    if full and b % 2 == 1:
        for step, n in HOOK.items():
            if step < 16:
                place(music, marimba(note(n)), t0 + step * BEAT / 4, 0.07, pan=0.25 if step % 4 else -0.25)

# ---------- EFFETS SONORES ----------
def sw(at, d=0.35, f0=2500, f1=500, g=0.18, pan=0.0):
    place(sfx, whoosh(d, f0, f1), at - d * 0.6, g, pan)


# coupes franches : petit souffle discret sur les zooms
for c in C["cuts"][1:]:
    if c < VD - 0.1:
        place(sfx, whoosh(0.18, 3000, 1200), c - 0.09, 0.05)
# hook
sw(0.05, 0.4, 600, 4000, 0.22)
t3 = WD("trois")
place(sfx, filt(boom(0.9, 160, 45, 6.0), "low", 200), t3 - 0.04, 0.45)
place(sfx, click(0.03, 2200), t3 - 0.04, 0.3)
for pat, f in (("temps", 1100), ("argent", 1400)):
    place(sfx, pop(f, 500, 0.09), WD(pat) - 0.06, 0.35)
    place(sfx, bell(note(88), 0.6, 0.4), WD(pat), 0.06)
# écran partagé : entrée / sortie
sw(PT["p1"][0], 0.5, 4000, 400, 0.3)
sw(PT["cta"][0], 0.5, 400, 4000, 0.3)
for k in ("p1", "p2", "p3"):
    place(sfx, click(0.03, 2600), PT[k][0] + 0.05, 0.3)
    if k != "p1":
        sw(PT[k][0], 0.35, 3000, 600, 0.18, 0.3)
# p1
for pat in ("répondre", "prospecter", "envoyer", "relancer"):
    place(sfx, pop(950, 450, 0.08), WD(pat) - 0.05, 0.3, pan=-0.3)
tA = WD("automatisé")
for i in range(4):
    place(sfx, click(0.025, 3200 + 200 * i), tA - 0.05 + i * 0.07, 0.3, pan=0.3)
place(sfx, boom(0.6, 200, 60, 8.0), tA + 0.55, 0.5)
place(sfx, click(0.05, 1800), tA + 0.55, 0.45)
# p2
for i in range(6):
    place(sfx, pop(1000 + 60 * i, 500, 0.07), PT["p2"][0] + 0.45 + i * 0.09, 0.2, pan=(i % 3 - 1) * 0.5)
tR = WD("recréer")
for i in range(6):
    place(sfx, whoosh(0.2, 1500, 4000), tR + i * 0.09, 0.07, pan=(i % 3 - 1) * 0.5)
    place(sfx, bell(note(83 + (i % 3) * 2), 0.4, 0.3), tR + i * 0.09 + 0.2, 0.04)
tE = WD("économisez")
sw(tE, 0.4, 500, 3000, 0.25)
tic = tt(0.9)
ching = sum(np.sin(2 * np.pi * f * tic) * np.exp(-tic * k) for f, k in ((2637, 5), (3729, 7), (5274, 9), (6645, 12))) * 0.3
place(sfx, ching, tE + 0.2, 0.35)
for i in range(6):
    place(sfx, click(0.03, 4500 + 300 * i), tE + 0.3 + i * 0.09, 0.12, pan=rng.uniform(-0.6, 0.6))
# p3
tAg, tF = WD("agences"), WD("fini")
place(sfx, pop(900, 450, 0.08), tAg - 0.15, 0.3)
place(sfx, swept_noise(0.25, 6000, 1500, q=0.5) * np.linspace(1, 0, int(0.25 * SR)), tF + 0.25, 0.15)
place(sfx, boom(0.7, 180, 50, 7.0), tF + 0.32, 0.5)
place(sfx, click(0.05, 1600), tF + 0.32, 0.4)
tP, tV = WD("photos"), WD("vidéos")
for i in range(6):
    place(sfx, pop(1200 + 80 * i, 600, 0.06), (tP if i % 2 == 0 else tV) + (i % 3) * 0.08, 0.2, pan=-0.4)
tI = WD("^IA", 0, PT["p3"][0] + 5)
place(sfx, whoosh(0.6, 800, 6000), tI - 0.3, 0.2)
for i, n in enumerate((81, 86, 90)):
    place(sfx, bell(note(n), 1.6, 0.6), tI + 0.1 + i * 0.07, 0.08, pan=(-0.3, 0.3, 0)[i])
tM = WD("montages")
for i in range(3):
    place(sfx, pop(1300, 600, 0.08), tM - 0.15 + i * 0.16, 0.25, pan=0.5)
# appel à l'action
place(sfx, pop(1000, 500, 0.08), WD("PME", 0, PT["cta"][0]) - 0.1, 0.3)
tC = WD("commenter")
place(sfx, ping(1318, 1760), tC - 0.12, 0.45)
tPa = WD("parle")
sw(tPa, 0.4, 600, 3500, 0.25, -0.4)
place(sfx, ping(1568, 2093), tPa + 0.35, 0.3, pan=-0.4)
# carte de fin : signature Luma
sw(VD + 0.15, 0.6, 500, 4000, 0.3)
for i, (n, gg) in enumerate(((76, 0.3), (83, 0.27), (88, 0.3), (95, 0.14))):
    place(sfx, bell(note(n), 2.0, 0.8), VD + 0.2 + i * 0.075, gg * 0.8, pan=(-0.35, 0.35, 0, 0.2)[i])

# ---------- VOIX ----------
raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(DIR / "build" / "voice.wav"),
                      "-af", "highpass=f=80,afftdn=nr=10:nf=-45,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=4dB,equalizer=f=3500:t=q:w=1:g=2",
                      "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
v = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
vo = np.zeros((N, 2))
place(vo, v, 0.0)
vo /= np.max(np.abs(vo)) + 1e-9

# ---------- MIX ----------
music = reverb(music, 1.3, 0.15)
sfx = reverb(sfx, 1.0, 0.18)
e = np.abs(vo).mean(axis=1)
k = int(0.1 * SR)
e = np.convolve(e, np.ones(k) / k, mode="same")
e = np.minimum(1, e / (np.percentile(e[e > 1e-4], 85) + 1e-9))
music *= (1 - 0.7 * e)[:, None]
sfx *= (1 - 0.35 * e)[:, None]
mix = music * 0.5 + sfx * 0.55 + vo * 1.0
tail = int(0.7 * SR)
mix[-tail:] *= np.linspace(1, 0, tail)[:, None] ** 2
mix /= np.max(np.abs(mix))
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
(DIR / "out").mkdir(exist_ok=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
                "-af", "loudnorm=I=-14:TP=-1.0:LRA=9", "-ar", str(SR), str(DIR / "out" / "reel-audio.wav")],
               input=(mix * 0.97).astype(np.float32).tobytes(), check=True)
print("audio OK")
