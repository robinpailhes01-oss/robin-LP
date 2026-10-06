"""Montage du Reel « locked in » : plans Higgsfield (Kling 3.0) + cartons + texte incrusté derrière le sujet.

Usage : python3 edit.py <lang>   (fr | en)
Entrées : build/clips/k*.mp4, build/text/<lang>/*.png, build/music.wav, edl.json
Sortie : out/reel-locked-in-<lang>.mp4 (1080×1920, bande 4:3 centrée comme la référence)
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort

DIR = Path(__file__).parent
LANG = sys.argv[1] if len(sys.argv) > 1 else "fr"
EDL = json.loads((DIR / "edl.json").read_text())
FPS = EDL["fps"]
W, H = 1080, 810
BAND_Y = 520  # bande légèrement au-dessus du centre, comme dans la référence
TXT = DIR / "build" / "text" / LANG
CLIPS = DIR / "build" / "clips"
SEG = ort.InferenceSession("/tmp/claude-0/models/u2net_human_seg.onnx", providers=["CPUExecutionProvider"])


def png(name):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(TXT / f"{name}.png"), "-f", "rawvideo", "-pix_fmt", "rgba", "-"],
                         capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.uint8).reshape(H, W, 4).astype(np.float32) / 255
    return a


def clip_frames(name, off, n):
    cx = EDL["crop_x"].get(name, 0.5)  # centre horizontal du recadrage 4:3
    vf = f"fps={FPS},crop=ih*4/3:ih:(iw-ih*4/3)*{cx}:0,scale={W}:{H}:flags=lanczos"
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", f"{off:.3f}", "-i", str(CLIPS / f"{name}.mp4"), "-vf", vf,
                          "-frames:v", str(n), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
    if len(fr) < n:  # plan trop court : on fige la dernière image
        fr = np.concatenate([fr, np.repeat(fr[-1:], n - len(fr), 0)])
    return fr.astype(np.float32) / 255


def person_mask(img):
    x = img[::, ::, :]
    small = np.asarray(
        np.frombuffer(subprocess.run(["ffmpeg", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-i", "-",
                                      "-vf", "scale=320:320", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                                     input=(x * 255).astype(np.uint8).tobytes(), capture_output=True, check=True).stdout, np.uint8)
    ).reshape(320, 320, 3).astype(np.float32) / 255
    small = small / max(small.max(), 1e-6)
    small = (small - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    out = SEG.run(None, {SEG.get_inputs()[0].name: small.transpose(2, 0, 1)[None].astype(np.float32)})[0][0, 0]
    out = (out - out.min()) / (out.max() - out.min() + 1e-6)
    big = np.frombuffer(subprocess.run(["ffmpeg", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "gray", "-s", "320x320", "-i", "-",
                                        "-vf", f"scale={W}:{H}:flags=bicubic", "-f", "rawvideo", "-pix_fmt", "gray", "-"],
                                       input=(out * 255).astype(np.uint8).tobytes(), capture_output=True, check=True).stdout, np.uint8)
    m = big.reshape(H, W).astype(np.float32) / 255
    return np.clip((m - 0.35) / 0.3, 0, 1)  # bord net mais adouci


yy, xx = np.mgrid[0:H, 0:W]
VIG = (1 - 0.35 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.5 / 2 ** 1.5)[..., None].astype(np.float32)


def over(frame, txt, occlude=None):
    frame = frame * VIG  # vignettage léger sur les plans filmés uniquement
    a = txt[..., 3:4]
    if occlude is not None:
        a = a * (1 - occlude[..., None])
    return frame * (1 - a) + txt[..., :3] * a


# --- découpage de la timeline en images ---
def fi(t):
    return int(round(t * FPS))


total = fi(EDL["total"])
plan = []  # (début, fin, type, données)
op = EDL["open"]
cuts = EDL["card_cuts"]
plan.append((0, fi(cuts[0]), "open", None))
for k, (a, b) in enumerate(zip(cuts, cuts[1:] + [EDL["drop"]])):
    plan.append((fi(a), fi(b), "card", f"card{k + 1}"))
t = EDL["drop"]
for name, n8, off in EDL["broll"]:
    t2 = t + n8 * EDL["eighth"]
    plan.append((fi(t), fi(t2), "broll", (name, off)))
    t = t2
plan[-1] = (plan[-1][0], fi(EDL["broll_end"]), "broll", plan[-1][3])
plan.append((fi(EDL["broll_end"]), fi(EDL["black_end"]), "loop", None))
plan.append((fi(EDL["black_end"]), total, "card", "card1"))

T = {n: png(n) for n in ["l1-serif", "l1-sans", "card1", "card2", "card3", "card4", "card5", "locked"]}
out = DIR / "out" / f"reel-locked-in-{LANG}.mp4"
out.parent.mkdir(exist_ok=True)
enc = subprocess.Popen([
    "ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
    "-i", str(DIR / "build" / "music.wav"),
    "-filter_complex",
    f"[0:v]noise=alls=7:allf=t,pad=1080:1920:0:{BAND_Y}:black,format=yuv420p[v]",
    "-map", "[v]", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-maxrate", "16M", "-bufsize", "32M", "-c:a", "aac", "-b:a", "256k",
    "-movflags", "+faststart", "-shortest", str(out)], stdin=subprocess.PIPE)

for a, b, kind, data in plan:
    n = b - a
    if kind == "card":
        img = T[data][..., :3]
        for _ in range(n):
            enc.stdin.write((img * 255).astype(np.uint8).tobytes())
        continue
    if kind in ("open", "loop"):
        o = EDL["open"] if kind == "open" else EDL["loop"]
        fr = clip_frames(o["clip"], o["off"], n)
        for i in range(n):
            tt = (a + i) / FPS
            if kind == "open":
                txt = T["l1-serif"] if tt < op["serif_until"] else T["l1-sans"]
            else:
                txt = T["l1-sans"] if tt < EDL["loop_serif"] else T["l1-serif"]
            enc.stdin.write((over(fr[i], txt) * 255).astype(np.uint8).tobytes())
        continue
    name, off = data
    fr = clip_frames(name, off, n)
    ms = [person_mask(f) for f in fr]
    # texte derrière le sujet seulement s'il reste lisible (au plus 35 % des lettres cachées sur le plan)
    ta = T["locked"][..., 3]
    hidden = max((ta * m).sum() / ta.sum() for m in ms)
    behind = hidden < 0.35
    for i in range(n):
        enc.stdin.write((over(fr[i], T["locked"], ms[i] if behind else None) * 255).astype(np.uint8).tobytes())
    print(f"{name} {n} images, texte derrière : {behind} ({hidden:.0%})")
enc.stdin.close()
enc.wait()
print("OK", out)
