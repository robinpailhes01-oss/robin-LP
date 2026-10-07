# Génère clips/avant-tout-seul.json depuis la transcription de la caméra B (temps B -> temps A).
import json, sys
D = "/home/user/robin-LP/interview-reels/"
ws = [w for s in json.load(open(D + "rushes/v2/camB.json")) for w in s["w"]]
# fusion des morceaux de whisper : c 'est -> c'est, agence -là -> agence-là, 100 % -> 100 %
m = []
for t, s, e in ws:
    t = t.strip()
    if m and (t.startswith(("'", "-")) or t in ("?", "%")):
        sep = " " if t in ("?", "%") else ""
        m[-1] = [m[-1][0] + sep + t, m[-1][1], e]
    else:
        m.append([t, s, e])
FIX = {"compta": "compta,"}
O = 0.48
pieces_b = [  # temps caméra B
    (217.6, 220.6, "q"),
    (221.15, 226.1),
    (227.5, 229.7, "q"),                       # Ludivine arrive : « Salut ! »
    (230.85, 235.5, {"bsrc": 785.0}),          # la caméra B part sur Ludivine puis panote : plan d'écoute
    (236.45, 240.5), (241.5, 248.95), (250.15, 251.0),
    (251.95, 253.0),
]
pieces, words = [], []
prev = None
for p in pieces_b:
    who = next((x for x in p[2:] if isinstance(x, str)), "r")
    first = who != prev
    prev = who
    a, b = p[0], p[1]
    pieces.append([round(a - O, 3), round(b - O, 3)] + list(p[2:]))
    for t, s, e in m:
        if 246.9 < s < 247.5:                  # « les deux vies » = « les devis » (vérifié sur le micro de Robin)
            t, e = ("devis", 247.55) if t == "deux" else (None, e)
            if t is None:
                continue
        if a - 0.02 <= s < b:
            t = FIX.get(t, t)
            if first:
                t, first = t[0].upper() + t[1:], False
            words.append([t, round(s - O, 3), round(min(e, b) - O, 3)])
C = {
    "maxrate": "5M",
    "style": "minimal",
    "pieces": pieces, "words": words,
    "keys": ["seul,", "ludivine,", "tout,", "devis", "deux."],
    "tag": "Robin · <b>Luma</b>",
    "hook": "Avant, je faisais <em>tout seul</em>",
    "hook_until": 2.6,
    "graphics": [
        {"type": "min", "title": "Le bateau", "text": "À deux depuis un an", "at_word": "Ludivine", "pos": [540, 1135], "dur": 2.4},
        {"type": "min", "title": "Tout, vraiment", "text": "Ménage, compta, devis…", "at_word": "compta", "pos": [540, 1135], "dur": 2.6},
    ],
}
json.dump(C, open(D + "clips/avant-tout-seul.json", "w"), ensure_ascii=False, indent=1)
print(" ".join(w[0] for w in words))
print(sum(p[1] - p[0] for p in pieces))
