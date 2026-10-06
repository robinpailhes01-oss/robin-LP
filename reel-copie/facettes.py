"""Assemble le Reel « Mes deux facettes » : votre vidéo (doute ralenti puis travail) + phrases aux mêmes instants que la référence.

Entrées : deux-facettes.json, build/facettes/*.png (facettes.cjs), src/facettes/robin.mov, src/ref6/ref.mp4 (musique).
Sortie : out/reel-deux-facettes.mp4
"""
import json
import subprocess
from pathlib import Path

DIR = Path(__file__).parent
S = json.loads((DIR / "deux-facettes.json").read_text())
B = DIR / "build" / "facettes"
R = S["robin"]
T_SWITCH = S["title"][1]["from"]            # instant du « Je peux le faire. » dans la référence
total = S["total"]
slow = T_SWITCH / R["switch"]               # ralenti de la partie « doute » (vidéo filmée à 120 i/s)
b_dur = total - T_SWITCH

fc = [f"[0:v]trim=0:{R['switch']},setpts=(PTS-STARTPTS)*{slow:.5f},fps=30,scale=1080:1920,setsar=1[a]",
      f"[0:v]trim={R['switch']}:{R['switch'] + b_dur:.3f},setpts=PTS-STARTPTS,fps=30,scale=1080:1920,setsar=1[b]",
      "[a][b]concat=n=2:v=1:a=0,format=yuv420p[v0]"]
layers = [(f"titre{i}", t["from"], t["to"]) for i, t in enumerate(S["title"])]
layers += [(f"neg{i:02d}", p["in"], p["out"]) for i, p in enumerate(S["negatives"])]
layers += [(f"pos{i}", p["in"], total) for i, p in enumerate(S["positives"])]
inputs = ["-i", str(DIR / R["src"])]
cur = "v0"
for k, (name, a, b) in enumerate(layers):
    inputs += ["-loop", "1", "-framerate", "30", "-t", str(total), "-i", str(B / f"{name}.png")]
    fc.append(f"[{k + 1}:v]format=rgba[l{k}]")
    fc.append(f"[{cur}][l{k}]overlay=0:0:enable='between(t,{a},{b - 0.001})':shortest=1[v{k + 1}]")
    cur = f"v{k + 1}"
inputs += ["-i", str(DIR / "src" / "ref6" / "ref.mp4")]
out = DIR / "out" / "reel-deux-facettes.mp4"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(fc), "-map", f"[{cur}]",
                "-map", f"{len(layers) + 1}:a", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-maxrate", "12M",
                "-bufsize", "24M", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "192k", "-t", str(total),
                "-movflags", "+faststart", str(out)], check=True)
print(f"OK {out} (ralenti ×{slow:.2f} sur la partie doute)")
