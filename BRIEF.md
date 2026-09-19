# BRIEF — Site Luma

> **Mise à jour du 19 septembre 2026.** Robin a fourni une maquette complète (hero photo + mascotte robot, accent violet `#4636F0`, cartes d’expertise, bandeau sombre, témoignages) et demandé de la reproduire à l’identique. Cette maquette remplace la direction artistique décrite ci-dessous (hero conversation, palette `#315CFF`, sans robot). Les tokens actuels sont dans `app/globals.css`, la copy dans `lib/content.ts`. Le reste de ce brief est conservé pour mémoire.

Brief de cadrage issu de l'entretien du 17 septembre 2026.
Source de vérité pour le positionnement, la copy et la DA : `LUMA-BRAND-UX-INSTRUCTIONS.md`. Ce brief ne le remplace pas, il fixe ce que le fichier laissait ouvert.

**Périmètre initial validé : Hero + section Problème.** Les neuf autres sections sont posées en squelette (titre, copy du fichier, aucune animation) pour être finies ensuite.

---

## 1. Direction artistique verrouillée à l'écran

### Palette (reprise telle quelle)

| Rôle | Couleur |
| --- | --- |
| Fond principal | `#F7F7F4` |
| Texte principal | `#111214` |
| Accent Luma | `#315CFF` |
| Surface secondaire | `#E7E8E8` |
| Texte secondaire | `#72757A` |

Le bleu est un signal : bouton CTA principal, badge « Traité par Luma ✓ », état « Qualifié », ligne du Luma Flow. Jamais en fond de section, jamais en dégradé.

### Typographie (reprise telle quelle)

Une seule famille sans-serif : **Geist** en premier choix, Inter en repli. Trois poids maximum : Regular 400, Medium 500, Semibold 600. Pas de typo futuriste, pas de mono décoratif.

| Rôle | Desktop | Mobile |
| --- | --- | --- |
| Titre hero et temps forts | 88 à 96 px, interlettrage -0,03 em, interligne 1,0 | 44 à 48 px |
| Titre de section | 64 à 72 px, interlettrage -0,02 em, interligne 1,05 | 36 à 40 px |
| Sous-titre | 22 à 24 px, interligne 1,4, couleur `#72757A` | 18 px |
| Corps | 17 à 18 px, interligne 1,55 | 16 px |
| Bulles de conversation | 16 px, interligne 1,4 | 15 px |

### Grille et espacement (« éditorial mesuré », option B)

- Conteneur 1 200 px, 12 colonnes, gouttière 24 px, marges latérales 24 px sur mobile.
- Texte sur 5 à 6 colonnes, visuel sur le reste. Une colonne de lecture ne dépasse pas 640 px.
- Respiration verticale entre sections : 160 px desktop, 96 px mobile.
- Trois temps forts en pleine hauteur d'écran (100 svh) : Hero, Promesse, CTA final. Les autres sections sont à hauteur de contenu.
- Rayons : 12 px pour les bulles et cartes, 999 px pour les boutons et badges. Ombres quasi absentes, une seule ombre douce autorisée sur la carte de conversation.
- Séparateurs : ligne 1 px `#E7E8E8`, jamais de bordure épaisse.

### Animation

- Durées : 400 à 700 ms pour les apparitions, courbe `cubic-bezier(0.22, 1, 0.36, 1)`. Rien sous 200 ms sauf les états de bouton.
- Une seule animation par section. Le hero et la section Problème sont les deux seules séquences orchestrées du site.
- Le reste : fade + translation de 16 px à l'entrée dans le viewport, une fois, jamais en boucle.
- `prefers-reduced-motion` : tout devient statique, la conversation du hero s'affiche déjà terminée, le titre est visible d'emblée. Le contenu critique ne dépend jamais d'une animation.

### Interdit

