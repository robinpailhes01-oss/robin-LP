# Génère clips/mindset.json depuis la transcription de la caméra B (temps B -> temps A).
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
FIX = {"100%,": "100\u00a0%,"}
CAP = {(864.86, "j'essaye"), (872.68, "passer")}
AT = {857.54: None, 872.64: None}             # « à pas besoin » -> « pas besoin » ; « de passer » -> « Passer »                          # débuts de phrase après une coupe
O = 0.48
pieces_b = [  # temps caméra B
    (798.0, 801.38, "q"), (825.6, 827.45, "q"),
    (848.5, 851.2), (852.15, 856.1), (856.35, 859.6), (860.55, 862.6), (864.8, 870.25),
    (872.62, 878.7),
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
        if round(s, 2) in AT:
            t = AT[round(s, 2)]
            if t is None:
                continue
        if a - 0.02 <= s < b:
            t = FIX.get(t, t)
            if first or (s, t) in CAP:
                t, first = t[0].upper() + t[1:], False
            words.append([t, round(s - O, 3), round(min(e, b) - O, 3)])
C = {
    "maxrate": "5M",
    "style": "minimal",
    "listen": [[715.0, 727.0], [785.0, 797.5]],
    "pieces": pieces, "words": words,
    "keys": ["esclave", "l'équilibre", "sport.", "courir", "lire", "apprendre", "100\u00a0%,"],
    "tag": "Robin · <b>Luma</b>",
    "hook": "Mon équilibre <em>d'entrepreneur</em>",
    "hook_until": 2.6,
    "graphics": [
        {"type": "min", "title": "Le sport", "text": "15 minutes suffisent", "at_word": "courir", "pos": [540, 1135], "dur": 2.8},
        {"type": "min", "title": "La lecture", "text": "Oublier, apprendre", "at_word": "oublier", "pos": [540, 1135], "dur": 2.6},
        {"type": "min", "title": "L'essentiel", "text": "Être là à 100 %", "at_word": "famille", "pos": [540, 1135], "dur": 3.4},
    ],
}
json.dump(C, open(D + "clips/mindset.json", "w"), ensure_ascii=False, indent=1)
print(" ".join(w[0] for w in words))
print(sum(p[1] - p[0] for p in pieces))
