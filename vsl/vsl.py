"""VSL de la page de vente Luma : rushs face caméra (vertical) montés sans les blancs, sous-titres élégants,
motion design calé sur les mots (pastilles, chiffres, notifications) et captures plein écran (conversation, tableau de bord…).

Usage : python3 vsl.py vsl.json
- Les blancs sont détectés sur le son (énergie) ; une zone de parole sans aucun mot transcrit (« euh », souffle) est retirée.
- Les ancres des éléments sont en temps du rush : {"at": ["r9", 14.6], "end": ["r9", 19.6]}.
"""
import json
import os
import subprocess
import sys
import wave
from pathlib import Path

import cv2
import numpy as np

DIR = Path(__file__).parent
R = DIR / "rushes"
FPS = 30
TONEMAP = ("zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,"
           "zscale=t=bt709:m=bt709:r=tv,format=yuv420p")
C = json.loads(Path(sys.argv[1]).read_text())
W, H = C.get("size", [1920, 1080])          # les rushs sont en paysage (le téléphone stocke l'image couchée + rotation)
B = DIR / "build"
B.mkdir(exist_ok=True)
WORDS = json.loads((R / "words.json").read_text())


# --- 1. découpe : zones de parole (son) qui contiennent au moins un mot ---
def merged_words(r):
    m = []
    for t, s, e in WORDS[r]:
        if m and (t.startswith(("'", "-")) or t in ("?", "%")):
            m[-1] = [m[-1][0] + (" " if t in ("?", "%") else "") + t, m[-1][1], e]
        else:
            m.append([t, s, e])
    fixes = {round(t, 2): txt for rr, t, txt in C.get("fix", []) if rr == r}
    out = []
    for t, s, e in m:
        if round(s, 2) in fixes:
            if fixes[round(s, 2)] is None:
                continue
            t = fixes[round(s, 2)]
        out.append([t, s, e])
    return out


def speech_regions(r):
    w = wave.open(str(R / f"{r}.wav"))
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    hop = 160                                   # 10 ms à 16 kHz
    n = len(x) // hop
    db = 20 * np.log10(np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-9)
    on = db > C.get("threshold_db", -42)
    regs, s = [], None
    for i, v in enumerate(list(on) + [False]):
        if v and s is None:
            s = i
        if not v and s is not None:
            regs.append([s * 0.01, i * 0.01]); s = None
    merged = []
    for a, b in regs:                           # on recolle les micro-pauses (respiration dans une phrase)
        if merged and a - merged[-1][1] < C.get("min_gap", 0.28):
            merged[-1][1] = b
        else:
            merged.append([a, b])
    return merged


pieces, t = [], 0.0                              # (rush, début, fin, début_timeline)
for r in C["order"]:
    words = merged_words(r)
    drops = [d for rr, *d in C.get("drop", []) if rr == r]
    regs = speech_regions(r)
    keep = []
    for a, b in regs:
        if not any(a - 0.05 <= (s + e) / 2 <= b + 0.05 for _, s, e in words):
            continue                            # pas un mot : hésitation, souffle, bruit
        keep.append([a, b])
    # retraits explicites (faux départs) : on coupe la zone
    for da, db_ in drops:
        nk = []
        for a, b in keep:
            if db_ <= a or da >= b:
                nk.append([a, b])
            else:
                if da > a:
                    nk.append([a, da])
                if db_ < b:
                    nk.append([db_, b])
        keep = [k for k in nk if k[1] - k[0] > 0.12]
    for i, (a, b) in enumerate(keep):        # marges, sans déborder sur la zone voisine
        pa = keep[i - 1][1] if i else 0
        nb = keep[i + 1][0] if i + 1 < len(keep) else b + 1
        a2, b2 = max(a - 0.07, (pa + a) / 2), min(b + 0.12, (b + nb) / 2)
        b2 = a2 + max(1, round((b2 - a2) * FPS)) / FPS   # durée = nombre entier d'images : sinon le son se décale à chaque coupe
        pieces.append((r, a2, b2, t))
        t += b2 - a2
TOTAL = t
print(f"{len(pieces)} morceaux, durée {TOTAL:.1f} s")


