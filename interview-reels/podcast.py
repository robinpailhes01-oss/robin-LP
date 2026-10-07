"""Reel « podcast » en écran partagé : Robin en haut (caméra A), l'intervieweuse en bas (caméra B),
sous-titres mot à mot au centre, petites touches de motion design (coups de zoom aux coupes, filet lumineux, étiquette).

Usage : python3 podcast.py clips/<nom>.json
Le JSON décrit les morceaux gardés (temps de la caméra A) et les mots (texte corrigé + temps), voir clips/agent-whatsapp.json.
Les deux caméras sont synchronisées : temps B = temps A + OFFSET (mesuré par corrélation du son, 0,48 s).
"""
import json
import os
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np

DIR = Path(__file__).parent
R = DIR / "rushes" / "v2"
OFFSET = 0.48
FPS, W, H = 30, 1080, 1920
HALF = H // 2
CROP_A, CROP_B = 360, 230          # haut du recadrage 1080×960 dans chaque caméra (visages au centre)

C = json.loads(Path(sys.argv[1]).read_text())
name = Path(sys.argv[1]).stem
B = DIR / "build" / name
B.mkdir(parents=True, exist_ok=True)

# --- 1. timeline : morceaux de la caméra A recollés, mots replacés ---
pieces, t, spk = [], 0.0, []
for p in C["pieces"]:
    a, b = p[0], p[1]
    pieces.append((a, b, t))
    spk.append(p[2] if len(p) > 2 else "r")   # "q" = question (personne du bas), "r" = Robin
    t += b - a
TOTAL = t
words = []
for txt, s, e in C["words"]:
    for pi, (a, b, at) in enumerate(pieces):
        if a - 0.05 <= s < b:
            words.append([txt, at + max(0.0, s - a), at + min(b - a, e - a), spk[pi]])
            break
words.sort(key=lambda w: w[1])
cuts = [at for _, _, at in pieces[1:]]

# --- 2. vidéo de base : A en haut, B en bas, son de A (un morceau à la fois, pour la mémoire) ---
base = B / "base.mp4"
parts = []
for k, (a, b, _) in enumerate(pieces):
    d = b - a
    pk = B / f"piece{k:02d}.mov"
    fc = (f"[0:v]fps={FPS},crop={W}:{HALF}:0:{CROP_A}[ta];[1:v]fps={FPS},crop={W}:{HALF}:0:{CROP_B}[tb];"
          f"[ta][tb]vstack,setsar=1,trim=duration={d:.3f}[v];"
          f"[0:a]atrim=duration={d:.3f},afade=t=in:d=0.015,afade=t=out:st={max(0, d - 0.02):.3f}:d=0.02[a]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{a:.3f}", "-t", f"{d + 0.2:.3f}", "-i", str(R / "camA.mov"),
                    "-ss", f"{a + OFFSET:.3f}", "-t", f"{d + 0.2:.3f}", "-i", str(R / "camB.mov"), "-filter_complex", fc,
                    "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "16", "-preset", "fast", "-c:a", "pcm_s16le", str(pk)],
                   check=True)
    parts.append(pk)
(B / "parts.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(B / "parts.txt"), "-c", "copy",
                str(base.with_suffix(".mov"))], check=True)

# --- 3. sous-titres : groupes de 3-4 mots, mot prononcé surligné, rendus en PNG (un par état) ---
groups, cur = [], []
for w in words:
    if cur and cur[-1][3] != w[3]:          # jamais de groupe à cheval sur deux personnes
        groups.append(cur); cur = []
    cur.append(w)
    if len(cur) >= 4 or w[0].endswith((".", ",", "?", "!", ":")) or (len(cur) >= 3 and len(" ".join(x[0] for x in cur)) > 18):
        groups.append(cur); cur = []
if cur:
    groups.append(cur)
states = []  # (début, fin, index_groupe, index_mot)
for gi, g in enumerate(groups):
    for wi, w in enumerate(g):
        end = g[wi + 1][1] if wi + 1 < len(g) else (groups[gi + 1][0][1] if gi + 1 < len(groups) else TOTAL)
        if wi + 1 == len(g):
            end = min(end, w[2] + 0.35)
        states.append((w[1], end, gi, wi))
spec = {"groups": [[w[0] for w in g] for g in groups], "speakers": [g[0][3] for g in groups], "keys": C.get("keys", []), "tag": C.get("tag", ""),
        "hook": C.get("hook", ""), "out": str(B)}
