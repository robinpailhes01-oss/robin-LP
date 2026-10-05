"""Construit cues.json : placement des répliques, mots horodatés, sous-titres et bornes de scènes."""
import json
from pathlib import Path

DIR = Path(__file__).parent
W = json.loads((DIR / "assets/p/words.json").read_text())

# (réplique, pause avant en s)
PLAN = [
    ("l01", 1.3), ("l02", 0.35), ("l03", 0.6), ("l04", 0.45), ("l05", 0.55),
    ("l06", 1.0),
    ("l07", 1.3), ("l08", 0.45), ("l09", 0.45),
    ("l10", 1.1), ("l11", 0.6), ("l12", 0.6), ("l13", 0.6), ("l14", 0.6), ("l15", 0.6),
    ("l16", 1.1),
    ("l17", 1.1),
    ("l18", 1.1),
    ("l19", 1.4), ("l20", 0.8),
]
TAIL = 3.6

# Sous-titres : texte affiché par réplique, découpé en segments (le 1er mot de chaque segment fixe son départ)
SUBS = {
    "l01": ["Vous dirigez une entreprise qui tourne."],
    "l02": ["Des clients, une équipe, des journées bien remplies."],
    "l03": ["Mais chaque jour, les mêmes petites tâches reviennent."],
    "l04": ["Répondre aux mêmes questions. Relancer un devis.", "Caler un rendez-vous. Mettre à jour un fichier."],
    "l05": ["Une à une, rien de compliqué.", "Mises bout à bout, elles prennent vos journées."],
    "l06": ["Et si elles ne passaient plus par vous ?"],
    "l07": ["Nous sommes Luma, une agence basée à Montpellier."],
    "l08": ["Notre métier : confier à l'intelligence artificielle", "le travail répétitif de votre entreprise."],
    "l09": ["Et vous n'avez pas besoin d'y connaître quoi que ce soit.", "On s'occupe de tout."],
    "l10": ["Concrètement, on met en place un assistant qui travaille pour vous."],
    "l11": ["Il répond à vos clients, même à dix heures du soir."],
    "l12": ["Il prend les rendez-vous dans votre agenda."],
    "l13": ["Il relance les devis et les factures oubliés."],
    "l14": ["Il range chaque information au bon endroit."],
    "l15": ["Et chaque semaine, il vous dit ce qui a été fait."],
    "l16": ["Chaque entreprise est différente. Alors on part de la vôtre :", "vos outils, votre façon de travailler, vos mots."],
    "l17": ["D'abord, on comprend votre entreprise. On repère ce qui vous fait perdre du temps.", "On construit votre système. Puis on le fait évoluer avec vous."],
    "l18": ["Vous, vous retrouvez du temps pour l'essentiel :", "vos clients, votre équipe, votre développement."],
    "l19": ["Luma. Moins à gérer, plus à construire."],
    "l20": ["Parlons de votre entreprise. L'audit est offert, et sans engagement."],
}
# index du mot qui ouvre le 2e segment
SPLIT = {"l04": 7, "l05": 6, "l08": 8, "l09": 13, "l16": 10, "l17": 15, "l18": 8}

t = 0.0
lines, subs = {}, []
for key, gap in PLAN:
    t += gap
    w = W[key]
    lines[key] = {"at": round(t, 3), "dur": w["dur"], "words": [[x, round(t + s, 3)] for x, s in w["words"]]}
    segs = SUBS[key]
    starts = [t, t + w["words"][SPLIT[key]][1]] if len(segs) == 2 else [t]
    end = t + w["dur"]
    for i, s in enumerate(segs):
        subs.append({"text": s, "a": round(starts[i], 3), "b": round(starts[i + 1] if i + 1 < len(segs) else end + 0.25, 3)})
    t = end
duration = round(t + TAIL, 2)

L = lambda k: lines[k]["at"]
E = lambda k: lines[k]["at"] + lines[k]["dur"]
wd = lambda k, i: lines[k]["words"][i][1]
scenes = {
    "day": [0, L("l06") - 0.4],
    "spark": [L("l06") - 0.4, L("l07") - 0.2],
    "who": [L("l07") - 0.2, L("l10") - 0.7],
    "board": [L("l10") - 0.7, L("l16") - 0.8],
    "fit": [L("l16") - 0.8, L("l17") - 0.8],
    "method": [L("l17") - 0.8, L("l18") - 0.8],
    "result": [L("l18") - 0.8, L("l19") - 0.9],
    "end": [L("l19") - 0.9, duration],
}
out = {"duration": duration, "lines": lines, "subs": subs, "scenes": scenes}
(DIR / "cues.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
print("durée", duration)
for k, v in scenes.items():
    print(k, [round(x, 2) for x in v])
