"""Version dynamique du Reel « Mes deux facettes » : coups de zoom calés sur chaque phrase, zoom progressif
pendant le doute, phrases qui « poppent », flash + secousse au passage à « Je peux le faire. ».

Mêmes instants que la référence (musique calée). Entrées : deux-facettes.json, build/facettes/*.png (facettes.cjs),
src/facettes/robin.mov, src/ref6/ref.mp4. Sortie : out/reel-deux-facettes.mp4
"""
import json
import math
import subprocess
from pathlib import Path

import cv2
import numpy as np

DIR = Path(__file__).parent
S = json.loads((DIR / "deux-facettes.json").read_text())
B = DIR / "build" / "facettes"
R = S["robin"]
FPS, W, H = 30, 1080, 1920
T = S["title"][1]["from"]              # bascule « Je peux le faire. »
TOTAL = S["total"]
A0 = 0.6                               # on saute le geste du tout début
slow = T / (R["switch"] - A0)
FACE = (760, 1150)                     # centre des zooms : votre visage

# --- base vidéo : doute ralenti (filmé à 120 i/s) puis travail à vitesse réelle ---
fc = (f"[0:v]trim={A0}:{R['switch']},setpts=(PTS-STARTPTS)*{slow:.5f},fps={FPS},scale={W}:{H},setsar=1[a];"
      f"[0:v]trim={R['switch']}:{R['switch'] + TOTAL - T:.3f},setpts=PTS-STARTPTS,fps={FPS},scale={W}:{H},setsar=1[b];"
      "[a][b]concat=n=2:v=1:a=0[v]")
dec = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", str(DIR / R["src"]), "-filter_complex", fc, "-map", "[v]",
                        "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)


def load(name):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(B / f"{name}.png"), "-f", "rawvideo", "-pix_fmt", "bgra", "-"],
                         capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.uint8).reshape(H, W, 4)
    ys, xs = np.where(a[..., 3] > 0)
    y0, y1, x0, x1 = max(ys.min() - 30, 0), min(ys.max() + 30, H), max(xs.min() - 30, 0), min(xs.max() + 30, W)
    return {"img": a[y0:y1, x0:x1].astype(np.float32) / 255, "box": (x0, y0)}


# calques : (image, apparition, disparition, force du coup de zoom)
L = [(load("titre0"), 0.0, T, 0.0), (load("titre1"), T, TOTAL + 1, 0.0)]
L += [(load(f"neg{i:02d}"), p["in"], p["out"], 0.07) for i, p in enumerate(S["negatives"])]
L += [(load(f"pos{i}"), p["in"], TOTAL + 1, 0.08) for i, p in enumerate(S["positives"])]
POP = [1.38, 1.18, 1.06, 0.97, 1.0]    # rebond à l'apparition (une valeur par image)
punches = [(a, f) for _, a, _, f in L if f] + [(T, 0.16)]
punches += [(p["out"], 0.025) for p in S["negatives"]]  # petit à-coup quand une pensée s'efface


def zoom(t):
    z = 1.0 + 0.16 * min(t, T) / T if t < T else 1.03 + 0.05 * (t - T) / (TOTAL - T)
    z += sum(f * math.exp(-(t - a) / 0.11) for a, f in punches if 0 <= t - a < 0.8)
    return z


def blend(frame, layer, scale):
    img, (x0, y0) = layer["img"], layer["box"]
    h, w = img.shape[:2]
    if scale != 1.0:
        img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_LINEAR)
    nh, nw = img.shape[:2]
    cx, cy = x0 + w / 2, y0 + h / 2
    X0, Y0 = int(round(cx - nw / 2)), int(round(cy - nh / 2))
    fx0, fy0, fx1, fy1 = max(X0, 0), max(Y0, 0), min(X0 + nw, W), min(Y0 + nh, H)
    if fx1 <= fx0 or fy1 <= fy0:
        return
    sub = img[fy0 - Y0:fy1 - Y0, fx0 - X0:fx1 - X0]
    al = sub[..., 3:4]
    reg = frame[fy0:fy1, fx0:fx1]
    frame[fy0:fy1, fx0:fx1] = reg * (1 - al) + sub[..., :3] * al


out = DIR / "out" / "reel-deux-facettes.mp4"
enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS),
                        "-i", "-", "-i", str(DIR / "src" / "ref6" / "ref.mp4"), "-map", "0:v", "-map", "1:a",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-maxrate", "12M", "-bufsize", "24M", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "192k", "-t", str(TOTAL), "-movflags", "+faststart", str(out)], stdin=subprocess.PIPE)
n_total = int(round(TOTAL * FPS))
rng = np.random.default_rng(3)
for n in range(n_total):
    raw = dec.stdout.read(W * H * 3)
    if len(raw) < W * H * 3:
        break
    t = n / FPS
    src = np.frombuffer(raw, np.uint8).reshape(H, W, 3)
    z = zoom(t)
    dx = dy = 0.0
    if 0 <= t - T < 0.35:  # secousse au passage
        amp = 14 * (1 - (t - T) / 0.35)
        dx, dy = rng.uniform(-amp, amp, 2)
    M = np.float32([[z, 0, FACE[0] * (1 - z) + dx], [0, z, FACE[1] * (1 - z) + dy]])
    frame = cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT).astype(np.float32) / 255
    if 0 <= t - T < 0.2:  # flash
        frame += (1 - frame) * 0.75 * (1 - (t - T) / 0.2)
    for layer, a, b, _ in L:
        if a <= t < b:
            k = int(round((t - a) * FPS))
            blend(frame, layer, POP[k] if k < len(POP) else 1.0)
    enc.stdin.write((np.clip(frame, 0, 1) * 255).astype(np.uint8).tobytes())
enc.stdin.close()
enc.wait()
dec.terminate()
print(f"OK {out} (ralenti ×{slow:.2f}, {n_total} images)")