def to_tl(r, x):
    """temps d'un rush -> temps de la vidéo montée (si x tombe dans une coupe : début du morceau suivant)"""
    best = None
    for rr, a, b, at in pieces:
        if rr != r:
            continue
        if a <= x <= b:
            return at + x - a
        if x < a and best is None:
            best = at
    if best is not None:
        return best
    last = [p for p in pieces if p[0] == r][-1]
    return last[3] + last[2] - last[1]


words = []
for r in C["order"]:
    for txt, s, e in merged_words(r):
        mid = (s + e) / 2
        for rr, a, b, at in pieces:
            if rr == r and a <= mid <= b:
                words.append([txt, at + max(0, s - a), at + min(b - a, e - a)])
                break
words.sort(key=lambda w: w[1])

# --- 2. vidéo de base : chaque morceau extrait à part (HDR -> SDR), puis recollé ---
parts = []
for k, (r, a, b, _) in enumerate(pieces):
    pk = B / f"piece{k:03d}.mov"
    nf = round((b - a) * FPS)
    d = nf / FPS
    if not pk.exists() or C.get("rebuild"):
        # image et son coupés exactement à la même durée (nf images) pour garder la synchro sur toute la vidéo
        fc = (f"[0:v]{TONEMAP},fps={FPS},scale={W}:{H},setsar=1,{C.get('grade', 'eq=contrast=1.04:saturation=1.08')},"
              f"trim=end_frame={nf},setpts=PTS-STARTPTS[v];[0:a:0]aresample=48000,atrim=end_sample={round(d * 48000)},asetpts=PTS-STARTPTS,"
              f"apad=whole_len={round(d * 48000)},afade=t=in:d=0.02,"
              f"afade=t=out:st={max(0, d - 0.03):.3f}:d=0.03,aformat=sample_rates=48000:channel_layouts=mono[a]")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{a:.3f}", "-t", f"{d + 0.2:.3f}", "-i", str(R / f"{r}.mov"),
                        "-filter_complex", fc, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "15", "-preset", "fast",
                        "-c:a", "pcm_s16le", str(pk)], check=True)
    parts.append(pk)
(B / "parts.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
base = B / "base.mov"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(B / "parts.txt"), "-c", "copy", str(base)],
               check=True)

# --- 3. sous-titres et calques ---
groups, cur = [], []
for w in words:
    cur.append(w)
    if len(cur) >= 4 or w[0].endswith((".", ",", "?", "!", ":")) or len(" ".join(x[0] for x in cur)) > 22:
        groups.append(cur); cur = []
if cur:
    groups.append(cur)
states = []
for gi, g in enumerate(groups):
    for wi, w in enumerate(g):
        end = g[wi + 1][1] if wi + 1 < len(g) else (groups[gi + 1][0][1] if gi + 1 < len(groups) else TOTAL)
        if wi + 1 == len(g):
            end = min(end, w[2] + 0.3)
        states.append((w[1], end, gi, wi))
graphics = []
for i, g in enumerate(C["graphics"]):
    t0 = to_tl(*g["at"])
    t1 = to_tl(*g["end"]) if "end" in g else t0 + g.get("dur", 2.5)
    graphics.append({**g, "i": i, "t0": t0, "t1": max(t1, t0 + C.get("min_show", 1.8)), "grp": json.dumps(g.get("end"))})
# un groupe (même fin) disparaît d'un bloc, sans empiéter sur l'élément suivant
for g in graphics:
    mates = [x for x in graphics if x["grp"] == g["grp"] and g["grp"] != "null"] or [g]
    first = min(x["t0"] for x in mates)
    t1 = max(x["t1"] for x in mates)
    nxt = [x["t0"] for x in graphics if x["t0"] > first + 0.01 and x not in mates]
    if nxt and min(nxt) - 0.05 < t1 and min(nxt) - 0.05 - g["t0"] >= 0.8:
        t1 = min(nxt) - 0.05
    g["t1_new"] = min(t1, TOTAL)
for g in graphics:
    g["t1"] = g.pop("t1_new")
spec = {"graphics": graphics, "groups": [[w[0] for w in g] for g in groups], "keys": C.get("keys", []),
        "sub_y": C.get("sub_y", 960), "size": [W, H], "ui_scale": C.get("ui_scale", 1), "out": str(B)}
