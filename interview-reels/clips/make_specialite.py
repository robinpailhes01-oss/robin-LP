# Génère clips/specialite.json depuis la transcription de la caméra B (temps B -> temps A).
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
FIX = {"questions,": "questions.", "mieux": "mieux,"}
CAP = {(1048.9, "je"), (1005.46, "aider"), (1095.64, "on")}
AT = {1058.96: "entreprises.", 1010.02: "demandes,"}
O = 0.48
pieces_b = [  # temps caméra B — uniquement Robin ; la caméra B filme surtout le décor ici : plans d'écoute
    (1048.88, 1053.05), (1053.05, 1054.45), (1055.1, 1059.65),
    (1005.4, 1008.95), (1009.28, 1010.3),
    (1011.45, 1013.9), (1015.65, 1018.95),
    (1095.6, 1099.95), (1100.95, 1105.9),
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
    "listen": [[943.2, 955.2], [955.9, 968.0], [470.5, 477.5, UP], [488.5, 501.0, UP]],
    "pieces": pieces, "words": words,
    "keys": ["spécialisé", "whatsapp", "mieux,", "hébergements,", "expérience", "temps", "développer"],
    "tag": "Robin · <b>Luma</b>",
    "hook": "Ce que je fais <em>de mieux</em>",
    "hook_until": 2.4,
    # motion design épuré qui suit le propos : spécialité -> pour qui -> méthode en 2 étapes
    "graphics": [
        {"type": "chip", "icon": "chat", "text": "Agent WhatsApp", "at_word": "whatsapp", "until": "aider", "pos": [540, 1120]},
        {"type": "chip", "icon": "up", "color": "o", "text": "Grosse valeur ajoutée", "at_word": "valeur", "until": "aider", "pos": [540, 1225]},
        {"type": "chip", "text": "PME", "at_word": "pme", "until": "déjà", "pos": [540, 1100]},
        {"type": "chip", "text": "Hébergements", "at_word": "hébergements", "until": "déjà", "pos": [540, 1185]},
        {"type": "chip", "text": "Trop de demandes", "at_word": "trop", "until": "déjà", "pos": [540, 1270]},
        {"type": "chip", "style": "gold", "text": "→ focus : l'expérience client", "at_word": "focaliser", "until": "déjà", "pos": [540, 1370]},
        {"type": "step", "title": "Étape 1", "text": "Libérer du temps", "at_word": "libérer", "pos": [285, 1150], "dur": 99},
        {"type": "line", "at_word": "ensuite", "pos": [505, 1162], "w": 170, "wipe": 0.7, "dur": 99},
        {"type": "step", "title": "Étape 2", "text": "Développer", "at_word": "développer", "pos": [830, 1150], "dur": 99},
    ],

}
json.dump(C, open(D + "clips/specialite.json", "w"), ensure_ascii=False, indent=1)
print(" ".join(w[0] for w in words))
print(sum(p[1] - p[0] for p in pieces))
