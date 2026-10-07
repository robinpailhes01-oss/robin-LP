# Génère clips/avis-clients.json depuis la transcription de la caméra B (temps B -> temps A).
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
FIX = {"j'ai": "J'ai", "C": "C"}
O = 0.48
pieces_b = [  # temps caméra B ; {"bsrc": t} = garder le plan synchrone de la caméra B (elle écoute déjà Robin)
    (1136.38, 1138.5), (1139.0, 1143.6),
    (1151.4, 1152.4, "q", {"bsrc": 1152.45}), (1152.4, 1155.95, "q"), (1162.28, 1170.62, "q"),
    (1175.2, 1180.75, {"bsrc": 1175.2}),
    (1180.76, 1182.2, "q"), (1182.22, 1185.5, "q"), (1186.76, 1188.95, "q"), (1190.3, 1196.95, "q"),
    (1197.95, 1200.5, {"bsrc": 1197.95}),
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
        if a - 0.02 <= s < b:
            t = FIX.get(t, t)
            if first:
                t, first = t[0].upper() + t[1:], False
            words.append([t, round(s - O, 3), round(min(e, b) - O, 3)])
C = {
    "maxrate": "5M",
    "style": "minimal",
    # plans de la caméra B où elle écoute Robin en silence, pour l'écran du bas pendant ses réponses
    "listen": [[715.0, 727.0], [785.0, 797.5]],
    "pieces": pieces, "words": words,
    "keys": ["avis", "eux.", "système", "recentrer", "chronophage,", "incroyable.", "but."],
    "tag": "Robin · <b>Luma</b>",
    "hook": "Mes avis clients <em>ont changé</em>",
    "hook_until": 2.6,
    "graphics": [
        {"type": "min", "title": "Ce que disent les avis", "text": "On est là avec eux", "at_word": "disent", "pos": [540, 1135], "dur": 2.2},
        {"type": "min", "title": "La réalité", "text": "Tout un système à gérer", "at_word": "système", "pos": [540, 1135], "dur": 3.0},
        {"type": "min", "title": "L'objectif", "text": "Se recentrer sur son activité", "at_word": "recentrer", "pos": [540, 1135], "dur": 2.6},
    ],
}
json.dump(C, open(D + "clips/avis-clients.json", "w"), ensure_ascii=False, indent=1)
print(" ".join(w[0] for w in words))
print(sum(p[1] - p[0] for p in pieces))
