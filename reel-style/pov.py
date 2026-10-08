"""Reel « POV : il est 1h du matin mais tu es chef d'entreprise » — reprise d'une tendance :
même son et même écriture que la référence, rush de Robin éclairci, carte de fin Luma.

Usage : python3 pov.py   (calques : node text.cjs ; config : pov.json)
Timeline calquée sur la référence : plan + titre jusqu'à `cut`, 2 images noires, puis plan assombri + carte de fin.
"""
import json
import subprocess
from pathlib import Path

import cv2
import numpy as np

DIR = Path(__file__).parent
C = json.loads((DIR / "pov.json").read_text())
B = DIR / "build"
W, H, FPS = 1080, 1920, 30
TONEMAP = ("zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,"
           "zscale=t=bt709:m=bt709:r=tv,format=yuv420p")
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(DIR / C["ref"])],
                           capture_output=True, text=True).stdout)
N = int(round(dur * FPS))


def layer(name):
    a = cv2.imread(str(B / name), cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
    ys, xs = np.where(a[..., 3] > 0)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    return a[y0:y1, x0:x1].copy(), x0, y0


def blend(frame, lay, scale=1.0, alpha=1.0, dy=0):
    img, x0, y0 = lay
    h, w = img.shape[:2]
    if scale != 1.0:
        img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_LINEAR)
    nh, nw = img.shape[:2]
    X, Y = int(x0 + w / 2 - nw / 2), int(y0 + h / 2 - nh / 2 + dy)
    sub = img[max(0, -Y):H - Y, max(0, -X):W - X]
    Y, X = max(Y, 0), max(X, 0)
    al = sub[..., 3:4] * alpha
    frame[Y:Y + sub.shape[0], X:X + sub.shape[1]] = frame[Y:Y + sub.shape[0], X:X + sub.shape[1]] * (1 - al) + sub[..., :3] * al


title, brand, handle = layer("title.png"), layer("brand.png"), layer("handle.png")
# léger voile sombre derrière le titre (le plafond du bateau est clair, la référence avait un mur sombre)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
SHADE = (C.get("shade", 0.28) * np.exp(-(((xx - W / 2) / 560) ** 2 + ((yy - C.get("shade_y", 610)) / 190) ** 2)))[..., None]
ease = lambda x: 1 - (1 - min(max(x, 0), 1)) ** 3
dec = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-ss", str(C["start"]), "-i", str(DIR / C["rush"]), "-t", f"{dur + 0.2:.3f}",
                        "-vf", f"{TONEMAP},{C['grade']},fps={FPS},scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
                       stdout=subprocess.PIPE)
out = DIR / "out" / "reel-pov-1h.mp4"
out.parent.mkdir(exist_ok=True)
enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS),
                        "-i", "-", "-i", str(DIR / C["ref"]), "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow",
                        "-crf", "18", "-maxrate", "12M", "-bufsize", "24M", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
                        "-t", f"{dur:.3f}", "-movflags", "+faststart", str(out)], stdin=subprocess.PIPE)
cut, black = C["cut"], C["black"]
for n in range(N):
    raw = dec.stdout.read(W * H * 3)
    if len(raw) < W * H * 3:
        break
    t = n / FPS
    f = np.frombuffer(raw, np.uint8).reshape(H, W, 3).astype(np.float32) / 255
    f *= 1 - SHADE
    blend(f, title)
    if cut <= t < cut + black:
        f[:] = 0
    elif t >= cut + black:
        f *= C["dim"]                                   # plan et titre assombris, comme la référence
        e = t - cut - black
        # logo : apparaît grand puis se pose (rebond), le texte du dessous glisse vers le haut
        s = 1.18 - 0.18 * ease(e / 0.28)
        blend(f, brand, scale=s, alpha=min(1, e / 0.05))
        he = e - 0.2
        if he > 0:
            blend(f, handle, alpha=min(1, he / 0.15), dy=int(26 * (1 - ease(he / 0.3))))
    enc.stdin.write((np.clip(f, 0, 1) * 255).astype(np.uint8).tobytes())
enc.stdin.close()
enc.wait()
dec.terminate()
print("OK", out, f"{dur:.2f} s")
