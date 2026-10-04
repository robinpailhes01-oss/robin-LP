"""Musique, sound design et mixage de la pub Luma (tout est synthétisé ici, aucune banque de sons).

Sortie : out/luma-audio.wav (48 kHz stéréo). Les timings viennent de cues.json, comme l'animation.
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
rng = np.random.default_rng(42)

music = np.zeros((N, 2))
sfx = np.zeros((N, 2))
vo = np.zeros((N, 2))


# ---------- outils ----------
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


# ---------- MUSIQUE ----------
FL = C["flash"]
BEAT = 0.5  # 120 BPM, calé sur le flash

# A — tension (0 → gel)
fz = C["freeze"]
for k in range(int(fz / 0.25)):
    at = 0.05 + k * 0.25
    lvl = 0.35 + 0.65 * at / fz
    place(music, bass_note(note(28), 0.22) * 1.1, at, 0.55 * lvl)
    place(music, bass_note(note(40), 0.12), at, 0.18 * lvl)
for k in range(int(fz / 0.125)):
    at = 0.05 + k * 0.125
    place(music, hat(), at, (0.10 + 0.12 * (at / fz)) * (1.4 if k % 2 == 0 else 0.7), pan=0.35 if k % 2 else -0.35)
place(music, chord_pad([40, 47, 52, 55], fz + 0.3, cutoff=900, att=0.6, rel=0.25), 0.0, 0.25)

# B — suspension (gel → flash)
place(music, chord_pad([28, 40, 47, 55, 59], FL - fz + 0.1, cutoff=650, att=0.4, rel=0.15), fz, 0.42)
rise = swept_noise(C["flash"] - C["suck"][0], 300, 9000, q=0.5, curve=2.2)
rise *= np.linspace(0, 1, len(rise)) ** 2.2
place(music, rise, C["suck"][0], 0.42)
t_r = tt(FL - C["suck"][0])
sine_rise = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (t_r / t_r[-1] * 2.5)) / SR) * (t_r / t_r[-1]) ** 2
place(music, sine_rise, C["suck"][0], 0.12)
rev = crash(1.1)[::-1]
place(music, rev, FL - len(rev) / SR, 0.35)

# C — groove (flash → rideau blanc)
WW = C["wipeWhite"]
prog_chords = [([52, 56, 59, 63, 66], 40), ([49, 52, 56, 59, 63], 37), ([45, 52, 56, 57, 61], 33), ([47, 51, 54, 57, 61], 35)]
for b in range(int(np.ceil((WW - FL) / 2.0))):
    start = FL + b * 2.0
    d = min(2.0, WW - start)
    if d <= 0:
        break
    notes, root = prog_chords[b % 4]
    place(music, chord_pad(notes, d + 0.05, cutoff=2400, att=0.03, rel=0.08), start, 0.30)
    for k in range(int(d / 0.25)):
        at = start + k * 0.25
        if k % 2 == 1:
            place(music, bass_note(note(root), 0.24), at, 0.75)
        else:
            place(music, bass_note(note(root - 12), 0.18), at, 0.45)
    arp = [notes[i % len(notes)] + 12 for i in (0, 2, 4, 1, 3, 2, 4, 3)]
    for k in range(int(d / 0.125)):
        place(music, pluck(note(arp[k % len(arp)])), start + k * 0.125, 0.07, pan=np.sin(k * 0.9) * 0.6)
nb = int((WW - FL) / BEAT)
for k in range(nb):
    at = FL + k * BEAT
    place(music, kick(), at, 0.95)
    if k % 2 == 1:
        place(music, clap(), at, 0.55)
    place(music, hat(open_=True), at + 0.25, 0.10, pan=0.25)
    for s16 in (0.125, 0.375):
        place(music, hat(), at + s16, 0.06, pan=-0.3)
# roulement avant le logo
for k in range(12):
    at = WW - 0.62 + k * (0.62 / 12)
    place(music, clap(0.12), at, 0.12 + 0.35 * k / 12)

# mélodie « marimba » légère et entraînante, le refrain de la pub
def marimba(f, d=0.45):
    t = tt(d)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 9) + 0.25 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 30)
    return s * np.minimum(1, t / 0.002)


HOOK = {0: 76, 3: 80, 6: 83, 8: 80, 10: 78, 12: 76, 14: 78, 16: 80, 19: 83, 22: 85, 24: 83, 26: 80, 28: 78, 30: 76}
for bar2 in range(int(np.ceil((WW - FL) / 4.0))):
    for step, n in HOOK.items():
        at = FL + bar2 * 4.0 + step * 0.125
        if at < WW - 0.1:
            place(music, marimba(note(n)), at, 0.16, pan=0.25 if step % 4 else -0.25)
            place(music, marimba(note(n + 12), 0.3), at + 0.375, 0.035, pan=-0.5)  # écho

# D — logo
LL = C["logoLand"]
place(music, chord_pad([40, 52, 56, 59, 63, 66, 71], DUR - LL + 0.2, cutoff=3200, att=0.05, rel=1.4), LL, 0.30)
place(music, bass_note(note(28), 1.6) * 1.2, LL, 0.7)
for k in range(int((DUR - 1.2 - (LL + 1.0)) / BEAT)):
    at = LL + 1.0 + k * BEAT
    place(music, kick(punch=0.6), at, 0.42)
    place(music, hat(open_=True), at + 0.25, 0.06)
    if k % 2 == 1:
        place(music, bass_note(note(28 + (0 if (k // 4) % 2 == 0 else 5)), 0.3), at, 0.35)
for bar2 in range(int((DUR - 1.5 - (LL + 1.0)) / 4.0) + 1):
    for step, n in HOOK.items():
        at = LL + 1.0 + bar2 * 4.0 + step * 0.125
        if at < DUR - 1.2:
            place(music, marimba(note(n)), at, 0.09, pan=0.25 if step % 4 else -0.25)
for k in range(int((DUR - 1.0 - LL) / 0.25)):
    nts = [76, 83, 80, 88, 83, 87]
    place(music, pluck(note(nts[k % len(nts)])), LL + 0.5 + k * 0.25, 0.04 * (1 - k / 30), pan=np.sin(k) * 0.7)

# ---------- SOUND DESIGN ----------
for i, at in enumerate(C["notifs"]):
    kind = i % 3
    if kind == 0:
        s = ping(1760, 2350)
    elif kind == 1:
        s = ping(1318, 1975)
    else:
        s = pop(1400, 700, 0.07) * 0.8
    place(sfx, s, at, 0.24 + 0.08 * (i / len(C["notifs"])), pan=rng.uniform(-0.8, 0.8))
for at in C["buzz"]:
    place(sfx, buzz(), at, 0.35, pan=-0.3)
for at in C["slam"]:
    place(sfx, filt(boom(1.0, 160, 40, 5.0), "low", 220), at - 0.03, 0.8)
    place(sfx, whoosh(0.22, 4000, 900), at - 0.24, 0.18)
# gel : chute de pitch + grave
t_s = tt(0.6)
place(sfx, np.sin(2 * np.pi * np.cumsum(300 * np.exp(-t_s * 5) + 40) / SR) * np.exp(-t_s * 4), fz, 0.35)
place(sfx, boom(1.8, 90, 30, 2.0), fz, 0.6)
# aspiration
place(sfx, whoosh(C["suck"][1] - C["suck"][0], 6000, 400, curve=0.6), C["suck"][0], 0.25)
# flash
place(sfx, boom(2.4, 140, 32, 1.6), FL, 1.0)
place(sfx, crash(2.6), FL, 0.35)
place(sfx, bell(note(88), 2.0, 0.6), FL + 0.02, 0.12, pan=0.4)
place(sfx, bell(note(95), 2.0, 0.6), FL + 0.05, 0.08, pan=-0.4)
# conversation
for i, at in enumerate(C["bubbles"]):
    place(sfx, pop(1100 if i != 1 else 1500, 450, 0.08), at, 0.45, pan=-0.3 if i != 1 else 0.3)
for k in range(int((C["typing"][1] - C["typing"][0]) / 0.07)):
    place(sfx, click(0.015, 4500), C["typing"][0] + k * 0.07 + rng.uniform(0, 0.02), 0.12, pan=0.3)
place(sfx, boom(0.6, 200, 60, 8.0), C["stamp"], 0.55)
place(sfx, click(0.05, 1800), C["stamp"], 0.6)
place(sfx, bell(note(88), 1.0, 0.5), C["rdv"], 0.18)
place(sfx, bell(note(95), 1.2, 0.5), C["rdv"] + 0.08, 0.16)
# l'heure qui file
t0, t1 = C["clock"]
x = t0
while x < t1:
    place(sfx, click(0.02, 2200 if int((x - t0) * 50) % 2 else 1700), x, 0.22, pan=0.2)
    x += max(0.035, 0.12 * (1 - (x - t0) / (t1 - t0)))
for i, at in enumerate(C["toasts"]):
    place(sfx, bell(note([76, 80, 83][i] + 12), 0.9, 0.5), at, 0.2, pan=[-0.5, 0.5, -0.2][i])
    place(sfx, pop(900, 400), at, 0.25)
# outil sur mesure : les modules s'emboîtent
for i, at in enumerate(C["tiles"]):
    place(sfx, whoosh(0.3, 2500, 700), at - 0.12, 0.12, pan=(-0.4 if i % 2 == 0 else 0.4))
    place(sfx, filt(boom(0.35, 220, 90, 14.0), "low", 400), at + 0.3, 0.35)
    place(sfx, click(0.03, 2400), at + 0.3, 0.35, pan=(-0.4 if i % 2 == 0 else 0.4))
place(sfx, boom(0.6, 200, 60, 8.0), C["surMesure"], 0.5)
place(sfx, click(0.05, 1800), C["surMesure"], 0.55)
# l'outil se replie en hub, les outils se connectent
place(sfx, whoosh(0.5, 6000, 500, curve=0.8), C["build"][1] - 0.1, 0.3)
place(sfx, boom(1.0, 150, 45, 4.0), C["build"][1] + 0.2, 0.55)
for i, at in enumerate(C["nodes"]):
    place(sfx, pop(1200 + 90 * i, 500, 0.07), at, 0.3, pan=np.cos(np.radians(-90 + i * 45)) * 0.7)
    t_z = tt(0.18)
    zap = np.sin(2 * np.pi * np.cumsum(600 + 2400 * t_z / 0.18) / SR) * np.exp(-t_z * 14)
    place(sfx, zap, at + 0.05, 0.06, pan=np.cos(np.radians(-90 + i * 45)) * 0.7)
place(sfx, whoosh(0.45, 600, 5000), C["hub"][1] - 0.1, 0.35)
# relance, puis bascule vers le rapport
place(sfx, bell(note(83), 0.8, 0.5), C["relance"], 0.18, pan=-0.4)
place(sfx, pop(900, 400), C["relance"], 0.25)
place(sfx, bell(note(88), 0.8, 0.5), C["rdv"] + 0.12, 0.15, pan=0.4)
place(sfx, whoosh(0.5, 5000, 600), C["report"][0] - 0.05, 0.4)
for i, at in enumerate(C["rows"]):
    place(sfx, click(0.03, 3000 + 400 * i), at, 0.25)
    place(sfx, swept_noise(0.5, 400, 3000, q=0.4) * np.linspace(1, 0, int(0.5 * SR)) ** 2, at + 0.08, 0.05)
place(sfx, ping(1318, 1760), C["reportNotif"], 0.4)

# rideau violet + coups
place(sfx, whoosh(0.55, 300, 5000), C["wipeViolet"] - 0.15, 0.5)
for at in (C["hitTemps"], C["hitArgent"]):
    place(sfx, boom(0.9, 170, 45, 6.0), at, 0.6)
    place(sfx, clap(), at, 0.35)
tic = tt(0.9)
place(sfx, sum(np.sin(2 * np.pi * f * tic) * np.exp(-tic * k) for f, k in ((2637, 5), (3729, 7), (5274, 9), (6645, 12))) * 0.3, C["hitArgent"] + 0.03, 0.4, pan=0.3)
for k in range(5):
    place(sfx, click(0.03, 5000), C["hitArgent"] + 0.05 + k * 0.05, 0.12, pan=0.3)
# rideau blanc → logo
place(sfx, whoosh(0.7, 500, 7000, curve=1.2), WW - 0.45, 0.5)
place(sfx, boom(2.6, 110, 30, 1.4), LL, 0.85)
# signature sonore Luma : arpège mi-si-mi + scintillement
for i, (n, g) in enumerate(((76, 0.30), (83, 0.27), (88, 0.30), (95, 0.14))):
    place(sfx, bell(note(n), 2.2, 0.8), LL + i * 0.075, g, pan=(-0.35, 0.35, 0, 0.2)[i])
place(sfx, whoosh(0.8, 3000, 12000, curve=1.0), C["sweep"], 0.18)
for at in C["sub"]:
    place(sfx, pop(800, 500, 0.06), at, 0.22)
place(sfx, pop(1200, 500, 0.1), C["cta"], 0.4)
place(sfx, bell(note(83), 0.8, 0.4), C["cta"] + 0.02, 0.1)
place(sfx, pop(1000, 500, 0.08), C["city"], 0.3)


# ---------- VOIX ----------
def load(fname):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(DIR / "assets" / fname), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


for v in C["vo"]:
    a = load(v["file"])[int(v["from"] * SR):int(v["to"] * SR)]
    fade = int(0.012 * SR)
    a[:fade] *= np.linspace(0, 1, fade)
    a[-fade:] *= np.linspace(1, 0, fade)
    place(vo, a, v["at"], 1.0)
# un peu de présence : grave coupé, léger salon
vo = filt(vo, "high", 90)
vo = reverb(vo, 0.6, 0.07, 5000)
vo /= np.max(np.abs(vo)) + 1e-9

# ---------- MIX ----------
music = reverb(music, 1.4, 0.18)
sfx = reverb(sfx, 1.2, 0.22)
# ducking de la musique sous la voix
e = np.abs(vo).mean(axis=1)
k = int(0.06 * SR)
e = np.convolve(e, np.ones(k) / k, mode="same")
e = np.minimum(1, e / (np.percentile(e[e > 1e-4], 90) + 1e-9))
duck = 1 - 0.38 * e
music *= duck[:, None]
sfx *= (1 - 0.45 * e)[:, None]

mix = music * 0.72 + sfx * 0.6 + vo * 0.95
# fondu de fin
tail = int(0.6 * SR)
mix[-tail:] *= np.linspace(1, 0, tail)[:, None] ** 2
mix /= np.max(np.abs(mix))
mix = np.tanh(mix * 1.5) / np.tanh(1.5)

out = DIR / "out"
out.mkdir(exist_ok=True)
raw = (mix * 0.97).astype(np.float32).tobytes()
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
                "-af", "loudnorm=I=-14:TP=-1.0:LRA=9", "-ar", str(SR), str(out / "luma-audio.wav")], input=raw, check=True)
print("audio OK", out / "luma-audio.wav")
