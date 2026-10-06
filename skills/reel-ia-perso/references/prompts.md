# Prompts et paramètres qui ont marché

## Images de départ (nano_banana_pro, 2 crédits)

Plan cinéma (B-roll « locked in ») :
```
Cinematic film still, night. <<<b5c30150-305e-4c36-9ed3-eae2e8764a58>>> sits alone at a desk in a dark room, head bowed
down resting on his hands, exhausted, in front of a silver iMac whose screen casts cold teal light from above, a smartphone
on the desk glowing blue. High angle three-quarter view. Deep shadows, teal and blue color grade, anamorphic lens,
35mm film grain, shallow depth of field, moody, no text.
```
Variantes utilisées : mains sur clavier vues du dessus (lampe chaude), espresso au soleil, carnet vu du dessus,
téléphone avec dashboard (bokeh rouge), dos face à la ville au coucher du soleil, capuche éclairée par l'écran,
couloir de bureau ensoleillé en polo crème. Toujours terminer par « no text ».

Recréer une référence en remplaçant un personnage (image de la référence en `image_references`, aspect proche de la source) :
```
Recreate this exact photo: same white studio background, same framing, same camera angle, same lighting, same table with
<objets>. Replace the standing man on the left with <<<id>>>, <tenue>, <pose>, same pose. Replace the seated man on the right
with a different, fictional man in his fifties with short silver-grey hair, round tortoiseshell glasses, <tenue>, same pose.
Photorealistic, natural, no text.
```

## Animation (kling3_0, 8,75 crédits / 5 s)
`{"model":"kling3_0","mode":"pro","sound":"off","duration":5,"aspect_ratio":"16:9","medias":[{"value":"<job image>","role":"start_image"}],"prompt":"<mouvement précis + caméra>"}`
Décrire un geste simple et un mouvement de caméra lent (« slow push-in », « overhead locked-off shot »).

## Reprise de mouvements (hf_mult_motion_control)
`{"model":"hf_mult_motion_control","resolution":"720p","medias":[{"value":"<vidéo source>","role":"video_references"},{"value":"<job image de départ>","role":"image_references"}],"prompt":"Transfer the exact motion of both people from the reference video onto the two men in the image… Keep both faces and outfits identical to the image…"}`
- Découper la source avant envoi (`ffmpeg -ss A -t 14`) et retirer l'interface Instagram (crop de la zone vidéo).
- Coût ≈ 7 crédits/s : 14 s = 98, 31 s = 210.
- Le résultat est en 24 i/s, 1112×834 : le recadrer dans le montage.

## Upload d'un fichier local
`media_upload` (filename) → `curl -X PUT -H "Content-Type: …" --data-binary @fichier "<upload_url>"` → `media_confirm`.
