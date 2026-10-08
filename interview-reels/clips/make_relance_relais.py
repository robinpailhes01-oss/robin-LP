# Génère clips/relance-relais.json depuis la transcription de la caméra B (temps B -> temps A).
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
FIX = {"REZA": "résa", "offre,": "offre."}
CAP = {(731.98, "moi,")}
AT = {766.4: "en"}                              # « un suspens » -> « en suspens »                          # débuts de phrase après une coupe
O = 0.48
pieces_b = [  # temps caméra B ; la caméra B tremble/part sur le décor vers 780-786 : plans d'écoute
    (731.95, 735.55, {"bsrc": 731.95}), (736.55, 738.6, {"bsrc": 736.55}), (740.15, 741.3, {"bsrc": 740.15}),
    (759.45, 766.85, "q"), (767.0, 768.9, "q"), (769.0, 776.95, "q"),
    (777.2, 781.5), (786.45, 787.6),
    (788.5, 792.7, {"bsrc": 788.5}),
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
    "keys": ["tableau", "conversations.", "relance", "suspens.", "relais", "réactif."],
    "tag": "Robin · <b>Luma</b>",
    "hook": "Ce que fait <em>vraiment</em> mon agent IA",
    "hook_until": 2.6,
    "graphics": [
        {"type": "min", "title": "Le tableau de bord", "text": "Toutes les conversations", "at_word": "tableau", "pos": [540, 1135], "dur": 2.6},
        {"type": "min", "title": "L'agent IA", "text": "Relance les indécis", "at_word": "relance", "pos": [540, 1135], "dur": 2.8},
        # le vrai message d'escalade reçu de l'agent (numéro du client flouté)
        {"type": "img", "title": "Le message que je reçois", "src": "rushes/escalade-lea.png", "w": 820,
         "at_word": "m'envoie", "pos": [540, 1420], "dur": 6.4},
    ],
}
json.dump(C, open(D + "clips/relance-relais.json", "w"), ensure_ascii=False, indent=1)
print(" ".join(w[0] for w in words))
print(sum(p[1] - p[0] for p in pieces))
