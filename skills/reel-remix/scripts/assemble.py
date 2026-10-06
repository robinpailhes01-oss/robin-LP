#!/usr/bin/env python3
"""Assemble un Reel 1080×1920 à partir d'une liste de passages (EDL) décrite en JSON.

Usage : python3 assemble.py edl.json

Format de edl.json :
{
  "out": "out/reel.mp4",
  "fps": 30,
  "audio": {"src": "ref.mp4", "start": 0},          // musique gardée telle quelle (ou null pour muet)
  "segments": [
    {"src": "ma-video.mov", "in": 3.83, "dur": 5.1667,                  // passage vidéo
     "overlays": [{"png": "build/titre.png", "from": 0, "to": 5.1667}],  // calques PNG, temps relatifs au passage
     "crop_x": 0.5},                                                     // centre du recadrage si la source n'est pas en 9:16
    {"src": "ref.mp4", "in": 5.1667, "dur": 4.9667},                     // passage gardé de la référence
    {"png": "build/carton03.png", "dur": 0.3,                            // carton fixe
     "fade_out": [0.5, 0.65]}                                            // fondu au noir : début (relatif), durée
  ]
}

- Les vidéos iPhone HDR (HLG/PQ) sont détectées et converties en SDR, sinon elles sortent délavées ou grises.
- Chaque passage est recadré pour remplir le 9:16 (jamais de bandes noires ajoutées).
- Les durées sont arrondies à l'image : gardez les temps de la référence au millième (sortie de find_cuts.py).
"""
import json
import subprocess
import sys
from pathlib import Path

HDR = ("zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,"
       "zscale=t=bt709:m=bt709:r=tv,format=yuv420p,eq=saturation=1.08:contrast=1.03")


def transfer(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=color_transfer",
                          "-of", "csv=p=0", path], capture_output=True, text=True).stdout.strip()
    return out


def main(edl_path):
    E = json.loads(Path(edl_path).read_text())
    fps = E.get("fps", 30)
    W, H = 1080, 1920
    inputs, fc, labels = [], [], []
    idx = {}

    def inp(path, *pre):
        key = (path, pre)
        if key not in idx:
            idx[key] = len(inputs) // 1
            inputs.append((list(pre), path))
        return idx[key]

    for k, s in enumerate(E["segments"]):
        dur = s["dur"]
        if "png" in s:
            i = inp(s["png"], "-loop", "1", "-framerate", str(fps), "-t", f"{dur:.4f}")
            f = f"[{i}:v]scale={W}:{H},fps={fps},format=yuv420p,setsar=1"
        else:
            i = inp(s["src"])
            tr = transfer(s["src"])
            sdr = f",{HDR}" if tr in ("arib-std-b67", "smpte2084") else ""
            cx = s.get("crop_x", 0.5)
            f = (f"[{i}:v]trim={s['in']:.4f}:{s['in'] + dur:.4f},setpts=PTS-STARTPTS{sdr},"
                 f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,"
                 f"crop={W}:{H}:(iw-{W})*{cx}:(ih-{H})/2,fps={fps},format=yuv420p,setsar=1")
        if "fade_out" in s:
            f += f",fade=t=out:st={s['fade_out'][0]:.3f}:d={s['fade_out'][1]:.3f}"
        if "fade_in" in s:
            f += f",fade=t=in:st=0:d={s['fade_in']:.3f}"
        cur = f"b{k}"
        fc.append(f + f"[{cur}]")
        for j, ov in enumerate(s.get("overlays", [])):
            oi = inp(ov["png"], "-loop", "1", "-framerate", str(fps), "-t", f"{dur:.4f}")
            nxt = f"b{k}o{j}"
            fc.append(f"[{oi}:v]format=rgba[p{k}o{j}]")
            fc.append(f"[{cur}][p{k}o{j}]overlay=0:0:enable='between(t,{ov.get('from', 0)},{ov.get('to', dur)})',"
                      f"format=yuv420p[{nxt}]")
            cur = nxt
        labels.append(f"[{cur}]")
    fc.append("".join(labels) + f"concat=n={len(labels)}:v=1:a=0[v]")
    total = sum(s["dur"] for s in E["segments"])

    args = ["ffmpeg", "-y", "-loglevel", "error"]
    for pre, path in inputs:
        args += pre + ["-i", path]
    maps = ["-map", "[v]"]
    au = E.get("audio")
    if au:
        args += ["-ss", str(au.get("start", 0)), "-i", au["src"]]
        maps += ["-map", f"{len(inputs)}:a", "-c:a", "aac", "-b:a", "192k"]
    out = Path(E["out"])
    out.parent.mkdir(parents=True, exist_ok=True)
    args += ["-filter_complex", ";".join(fc), *maps, "-c:v", "libx264", "-preset", "slow", "-crf", "19",
             "-maxrate", "12M", "-bufsize", "24M", "-r", str(fps), "-t", f"{total:.4f}", "-movflags", "+faststart", str(out)]
    subprocess.run(args, check=True)
    print(f"OK {out} ({total:.2f} s)")


if __name__ == "__main__":
    main(sys.argv[1])
