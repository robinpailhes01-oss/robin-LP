---
name: reel-ia-perso
description: Fait apparaître Robin dans un Reel généré par IA avec Higgsfield — plans cinématiques de lui (Kling 3.0), reprise des mouvements d'une vidéo de référence avec lui à la place d'un personnage (Genjutsu motion control), images de lui dans un décor. Utiliser dès que Robin demande « mets-moi dans cette vidéo », « génère des plans de moi », « remplace le grand/petit personnage par moi », « refais ce réel avec mon personnage », « utilise Higgsfield », ou veut une scène qu'il n'a pas filmée. Pour remplacer simplement une personne par une vidéo que Robin a tournée, utiliser plutôt reel-remix (gratuit).
---

# Robin dans un Reel IA (Higgsfield)

Chaque génération coûte des crédits réels : la règle d'or est **vérifier avant de lancer**, et lancer court.

## Le personnage de Robin

- Élément Higgsfield **Robin-v3** : `b5c30150-305e-4c36-9ed3-eae2e8764a58` (6 photos sans lunettes : portrait studio,
  selfie trois-quarts, ordinateur, lecture, sport, terrasse). S'insère dans un prompt d'image avec `<<<id>>>`.
- Ressemblance validée par Robin. Les photos avec lunettes de soleil ou de nuit dégradent le résultat : ne pas les ajouter.
- Robin : ~30 ans, cheveux châtains coiffés en arrière, barbe courte. Il travaille souvent sur son bateau (boiseries,
  banquette crème) : décor parfait pour des plans authentiques.

## Méthodes et coûts mesurés

| Besoin | Méthode | Coût |
|---|---|---|
| Image de Robin dans une scène | `generate_image`, `nano_banana_pro`, prompt avec `<<<id>>>` | 2 crédits |
| Retoucher une image (changer un détail) | `nano_banana_2` avec l'image en `image_references` | 1,5 |
| Animer une image (5 s, plan cinéma) | `kling3_0`, `mode: pro`, `sound: off`, `start_image` = job image | 8,75 |
| Reprendre les mouvements d'une vidéo | `hf_mult_motion_control` (720p), vidéo en `video_references` + image de départ | ≈ 7 / seconde |
| Voix off | `text2speech_v2` variante elevenlabs | faible |

Toujours : `get_cost: true` d'abord, vérifier `balance`, annoncer le coût à Robin quand ça dépasse ~50 crédits.
Si une génération renvoie une « preset recommendation », relancer avec `declined_preset_id` (Robin veut le littéral).
Les jobs vidéo prennent 2 à 10 min : poller `jobs_wait` ; pour une vidéo longue, programmer une reprise
(`send_later`) plutôt que boucler.

## Déroulé

1. **Analyser la référence** comme dans reel-remix (coupes, typo, durée). Repérer qui fait quoi.
2. **Confirmer le rôle de Robin avant toute vidéo** : « vous êtes le grand qui joue / le petit assis ? ». Une erreur de
   rôle sur une vidéo de 31 s a déjà coûté 210 crédits pour rien.
3. **Image de départ** : recréer la composition de la référence (même cadrage, lumière, objets) avec Robin à sa place.
   La vérifier visuellement avant de l'animer.
4. **Personnes réelles** : si la référence montre des célébrités ou des inconnus identifiables, les remplacer par des
   personnages inventés et clairement différents (autre âge, cheveux, lunettes). Mettre Robin aux côtés d'une vraie
   célébrité dans une vidéo de marque ferait croire à une collaboration. Si le modèle recopie un visage connu,
   corriger l'image (1,5 crédit) avant d'animer. L'expliquer en une phrase à Robin.
5. **Vidéo** : pour un trend à mouvements précis → motion control sur un extrait court (10-15 s) qui contient le
   moment fort ; pour du B-roll → Kling 3.0 par plans de 5 s, puis montage rapide.
6. **Montage** avec le skill `reel-kit` (textes, texte derrière le sujet, interface façon app, musique libre) ou
   `reel-remix/scripts/assemble.py`. Garder la musique de la référence si Robin le demande, sinon `music_synth.py`.
7. **Livrer** : vidéo + récapitulatif des crédits dépensés et du solde restant. Instagram peut afficher « Créé avec l'IA ».

Détails des paramètres et exemples de prompts : `references/prompts.md`.
