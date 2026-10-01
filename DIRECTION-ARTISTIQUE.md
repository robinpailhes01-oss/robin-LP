# Luma — Direction artistique web (octobre 2026)

Ce document remplace l’ancienne identité (bleu électrique, violet `#4636F0`, mascotte robot) et les parties « palette » et « mascotte » des documents précédents, y compris « LUMA_Direction_Artistique_Web_Agents_WhatsApp.md ». Les tokens vivent dans `app/globals.css`, les contenus dans `lib/content.ts`.

## Identité

- Positionnement : j’aide les PME à améliorer et simplifier leur relation client grâce à des outils IA personnalisés.
- Personnelle, lumineuse, épurée, crédible.
- Robin Pailhes est le visage et l’expertise. Luma est la marque de l’offre. Une seule identité.
- Voix : « je » pour le parcours et l’approche de Robin, « Luma » pour l’offre, « vous » pour les besoins du client.
- Aucune équipe inventée, aucun chiffre non documenté, aucune promesse absolue.

## Palette

| Rôle | Nom | Valeur | Token |
| --- | --- | --- | --- |
| Fond principal | Blanc | `#FFFFFF` | `white` |
| Fond alterné discret | Blanc doux | `#FCFCFA` | `paper` |
| Sections et panneaux clairs | Bleu très clair | `#EAF2F8` | `mist` |
| Bordures de boutons, accents doux | Bleu poudré | `#CADFED` | `powder` |
| Décor, éléments secondaires | Bleu ardoise | `#71879A` | `slate` |
| Titres, texte, boutons | Bleu nuit | `#17263D` | `night` |

Déclinaisons du bleu nuit pour le texte : `ink` `#3F4E62` (texte courant), `muted` `#5B6B7E` (texte secondaire), `line` `#DCE6EE` (filets).

Répartition visée : environ 70 % de blanc, 25 % de bleu clair, 5 % d’accents.

Contrastes sur blanc : bleu nuit 15:1, `ink` 8,5:1, `muted` 5,5:1. Le bleu ardoise (3,7:1) ne sert jamais pour du petit texte : uniquement pour le décor, les numéros et les filets.

Les couleurs d’outils (vert WhatsApp, logos Gmail ou HubSpot) n’apparaissent que là où elles aident à comprendre.

## Typographie

- Titres : Inter Tight, 800, compacts, approche légèrement serrée (−0,03 à −0,04 em). Classes `.t-display`, `.t-h1`, `.t-h2`, `.t-h3`.
- Texte : Inter, 400 à 600, interligne 1,55 à 1,6. Classes `.t-lead`, `.t-body`, `.t-kicker`.
- Pas de césure, pas de mot coupé sur mobile. Les tailles sont fluides (`clamp`).
- Un seul accent graphique par page au plus : le surlignage bleu poudré `.u-accent` sur « plus simple » dans le hero.

## Photos

- Uniquement de vraies photos de Robin, visage fidèle, retouche légère.
- Recadrages variés de la même séance : portrait 4:5 dans le hero, buste dans « À propos », avatar dans le contact.
- Aucune photo générée, aucune mascotte, avatar, robot, Lego ou scène 3D.
- Les solutions s’expliquent par des schémas simples, des éléments d’interface sobres et des exemples étiquetés « Exemple illustratif ».

## Mise en page et composants

- Marges généreuses, largeur de lecture contrôlée, sections blanches et bleu très clair alternées.
- Surfaces plates, bordures légères, ombres très discrètes (seulement la pop-up).
- Compositions variées : listes éditoriales, frises numérotées, colonnes avec filet, pas de cartes identiques partout.
- Bouton principal : fond bleu nuit, texte blanc, survol plus sombre, focus visible.
- Bouton secondaire : fond blanc, bordure bleu poudré, texte bleu nuit.

## Animation

- Apparitions courtes (0,5 s, 14 px), transitions de boutons de 200 ms.
- Aucun effet permanent, objet flottant, halo ou animation de robot.
- Tout est désactivé avec `prefers-reduced-motion`, et le contenu reste visible sans JavaScript.
