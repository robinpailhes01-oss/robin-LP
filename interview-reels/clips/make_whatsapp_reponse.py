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
    # motion design : le canal -> les messages à toute heure (notifications d'illustration) -> la réponse de l'agent
    "graphics": [
        {"type": "chip", "icon": "chat", "text": "Tout passe par WhatsApp", "at_word": "WhatsApp", "pos": [540, 1150], "dur": 2.0},
        {"type": "chip", "text": "Un beau site internet…", "at_word": "site", "until": "surtout", "pos": [540, 1110]},
        {"type": "chip", "icon": "chat", "text": "…mais ils envoient un message", "at_word": "message", "until": "surtout", "pos": [540, 1215]},
        {"type": "chip", "style": "gold", "text": "→ ils veulent quelqu'un", "at_word": "quelqu", "until": "surtout", "pos": [540, 1325]},
        {"type": "notif", "time": "DIM. 23:04", "text": "Bonjour, le bateau est dispo demain ?", "at_word": "dimanche", "until": "rapidement", "pos": [540, 1165]},
        {"type": "notif", "time": "01:12", "text": "Il reste de la place samedi ?", "at_word": "1h", "until": "rapidement", "pos": [540, 1300]},
        {"type": "notif", "time": "01:13", "text": "On peut réserver pour 6 ?", "at_word": "réponse", "until": "rapidement", "pos": [540, 1435]},
        {"type": "chip", "icon": "check", "text": "L'agent IA répond tout de suite", "at_word": "rapidement", "pos": [540, 1130], "dur": 99},
        {"type": "chip", "icon": "up", "color": "o", "text": "Réservations de dernière minute", "at_word": "dernière", "pos": [540, 1235], "dur": 99},
        {"type": "chip", "style": "gold", "text": "Sinon, ils réservent ailleurs", "at_word": "répondait", "pos": [540, 1345], "dur": 99},
    ],

}
json.dump(C, open(D + "clips/whatsapp-reponse.json", "w"), ensure_ascii=False, indent=1)
print(" ".join(w[0] for w in words))
print(sum(p[1] - p[0] for p in pieces))
