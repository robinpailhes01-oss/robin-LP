# Génère clips/whatsapp-reponse.json depuis la transcription de la caméra B (temps B -> temps A).
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
FIX = {"Yaya": "IA", "fait?": "fait\u00a0?", "minute,": "minute.", "ailleurs...": "ailleurs."}
CAP = {(531.9, "les")}
AT = {536.72: "message."}                          # débuts de phrase après une coupe
O = 0.48
pieces_b = [  # temps caméra B
    (474.0, 477.85, "q"),
    (478.45, 481.6), (481.9, 488.95),
    (531.85, 534.6), (536.1, 537.15),
    (567.0, 575.3, "q"),                       # l'intervieweuse (lèvres de Robin immobiles)
    (590.3, 598.65), (601.25, 605.95),
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
    "pieces": pieces, "words": words,
    "keys": ["whatsapp.", "message.", "filtre,", "réponse.", "rapidement,", "dernière", "ailleurs."],
    "tag": "Robin · <b>Luma</b>",
    "hook": "Tes clients veulent <em>une réponse</em>",
    "hook_until": 2.6,
    "graphics": [
        {"type": "min", "title": "Le canal", "text": "Tout passe par WhatsApp", "at_word": "WhatsApp", "pos": [540, 1135], "dur": 2.6},
        {"type": "min", "title": "Les clients", "text": "Dimanche 23 h, 1 h du matin…", "at_word": "dimanche", "pos": [540, 1135], "dur": 2.8},
        {"type": "min", "title": "L'agent IA", "text": "Répond du tac au tac", "at_word": "rapidement", "pos": [540, 1135], "dur": 2.4},
        {"type": "min", "title": "Le résultat", "text": "Réservations de dernière minute", "at_word": "dernière", "pos": [540, 1135], "dur": 2.8},
    ],
}
json.dump(C, open(D + "clips/whatsapp-reponse.json", "w"), ensure_ascii=False, indent=1)
print(" ".join(w[0] for w in words))
print(sum(p[1] - p[0] for p in pieces))
