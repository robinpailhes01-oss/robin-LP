# Génère clips/souhait.json depuis la transcription de la caméra B (temps B -> temps A).
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
FIX = {"l'essentiel": "l'essentiel."}
CAP = {(1251.03, "pouvoir")}
AT = {1205.04: "souhaiter", 1230.31: "activités.", 1238.13: "d'entreprise."}                          # débuts de phrase après une coupe
O = 0.48
pieces_b = [  # temps caméra B
    (1203.4, 1205.62, "q"), (1217.03, 1217.62, "q"),
    (1225.55, 1228.75), (1229.75, 1230.85),
    (1232.0, 1233.98), (1234.6, 1239.05),
    (1242.78, 1247.95), (1247.95, 1250.53),
    (1251.0, 1257.0),
    (1259.2, 1261.78),
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
UP = {"bcrop": [0, 40, 1080]}                # cadrage plus haut : sa tête est en haut de l'image sur ces plans
C = {
    "maxrate": "5M",
    "style": "minimal",
    # plans de l'intervieweur qui écoute Robin en silence (la caméra B filme le décor pendant cette réponse)
    "listen": [[470.5, 477.5, UP], [488.5, 501.0, UP], [519.0, 531.0, UP]],
    "pieces": pieces, "words": words,
    "keys": ["sens", "accompagner", "touche", "l'essentiel.", "france,"],
    "tag": "Robin · <b>Luma</b>",
    "hook": "Ce qu'on peut <em>me souhaiter</em>",
    "hook_until": 2.4,
    "graphics": [
        {"type": "min", "title": "Mon objectif", "text": "Accompagner des chefs d'entreprise", "at_word": "chefs", "pos": [540, 1135], "dur": 2.6},
        {"type": "min", "title": "Pour eux", "text": "Se recentrer sur l'essentiel", "at_word": "recentrer", "pos": [540, 1135], "dur": 2.4},
        {"type": "min", "title": "Partout", "text": "Même à l'autre bout de la France", "at_word": "bout", "pos": [540, 1135], "dur": 2.6},
    ],
}
json.dump(C, open(D + "clips/souhait.json", "w"), ensure_ascii=False, indent=1)
print(" ".join(w[0] for w in words))
print(sum(p[1] - p[0] for p in pieces))
