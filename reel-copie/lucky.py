"""Assemble le Reel « on dit que t'as eu de la chance » : votre plan sur le bateau + cartons français au rythme de la référence.

Entrées : lucky.json, build/lucky/*.png (lucky.cjs), src/pause/robin.mov, src/ref5/ref.mp4 (musique). Sortie : out/reel-chance.mp4
"""
import json
import subprocess
from pathlib import Path

DIR = Path(__file__).parent
S = json.loads((DIR / "lucky.json").read_text())
B = DIR / "build" / "lucky"
SDR = ("zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,"
       "zscale=t=bt709:m=bt709:r=tv,format=yuv420p,eq=saturation=1.08:contrast=1.03")

v = S["video"]
cards = S["cards"]
ends = [c["t"] for c in cards[1:]] + [S["total"]]
inputs = ["-i", str(DIR / v["src"]), "-loop", "1", "-i", str(B / "title.png")]
fc = [f"[0:v]trim={v['start']}:{v['start'] + v['dur']},setpts=PTS-STARTPTS,{SDR},scale=1080:1920,fps=30,setsar=1[v0]",
      f"[1:v]format=rgba,trim=0:{v['dur']},setpts=PTS-STARTPTS[tt]",
      "[v0][tt]overlay=0:0:shortest=1,format=yuv420p[s0]"]
for i, (c, e) in enumerate(zip(cards, ends)):
    d = round(e - c["t"], 4)
    inputs += ["-loop", "1", "-framerate", "30", "-t", str(d), "-i", str(B / f"card{i:02d}.png")]
    f = f"[{i + 2}:v]fps=30,format=yuv420p,setsar=1"
    if i == len(cards) - 1:  # dernier carton : le texte s'efface comme dans la référence
        f += f",fade=t=out:st={S['fade'][0] - c['t']:.3f}:d={S['fade'][1] - S['fade'][0]:.3f}"
    fc.append(f + f"[s{i + 1}]")
fc.append("".join(f"[s{i}]" for i in range(len(cards) + 1)) + f"concat=n={len(cards) + 1}:v=1:a=0[v]")
inputs += ["-i", str(DIR / "src" / "ref5" / "ref.mp4")]
out = DIR / "out" / "reel-chance.mp4"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(fc),
                "-map", "[v]", "-map", f"{len(cards) + 2}:a", "-c:v", "libx264", "-preset", "slow", "-crf", "19",
                "-maxrate", "12M", "-bufsize", "24M", "-r", "30", "-c:a", "aac", "-b:a", "192k", "-t", str(S["total"]),
                "-movflags", "+faststart", str(out)], check=True)
print("OK", out)