(B / "spec.json").write_text(json.dumps(spec, ensure_ascii=False))
subprocess.run(["node", str(DIR / "vsl_text.cjs"), str(B / "spec.json")], check=True,
               env={**os.environ, "NODE_PATH": "/opt/node-tools/node_modules"})


def png(path):
    a = cv2.imread(str(path), cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
    ys, xs = np.where(a[..., 3] > 0)
    if len(ys) == 0:
        return None
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    return a[y0:y1, x0:x1].copy(), x0, y0      # copie : sinon l'image pleine taille reste en mémoire


cache = {}


def layer(path):
    if path not in cache:
        if len(cache) > 80:                     # mémoire limitée : on ne garde que les calques récents
            cache.clear()
        cache[path] = png(path)
    return cache[path]


def blend(frame, lay, scale=1.0, alpha=1.0, dy=0):
    if lay is None or alpha <= 0:
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


# captures plein écran : image arrondie + ombre, fenêtre qui défile si l'image est plus haute que la place
inserts = {}
for g in graphics:
    if g["type"] != "insert":
        continue
    im = cv2.imread(str(R / g["src"])).astype(np.float32) / 255
    sw = g.get("w", 760)
    im = cv2.resize(im, (sw, int(im.shape[0] * sw / im.shape[1])), interpolation=cv2.INTER_AREA)
    win = min(im.shape[0], g.get("win", 1180))
    rad = 34
    mask = np.ones((win, sw), np.float32)
    for (cy, cx) in [(0, 0), (0, sw - rad), (win - rad, 0), (win - rad, sw - rad)]:
        yy, xx = np.mgrid[0:rad, 0:rad]
        oy = rad - 1 if cy == 0 else 0
        ox = rad - 1 if cx == 0 else 0
        mask[cy:cy + rad, cx:cx + rad] = np.clip(rad - np.sqrt((yy - oy) ** 2 + (xx - ox) ** 2) + 0.5, 0, 1)
    shadow = np.zeros((win + 120, sw + 120), np.float32)
    shadow[60:60 + win, 60:60 + sw] = mask
    shadow = cv2.GaussianBlur(shadow, (0, 0), 22) * 0.55
    inserts[g["i"]] = (im, mask, shadow, win)


def ease(x):
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


# --- 4. composition image par image ---
dec = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", str(base), "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)
out = DIR / "out" / C.get("name", "vsl-luma.mp4")
out.parent.mkdir(exist_ok=True)
enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS),
                        "-i", "-", "-i", str(base), "-map", "0:v", "-map", "1:a", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-maxrate", C.get("maxrate", "8M"), "-bufsize", "16M",
                        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", str(out)],
                       stdin=subprocess.PIPE)