Robots, hologrammes, cerveaux, data centers, particules, 3D, néons, glitch, dégradés bleus, icônes en pluie, faux téléphone avec encoche, chiffres inventés, jargon (« révolutionner », « solution innovante », « puissance de l'IA »), plus d'un CTA bleu visible en même temps.

---

## 2. Structure de la page, section par section

Ordre validé : option A, onze sections. Les deux sections décrites hors structure dans le fichier sont fusionnées : le schéma Luma Flow entre dans « Comment Luma fonctionne », l'avant / après entre dans « Preuves ».

### 01 — Hero « conversation live » · périmètre initial · pleine hauteur
Intention : faire comprendre le produit par le mouvement avant de le nommer.
- Écran vide sur `#F7F7F4`, nav transparente. La conversation apparaît centrée dans une carte de 420 px max, sans chrome de téléphone.
- Séquence unique, 7 s desktop, 5 s mobile :
  1. Timestamp `22:47`, bulle client : « Bonsoir, vous avez encore une disponibilité samedi ? »
  2. Bulle Luma répond (texte court, ton humain).
  3. Deuxième bulle client, une nouvelle demande.
  4. Badge « Qualifié » en `#315CFF` sur cette demande.
  5. Ligne d'action « Rendez-vous créé · samedi 10:30 ».
  6. Badge « Traité par Luma ✓ » en bleu.
- La conversation s'estompe (600 ms). Une seconde plus tard, le titre se pose : **« Vous n'avez rien eu à faire. »** Puis le sous-titre du fichier, puis les deux CTA avec un léger décalage.
- Le titre reste. Pas de boucle. Un rafraîchissement rejoue la séquence.
- Mobile : même scène raccourcie, CTA visibles sous la carte dès le départ.
- CTA principal « Découvrir ce qu'on peut automatiser » : scroll doux vers Cas d'usage. CTA secondaire « Voir une démo » : rejoue la séquence du hero.

### 02 — Problème « accumulation » · périmètre initial
Intention : faire ressentir la surcharge avant de la nommer, seul moment d'inconfort volontaire du site.
- Titre seul : « Votre entreprise vous sollicite trop. »
- Au scroll, les sept sollicitations du fichier (demandes clients, devis, relances, questions, rendez-vous, suivi, tâches répétitives) apparaissent une à une comme des notifications, sur le côté droit en desktop, en pile verticale sur mobile. Cadence qui s'accélère légèrement, jusqu'à un empilement un peu trop dense.
- Puis la phrase du fichier vient calmer l'écran, seule, en grand : « Individuellement, aucune de ces tâches n'est compliquée. Additionnées, elles prennent vos journées. »

### 03 — Promesse · pleine hauteur · squelette
Intention : une respiration après la surcharge, un seul message.
« Moins à gérer. Plus à construire. » puis la phrase du fichier. Une seule animation d'apparition, énormément d'espace.

### 04 — Comment Luma fonctionne (avec le Luma Flow) · squelette
Intention : montrer la circulation de l'information en un schéma.
Une ligne bleue qui se trace au scroll et traverse la section : Demande client → Luma → Réponse + qualification + CRM + rendez-vous.

### 05 — Infrastructure sur mesure · squelette
Intention : Luma n'est pas un outil de plus.
Titre du fichier, les six éléments (outils, process, ton, équipes, données, clients) qui se connectent à Luma, puis « Luma s'adapte à votre fonctionnement. Pas l'inverse. » Deuxième apparition de l'interface conversationnelle.

### 06 — Cas d'usage · squelette · cible du CTA principal
Intention : six situations concrètes, pas une liste d'automatisations.
Six blocs sobres avec les libellés et phrases du fichier.

### 07 — Preuves (avec l'avant / après) · squelette
Intention : rendre le résultat tangible sans inventer.
Deux colonnes Avant Luma / Avec Luma du fichier, sous le titre « Une entreprise qui grandit ne devrait pas devenir plus lourde à gérer. » Emplacements de chiffres en placeholders visibles `[XX]`, emplacement logos vide, à remplir avec les résultats réels fournis plus tard.

### 08 — Méthode Luma · squelette
Intention : on commence par comprendre, pas par vendre.
Quatre étapes numérotées du fichier, titre du fichier.

### 09 — Pour qui · squelette
Intention : filtrer, Luma n'est pas pour tout le monde.
Message du fichier, liste des secteurs. Une grande photo fixe en environnement réel (à fournir).

### 10 — FAQ · squelette
Intention : lever les objections calmement.
Accordéon simple avec les dix questions du fichier, réponses courtes à écrire.

### 11 — CTA final · pleine hauteur · squelette
Intention : une invitation, pas une pression.
« Et si votre entreprise vous interrompait moins ? », sous-texte du fichier, bouton « Parler de mon entreprise ». Le portrait fondateur peut vivre ici, en petit, avec prénom et rôle.

### Navigation
Barre fixe, transparente sur le hero, fond `#F7F7F4` translucide avec ligne `#E7E8E8` dès le scroll. Logo à gauche, cinq liens au centre (Solutions, Cas d'usage, Méthode, À propos, FAQ), bouton bleu « Parler de mon entreprise » à droite. Mobile : logo, bouton, menu plein écran.

### Formulaire « Parler de mon entreprise »
Panneau latéral qui reprend l'interface conversationnelle du hero. Trois questions posées comme des messages, une à la fois : secteur d'activité, ce qui vous sollicite le plus, email ou téléphone. Envoi, puis « Reçu. On revient vers vous sous 24 h. » Repli accessible : champs classiques si JavaScript est indisponible.

---

## 3. Ton de la copy

Simple, direct, humain, calme, précis. Phrases courtes. On parle du quotidien du dirigeant, jamais de la technologie pour elle-même. Toujours un bénéfice, jamais une promesse gonflée. Tutoiement exclu, vouvoiement sobre.

Deux phrases dans le style Luma :

> Les demandes du samedi soir n'ont plus besoin de vous.

> Votre équipe répond déjà aux mêmes questions chaque jour. Luma peut le faire à sa place, avec vos mots.

---

## 4. Stack proposée

**Next.js (App Router) + Tailwind CSS + Motion, déployé sur Vercel.**
Motion orchestre proprement les deux séquences (hero, problème) et respecte `prefers-reduced-motion` nativement. Tailwind porte les tokens de la palette et de la typo dans un seul fichier de thème. Le formulaire conversationnel est un composant React avec une route API pour l'envoi. Les pages Solutions, Cas d'usage et À propos s'ajoutent ensuite sans rien refaire. Déploiement automatique à chaque push, la connexion Vercel est déjà disponible.

---

## 5. Ce que tu dois fournir

| Élément | État | Ce que je fais en attendant |
| --- | --- | --- |
| Logo Luma (SVG) | Rien pour l'instant | Logotype typographique « Luma » en Geist Semibold |
| Portrait fondateur | Reçu (studio, fond noir) | Réservé pour le CTA final et la page À propos, pas pour les sections claires |
| Deux photos en environnement réel, fond clair, calme | Rien pour l'instant | Emplacements avec image neutre de remplacement |
| Nom de domaine | Rien pour l'instant | URL Vercel de prévisualisation |
| Exemple de conversation réel pour le hero | Rien pour l'instant | Exemple du fichier « disponibilité samedi ? » |
| Résultats clients réels et niveau d'anonymat | Plus tard | Placeholders `[XX]` visibles, jamais de chiffre inventé |
| Logos clients ou partenaires | Rien pour l'instant | Emplacement vide, masqué tant qu'il est vide |
| Réponses courtes aux dix questions de la FAQ | À écrire | Je propose un premier jet à valider |
| Prénom et rôle à afficher sous le portrait | À confirmer | Rien d'affiché tant que ce n'est pas confirmé |

---

## 6. Questions restées ouvertes

1. Où arrivent les demandes du formulaire : email, WhatsApp, CRM ? Sans réponse, je branche un envoi par email vers une adresse que tu me donneras.
2. WhatsApp fait-il partie de l'offre réelle ? La FAQ le mentionne, je garde la question mais la réponse dépend de toi.
3. Y a-t-il une version sombre du hero à prévoir un jour ? Le fichier l'évoque, l'entretien a tranché pour le clair. Je ne prévois rien pour le sombre.
4. Le texte exact de la réponse Luma dans la conversation du hero et de la deuxième demande client. Je propose un premier jet à valider avant intégration.
5. Prénom, rôle et courte phrase fondateur pour le CTA final et la page À propos.
