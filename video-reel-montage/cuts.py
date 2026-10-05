"""Découpe les rushes : garde les bonnes prises, supprime les blancs, recolle en 1080×1920.

Sorties : build/base.mp4 (vidéo montée, sans habillage), build/voice.wav, build/frames/*.jpg, cues.json
(mots horodatés sur la nouvelle timeline, points de coupe, bornes des parties).
"""
import json
import subprocess
from pathlib import Path

import numpy as np

DIR = Path(__file__).parent
R = DIR / "rushes"
B = DIR / "build"
B.mkdir(exist_ok=True)
WORDS = json.loads((R / "words.json").read_text())
SR = 16000

# Prises retenues (rush, début, fin, partie). La 1re prise du point 2 (15,8 → 24,9 s) est écartée.
TAKES = [
    ("IMG_0808", 0.60, 7.00, "hook"),
    ("IMG_0808", 7.15, 15.30, "p1"),
    ("IMG_0808", 28.25, 35.95, "p2"),
    ("IMG_0808", 36.15, 48.95, "p3"),
    ("IMG_0809", 0.85, 9.45, "cta"),
]
MIN_SIL, KEEP = 0.20, 0.06  # blanc minimum coupé, marge gardée de chaque côté


def rms_env(name):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(R / f"{name}.wav"), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32)
    hop = int(0.01 * SR)
    n = len(x) // hop
    return np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1))


clips = []  # (rush, a, b, partie)
for rush, a, b, part in TAKES:
    env = rms_env(rush)
    seg = env[int(a * 100):int(b * 100)]
    db = 20 * np.log10(np.convolve(seg, np.ones(3) / 3, mode="same") + 1e-9)
    speech = db > -40.0
    # zones silencieuses assez longues → coupe
    i, n = 0, len(speech)
    cur = a
    while i < n:
        if not speech[i]:
            j = i
            while j < n and not speech[j]:
                j += 1
            s0, s1 = a + i / 100, a + j / 100
            if (s1 - s0) >= MIN_SIL and i > 0 and j < n:
                clips.append((rush, cur, s0 + KEEP, part))
                cur = s1 - KEEP
            i = j
        else:
            i += 1
    clips.append((rush, cur, b, part))
# fusionne les morceaux trop courts avec le précédent
merged = []
for c in clips:
    if merged and c[1] - merged[-1][2] < 0.02 and merged[-1][0] == c[0]:
        merged[-1] = (c[0], merged[-1][1], c[2], c[3])
    else:
        merged.append(c)
clips = [c for c in merged if c[2] - c[1] > 0.12]

# nouvelle timeline
t = 0.0
timeline, words_out, cuts, parts = [], [], [], {}
for rush, a, b, part in clips:
    d = b - a
    timeline.append({"rush": rush, "a": round(a, 3), "b": round(b, 3), "at": round(t, 3), "part": part})
    for w, s, e in WORDS[rush]:
        mid = (s + e) / 2
        if a <= mid < b:
            words_out.append([w, round(t + max(0, s - a), 3), round(t + min(d, e - a), 3), part])
    parts.setdefault(part, [t, t + d])[1] = t + d
    cuts.append(round(t, 3))
    t += d
dur = round(t, 3)
print(f"{len(clips)} plans, durée {dur:.2f} s (rushes : {sum(b - a for _, a, b, _ in TAKES):.2f} s gardés avant coupe des blancs)")

# rendu de la base à partir des rushes déjà convertis en 1080p (lecture directe du HLG + léger étalonnage, 30 i/s)
GRADE = "format=yuv420p"  # étalonnage déjà appliqué dans les versions 1080p des rushes
inputs, fc, cat = [], [], []
srcs = sorted({c["rush"] for c in timeline})
for s in srcs:
    inputs += ["-i", str(R / f"{s}-1080.mov")]
for k, c in enumerate(timeline):
    si = srcs.index(c["rush"])
    d = c["b"] - c["a"]
    fc.append(f"[{si}:v:0]trim={c['a']}:{c['b']},setpts=PTS-STARTPTS,fps=30,{GRADE}[v{k}]")
    fc.append(f"[{si}:a:0]atrim={c['a']}:{c['b']},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={max(0, d - 0.015):.3f}:d=0.015[a{k}]")
    cat.append(f"[v{k}][a{k}]")
fc.append("".join(cat) + f"concat=n={len(timeline)}:v=1:a=1[v][a]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]",
                "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-c:a", "pcm_s16le", str(B / "base.mov")], check=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(B / "base.mov"), "-vn", "-ar", "48000", "-ac", "1", str(B / "voice.wav")], check=True)
fr = B / "frames"
fr.mkdir(exist_ok=True)
for old in fr.glob("*.jpg"):
    old.unlink()
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(B / "base.mov"), "-q:v", "2", str(fr / "%05d.jpg")], check=True)

(DIR / "cues.json").write_text(json.dumps({"duration": dur, "fps": 30, "clips": timeline, "words": words_out, "cuts": cuts,
                                           "parts": {k: [round(v[0], 3), round(v[1], 3)] for k, v in parts.items()}}, ensure_ascii=False, indent=1))
print("parties :", {k: [round(v[0], 2), round(v[1], 2)] for k, v in parts.items()})
