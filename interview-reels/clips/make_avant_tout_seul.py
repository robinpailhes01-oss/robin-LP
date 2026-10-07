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
FIX = {"compta": "compta,", "informations,": "informations.", "temps": "temps."}
CAP = {(272.28, "j'ai"), (288.06, "ça")}                          # débuts de phrase après une coupe
O = 0.48
pieces_b = [  # temps caméra B — AVANT puis APRÈS l'agent IA
    (230.85, 235.5, {"bsrc": 785.0}),          # la caméra B est sur Ludivine qui arrive : plan d'écoute de l'intervieweuse
    (236.45, 240.5), (241.5, 248.95), (250.15, 251.0),
    (261.35, 267.0),
    (272.25, 281.05), (282.5, 285.9), (288.0, 291.35),
    (308.45, 315.5),
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
            if first or (s, t) in CAP:
                t, first = t[0].upper() + t[1:], False
            words.append([t, round(s - O, 3), round(min(e, b) - O, 3)])
C = {
    "maxrate": "5M",
    "style": "minimal",
    "listen": [[715.0, 727.0], [785.0, 797.5]],
    "pieces": pieces, "words": words,
    "keys": ["seul,", "tout,", "interrompu,", "agent", "libérer", "réactivité."],
    "tag": "Robin · <b>Luma</b>",
    "hook": "Avant / après <em>mon agent IA</em>",
    "hook_until": 2.6,
    "graphics": [
        {"type": "min", "title": "Avant", "text": "Tout, tout seul", "at_word": "seul", "pos": [540, 1135], "dur": 2.6},
        {"type": "min", "title": "Avant", "text": "Interrompu à toute heure", "at_word": "deux", "pos": [540, 1135], "dur": 2.8},
        {"type": "min", "title": "Après", "text": "Un agent IA sur WhatsApp", "at_word": "agent", "pos": [540, 1135], "dur": 2.8},
        {"type": "min", "title": "Après", "text": "Les clients me remercient", "at_word": "remercient", "pos": [540, 1135], "dur": 2.4},
    ],
}
json.dump(C, open(D + "clips/avant-tout-seul.json", "w"), ensure_ascii=False, indent=1)
print(" ".join(w[0] for w in words))
print(sum(p[1] - p[0] for p in pieces))
