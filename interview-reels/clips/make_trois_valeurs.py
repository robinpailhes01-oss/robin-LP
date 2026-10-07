# Génère clips/trois-valeurs.json (temps caméra B -> temps A). Les réponses de Robin sont courtes avec de longs
# silences : on garde chaque mot, et on prend le son de la caméra B, plus net sur ce passage.
import json
D = "/home/user/robin-LP/interview-reels/"
O = 0.48
ws = [w for s in json.load(open(D + "rushes/v2/camB.json")) for w in s["w"]]
m = []
for t, s, e in ws:
    t = t.strip()
    if m and (t.startswith(("'", "-")) or t in ("?", "%")):
        m[-1] = [m[-1][0] + (" " if t in ("?", "%") else "") + t, m[-1][1], e]
    else:
        m.append([t, s, e])
CROP = {"bcrop": [280, 600, 800]}             # plan large : recadré sur l'intervieweur qui pose la question
pieces_b = [
    (1271.05, 1273.6, "q", CROP), (1274.6, 1277.45, "q", CROP),
    (1279.0, 1281.0, {"audio": "b"}), (1281.7, 1282.85, {"audio": "b"}),
    (1289.25, 1290.15, {"audio": "b"}), (1291.0, 1291.85, {"audio": "b"}),
]
# mots des réponses retranscrits à part (micro de la caméra B, calés sur le son)
ANS = [["Tranquillité", 1279.1, 1280.4], ["d'esprit,", 1280.42, 1280.95], ["efficacité,", 1281.75, 1282.8],
       ["du", 1289.3, 1289.5], ["gain", 1289.5, 1289.75], ["après,", 1289.75, 1290.1], ["forcément.", 1291.05, 1291.8]]
pieces, words = [], []
for p in pieces_b:
    a, b = p[0], p[1]
    pieces.append([round(a - O, 3), round(b - O, 3)] + list(p[2:]))
src = [w for w in m if w[1] < 1278] + ANS
src = [["Si", s, e] if t == "si" and 1271 < s < 1271.2 else [t, s, e] for t, s, e in src]
for t, s, e in src:
    if any(p[0] - 0.02 <= s < p[1] for p in pieces_b):
        words.append([t, round(s - O, 3), round(e - O, 3)])
C = {
    "maxrate": "5M",
    "style": "minimal",
    "pieces": pieces, "words": words,
    "keys": ["tranquillité", "d'esprit,", "efficacité,", "gain"],
    "tag": "Robin · <b>Luma</b>",
    "hook": "3 valeurs <em>d'un agent IA</em>",
    "hook_until": 2.4,
    "graphics": [
        {"type": "min", "title": "01", "text": "Tranquillité d'esprit", "at_word": "Tranquillité", "pos": [540, 1135], "dur": 2.15},
        {"type": "min", "title": "02", "text": "Efficacité", "at_word": "efficacité", "pos": [540, 1135], "dur": 1.45},
        {"type": "min", "title": "03", "text": "Du gain", "at_word": "gain", "pos": [540, 1135], "dur": 3},
    ],
}
json.dump(C, open(D + "clips/trois-valeurs.json", "w"), ensure_ascii=False, indent=1)
print(" ".join(w[0] for w in words))
print(sum(p[1] - p[0] for p in pieces_b))
