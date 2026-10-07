# Génère clips/pourquoi-luma.json depuis la transcription de la caméra B (temps B -> temps A).
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
FIX = {"Wienia": "l'IA"}
O = 0.48
pieces_b = [  # temps caméra B
    (1038.71, 1040.95, "q"), (1042.35, 1047.2, "q"),
    (977.95, 981.75), (984.55, 987.4), (990.9, 992.45), (993.7, 998.9),
    (1019.8, 1021.15),
    (1074.5, 1078.25, "q"),
    (1106.3, 1108.6), (1108.9, 1111.3),
    (1124.5, 1129.9), (1130.4, 1131.95),
]
pieces, words = [], []
prev = None
for p in pieces_b:
    who = p[2] if len(p) > 2 else "r"
    first = who != prev
    prev = who
    a, b = p[0], p[1]
    pieces.append([round(a - O, 3), round(b - O, 3)] + ([p[2]] if len(p) > 2 else []))
    for t, s, e in m:
        if a - 0.02 <= s < b:
            t = FIX.get(t, t)
            if first:
                t, first = t[0].upper() + t[1:], False
            words.append([t, round(s - O, 3), round(min(e, b) - O, 3)])
C = {
    "maxrate": "6M",
    "style": "minimal",
    "pieces": pieces, "words": words,
    "keys": ["vie,", "essentiel.", "humain.", "temps,", "l'efficacité", "100 %", "relationnel."],
    "tag": "Robin · <b>Luma</b>",
    "hook": "Pourquoi j'ai créé <em>Luma</em>",
    "hook_until": 2.6,
    "graphics": [
        {"type": "min", "title": "Le vrai problème", "text": "Trop de messages", "at_word": "tellement", "pos": [540, 1135], "dur": 3.2},
        {"type": "min", "title": "La promesse", "text": "L'accueil reste humain", "at_word": "Sans", "pos": [540, 1135], "dur": 2.2},
        {"type": "min", "title": "Le résultat", "text": "100 % avec ses clients", "at_word": "100", "pos": [540, 1135], "dur": 3.0},
    ],
}
json.dump(C, open(D + "clips/pourquoi-luma.json", "w"), ensure_ascii=False, indent=1)
print(" ".join(w[0] for w in words))
print(sum(p[1] - p[0] for p in pieces))