(B / "spec.json").write_text(json.dumps(spec, ensure_ascii=False))
subprocess.run(["node", str(DIR / "podcast_text.cjs"), str(B / "spec.json")], check=True,
               env={**os.environ, "NODE_PATH": "/opt/node-tools/node_modules"})


def png(path):
    a = cv2.imread(str(path), cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
    ys, xs = np.where(a[..., 3] > 0)
    if len(ys) == 0:
        return None
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    return a[y0:y1, x0:x1], x0, y0


cache = {}


def layer(key, path):
    if key not in cache:
        cache[key] = png(path)
    return cache[key]


def blend(frame, lay, scale=1.0, alpha=1.0, dy=0):
    if lay is None:
        return
    img, x0, y0 = lay
    h, w = img.shape[:2]
    if scale != 1.0:
        img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_LINEAR)
    nh, nw = img.shape[:2]
    X, Y = int(x0 + w / 2 - nw / 2), int(y0 + h / 2 - nh / 2 + dy)
    fx0, fy0, fx1, fy1 = max(X, 0), max(Y, 0), min(X + nw, W), min(Y + nh, H)
    if fx1 <= fx0 or fy1 <= fy0:
        return
    sub = img[fy0 - Y:fy1 - Y, fx0 - X:fx1 - X]
    al = sub[..., 3:4] * alpha
    frame[fy0:fy1, fx0:fx1] = frame[fy0:fy1, fx0:fx1] * (1 - al) + sub[..., :3] * al


# --- 4. composition image par image ---
dec = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", str(base.with_suffix(".mov")), "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
                       stdout=subprocess.PIPE)
out = DIR / "out" / f"podcast-{name}.mp4"
out.parent.mkdir(exist_ok=True)
enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS),
                        "-i", "-", "-i", str(base.with_suffix(".mov")), "-map", "0:v", "-map", "1:a",
                        "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:v", "libx264", "-preset", "slow", "-crf", "20",
                        "-maxrate", "12M", "-bufsize", "24M", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                        "-movflags", "+faststart", str(out)], stdin=subprocess.PIPE)
POP = [1.12, 1.05, 1.0]
n = 0
while True:
    raw = dec.stdout.read(W * H * 3)
    if len(raw) < W * H * 3:
        break
    t = n / FPS
    src = np.frombuffer(raw, np.uint8).reshape(H, W, 3)
    frame = src.astype(np.float32) / 255
    # coup de zoom sur la moitié haute à chaque coupe (et léger zoom continu)
    since = min([t - c for c in cuts if t >= c] + [t])
    pi = max([i for i, (_, _, at) in enumerate(pieces) if at <= t] + [0])
    who = spk[pi]
    z = 1.0 + 0.02 * t / max(TOTAL, 1) + 0.05 * np.exp(-since / 0.18)
    sl = slice(0, HALF) if who == "r" else slice(HALF, H)
    half = frame[sl]
    M = np.float32([[z, 0, W / 2 * (1 - z)], [0, z, HALF * 0.45 * (1 - z)]])
    frame[sl] = cv2.warpAffine(half, M, (W, HALF), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    if who == "q":
        qs = pieces[pi][2]
        blend(frame, layer("qlabel", B / "qlabel.png"), scale=POP[min(int((t - qs) * FPS), 2)] if t - qs < 0.1 else 1.0)
    blend(frame, layer("seam", B / "seam.png"))
    if C.get("tag"):
        blend(frame, layer("tag", B / "tag.png"), alpha=min(1, max(0, t - C.get("hook_until", 0)) / 0.4))
    if C.get("hook") and t < C.get("hook_until", 3.0):
        k = int(t * FPS)
        blend(frame, layer("hook", B / "hook.png"), scale=POP[k] if k < len(POP) else 1.0,
              alpha=min(1, (C.get("hook_until", 3.0) - t) / 0.25))
    for s, e, gi, wi in states:
        if s <= t < e:
            k = int(round((t - groups[gi][0][1]) * FPS))
            blend(frame, layer(f"g{gi}w{wi}", B / f"sub_{gi:03d}_{wi:02d}.png"), scale=POP[k] if 0 <= k < len(POP) else 1.0)
            break
    enc.stdin.write((np.clip(frame, 0, 1) * 255).astype(np.uint8).tobytes())
    n += 1
enc.stdin.close()
enc.wait()
print(f"OK {out} ({TOTAL:.1f} s, {len(groups)} groupes de sous-titres)")