POP = [1.04, 1.015, 1.0]
xs = np.linspace(0, 1, W, dtype=np.float32)
SHADE = (C.get("shade", 0.5) * np.clip(1 - xs / 0.52, 0, 1) ** 1.6)[None, :, None]   # dégradé gauche -> transparent
FACE = C.get("face", [W // 2, H // 2])
starts = [p[3] for p in pieces]
n = 0
while True:
    raw = dec.stdout.read(W * H * 3)
    if len(raw) < W * H * 3:
        break
    t = n / FPS
    pi = max(i for i, s in enumerate(starts) if s <= t + 1e-6)
    r, a, b, at = pieces[pi]
    # recadrage alterné à chaque coupe (masque les sauts d'image), léger travelling avant pendant le morceau
    same = [i for i in range(pi + 1) if pieces[i][0] == r]
    zk = 1.0 if (len(same) - 1) % 2 == 0 else C.get("punch", 1.1)
    z = zk + 0.025 * (t - at) / max(b - a, 0.5)
    src = np.frombuffer(raw, np.uint8).reshape(H, W, 3)
    M = np.float32([[z, 0, FACE[0] * (1 - z)], [0, z, FACE[1] * (1 - z)]])
    frame = cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT).astype(np.float32) / 255
    # captures plein écran (fond flouté et assombri)
    for g in graphics:
        if g["type"] != "insert" or not (g["t0"] <= t < g["t1"]):
            continue
        dt, dur = t - g["t0"], g["t1"] - g["t0"]
        k = ease(dt / 0.35) * ease((dur - dt) / 0.3)
        small = cv2.resize(frame, (W // 6, H // 6), interpolation=cv2.INTER_AREA)
        bg = cv2.resize(cv2.GaussianBlur(small, (0, 0), 4), (W, H), interpolation=cv2.INTER_LINEAR) * 0.38
        frame = frame * (1 - k) + bg * k
        im, mask, shadow, win = inserts[g["i"]]
        hmax = im.shape[0] - win
        p = ease((dt - 0.7) / max(dur - 1.6, 0.1)) if hmax > 0 else 0
        y0s = int(p * hmax)
        view = im[y0s:y0s + win]
        sw = view.shape[1]
        cx, cy = g.get("x", W // 2), g.get("y", H // 2)
        sc = 0.92 + 0.08 * ease(dt / 0.45)
        vw, vh = int(sw * sc), int(win * sc)
        v = cv2.resize(view, (vw, vh)); mk = cv2.resize(mask, (vw, vh))[..., None] * k
        sh = cv2.resize(shadow, (int(shadow.shape[1] * sc), int(shadow.shape[0] * sc)))[..., None] * k
        X, Y = cx - vw // 2, cy - vh // 2 + int(30 * (1 - ease(dt / 0.45)))
        sx, sy = X - int(60 * sc), Y - int(60 * sc) + 14
        hh, ww = sh.shape[:2]
        ys0, xs0 = max(sy, 0), max(sx, 0)
        reg = frame[ys0:sy + hh, xs0:sx + ww]
        shc = sh[ys0 - sy:ys0 - sy + reg.shape[0], xs0 - sx:xs0 - sx + reg.shape[1]]
        frame[ys0:sy + hh, xs0:sx + ww] = reg * (1 - shc)
        frame[Y:Y + vh, X:X + vw] = frame[Y:Y + vh, X:X + vw] * (1 - mk) + v * mk
        if g.get("title"):
            blend(frame, layer(B / f"cap_{g['i']:03d}.png"), alpha=k)
    # voile sombre à gauche quand un élément est affiché (lisibilité sur le mur clair)
    shade_k = 0.0
    for g in graphics:
        if g["type"] != "insert" and g["t0"] <= t < g["t1"]:
            dt, dur = t - g["t0"], g["t1"] - g["t0"]
            shade_k = max(shade_k, min(1, dt / 0.35) * min(1, (dur - dt) / 0.35))
    if shade_k > 0:
        frame *= 1 - SHADE * shade_k
    # pastilles, chiffres, notifications : fondu + léger glissé vers le haut
    for g in graphics:
        if g["type"] == "insert" or not (g["t0"] <= t < g["t1"]):
            continue
        dt, dur = t - g["t0"], g["t1"] - g["t0"]
        al = min(1, dt / 0.25) * min(1, (dur - dt) / 0.3)
        e = 1 - (1 - min(1, dt / 0.4)) ** 3
        sc = 0.94 + 0.06 * e if g["type"] in ("big", "brand") else 1.0
        blend(frame, layer(B / f"gfx_{g['i']:03d}.png"), scale=sc, alpha=al, dy=int(22 * (1 - e)))
    for s, e_, gi, wi in states:
        if s <= t < e_:
            k = int(round((t - groups[gi][0][1]) * FPS))
            blend(frame, layer(B / f"sub_{gi:03d}_{wi:02d}.png"), scale=POP[k] if 0 <= k < len(POP) else 1.0)
            break
    enc.stdin.write((np.clip(frame, 0, 1) * 255).astype(np.uint8).tobytes())
    n += 1
    if os.environ.get("VSL_DEBUG") and n % 150 == 0:
        print(n, "frames, mémoire", int(open("/proc/self/status").read().split("VmRSS:")[1].split()[0]) // 1024, "Mo", flush=True)
    if os.environ.get("VSL_MAXF") and n >= int(os.environ["VSL_MAXF"]):
        break
enc.stdin.close()
enc.wait()
print(f"OK {out} ({TOTAL:.1f} s, {len(groups)} groupes de sous-titres)")
