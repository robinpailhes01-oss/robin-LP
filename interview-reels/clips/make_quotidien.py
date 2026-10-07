# Génère clips/quotidien.json depuis la transcription de la caméra B (temps B -> temps A).
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
FIX = {"midi.": "midi.", "puis,": "puis"}
CAP = {(324.04, "on"), (335.78, "si")}
AT = {341.06: "heures,", 349.12: "heures,"}                          # débuts de phrase après une coupe
O = 0.48
pieces_b = [  # temps caméra B ; pendant 335-353 la caméra B filme Robin : plans d'écoute de l'intervieweuse
    (324.0, 326.65, "q"),
    (335.75, 341.95), (345.55, 345.98), (346.85, 353.0),
    (361.8, 364.85), (369.15, 377.1),
    (379.55, 382.36), (384.8, 386.75),
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
    "keys": ["saison,", "minuit.", "10", "l'entretien,", "sport", "plombs."],
    "tag": "Robin · <b>Luma</b>",
    "hook": "Une journée en <em>pleine saison</em>",
    "hook_until": 2.4,
    "graphics": [
        {"type": "min", "title": "Le départ", "text": "11 h – midi", "at_word": "11", "pos": [540, 1135], "dur": 2.4},
        {"type": "min", "title": "Le retour", "text": "Jusqu'à minuit", "at_word": "minuit", "pos": [540, 1135], "dur": 2.6},
        {"type": "min", "title": "Et derrière", "text": "Entretien, ménage, stock", "at_word": "l'entretien", "pos": [540, 1135], "dur": 3.2},
        {"type": "min", "title": "Toujours", "text": "1 h de sport", "at_word": "sport", "pos": [540, 1135], "dur": 2.4},
    ],
}
json.dump(C, open(D + "clips/quotidien.json", "w"), ensure_ascii=False, indent=1)
print(" ".join(w[0] for w in words))
print(sum(p[1] - p[0] for p in pieces))
