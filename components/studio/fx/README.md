# Studio — primitives visuelles (`components/studio/fx`)

Système visuel sombre « centre de commande » du studio privé `/studio`. Tout le style vit dans
`app/studio/studio.css`, importé par `app/studio/layout.tsx`, sous la classe `.studio` posée sur le conteneur racine :
rien ne peut toucher le site public.

## Règles communes

- **Couches CSS** : les classes `.studio-*` sont dans `@layer components`. Une classe Tailwind posée sur le même
  élément (`p-6`, `bg-…`, `absolute`, `rounded-…`) l’emporte toujours. Hors couche : sélection, focus, compatibilité `.t-*`
  et la coupure des animations en mouvement réduit.
- **Mouvement** : seuls `transform` et `opacity` sont animés en boucle. L’état sans animation est toujours l’état final.
  Sous `prefers-reduced-motion: reduce`, tout s’arrête (CSS `animation: none !important` + JavaScript qui affiche l’état final).
  Les effets de survol qui bougent sont réservés aux pointeurs fins (`(hover: hover) and (pointer: fine)`).
- **Budget de mouvement ambiant, par écran** : l’aurore, une bordure conique, **un seul** grand portrait qui flotte
  (fiche agent ou carte d’Alma), **un seul** point qui pulse (le point « vivant » : la priorité d’Alma, une donnée lue en direct),
  au plus un anneau d’orbite, et les comètes des schémas de flux (seulement à l’écran). Petits avatars, points « À entraîner »
  et cartes personnages restent immobiles : la richesse se gagne au survol (parallaxe de `SpotlightLayer`).
- **Rayons concentriques** : grande scène 32 px → pièce / panneau 28 → carte dans une pièce 20 → encadré 14 → puces pleines
  (`--s-radius-xl`, `--s-radius-lg`, `--s-radius`, `--s-radius-sm`). Éviter plus de deux épaisseurs de verre empilées.
- **Verre teinté** : fond bleu poudré `rgb(202 223 237 / 0.045)` + reflet `0.06` + dégradé radial glacier très faible
  (jamais de blanc pur : sans halo derrière, il vire au gris neutre).
- **Mobile** : aurore immobile (deux halos), pas de halo flou sous `GlowBorder`, pas d’inclinaison ni de reflet au toucher,
  transition de page sans flou.
- **Serveur par défaut** : `Aurora`, `GlassCard`, `GlowBorder`, `LiveDot`, `OrbitRing` sont des composants serveur sans JavaScript.
  `SpotlightCard` (+ `SpotlightLayer`), `FlowStage` (+ `FlowNode`), `Beam`, `CountUp`, `FadeIn`, `Stagger`, `TypeText`, `DocumentTone`
  sont clients ; leurs `children` restent rendus côté serveur.
- **Honnêteté** : `CountUp` ne reçoit que des valeurs de `getStudioStats` (sinon `null` → « — »). Aucun graphique décoratif.
- Import direct (`@/components/studio/fx/GlassCard`) ou par le barrel `@/components/studio/fx`.

## Jetons (`tokens.ts`, `studio.css`)

| Jeton | Valeur | Usage |
| --- | --- | --- |
| `DEPT_GLOW.prospection` | `#4C8DFF` | bleu électrique doux |
| `DEPT_GLOW.direction` (`GLACIER`) | `#9CC3FF` | bleu glacier (anneau par défaut) |
| `DEPT_GLOW.contenu / clients / production` | `#A9B9D6` / `#8CCFB5` / `#D9B98C` | pièces pas encore ouvertes, plus sourdes |
| `POWDER` | `#CADFED` | bleu poudré Luma : focus, touches neutres |
| `deptGlow(id)` | — | lueur d’un département, repli glacier |
| `STATUS_TONE` | `a-entrainer → warn` (ambre), `pret → info`, `actif → ok` | ton du `LiveDot` |
| `--s-bg` / `--s-bg-2` | `#060B16` / `#0A1324` | fond |
| `--s-ink` / `--s-text` / `--s-muted` | blanc / 74 % / 62 % | titres / courant / secondaire (AA ≥ 6:1) |
| `--s-line`, `--s-line-strong` | blanc 9 % / 15 % | bordures |

Classes utiles : `studio-display`, `studio-h1`, `studio-h2`, `studio-h3`, `studio-kicker`, `studio-lead`, `studio-body`,
`studio-num` (chiffres tabulaires), `studio-gradient-text` (un titre par écran), `studio-glass(--raised|--solid|--subtle|--dashed|--glow)`,
`studio-lift` (montée au survol), `studio-chip`, `studio-dots` (trame de points), `studio-halo` (halo coloré, couleur dans `--halo`),
`studio-rule` (filet lumineux), `studio-btn` + `studio-btn--primary|--ghost|--quiet`, `studio-input`, `studio-shimmer` (reflet qui balaie),
`studio-float` / `studio-breathe` (flottement / respiration, délai dans `--float-delay`).

```tsx
<span aria-hidden className="studio-halo absolute -top-20 left-1/2 size-80 -translate-x-1/2 [--halo:#4C8DFF]" />
<h1 className="studio-h1 studio-gradient-text">Le QG</h1>
<Link href="/studio/agents/alma" className="studio-btn studio-btn--primary">Ouvrir la fiche</Link>
```

---

## `Aurora` (serveur)

Fond fixe derrière tout le studio : halos flous qui dérivent (46 à 72 s), grille fine qui s’efface, grain, vignette. `aria-hidden`.
Déjà posé une fois dans `app/studio/layout.tsx` : ne pas le répéter dans les pages.

| Prop | Type | Défaut |
| --- | --- | --- |
| `variant` | `"default" \| "focus"` | `"default"` (focus : lumière resserrée au centre) |
| `grid` | `boolean` | `true` |

```tsx
<Aurora />
```

Mouvement réduit et mobile : halos immobiles.

## `GlassCard` (serveur)

Surface de verre dépoli.

| Prop | Type | Défaut |
| --- | --- | --- |
| `as` | `"div" \| "section" \| "article" \| "aside" \| "li" \| "header" \| "footer" \| "figure"` | `"div"` |
| `variant` | `"default" \| "raised" \| "solid" \| "subtle" \| "dashed"` | `"default"` |
| `pad` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` |
| `radius` | `"md"` (20) `\| "lg"` (24) `\| "xl"` (28) | `"lg"` |
| `glow` | couleur | — (lueur colorée sous la carte) |
| `interactive` | `boolean` | `false` (montée de 3 px au survol, souris seulement) |
| …attributs HTML | `id`, `aria-*`, `className`, `style` | |

```tsx
<GlassCard as="section" variant="raised" glow={DEPT_GLOW.prospection} aria-labelledby="equipe">…</GlassCard>
<GlassCard variant="dashed" pad="sm">Poste prévu</GlassCard>
```

Mouvement réduit : pas de montée. Transparence réduite : surface pleine, sans flou.

## `SpotlightCard` (client)

Halo radial qui suit le curseur (surface + liseré) et inclinaison 3D douce par ressorts motion.

| Prop | Type | Défaut |
| --- | --- | --- |
| `className`, `style` | | les coins arrondis viennent de `className` |
| `color` | couleur du halo de surface | `rgb(202 223 237 / 0.13)` |
| `rim` | couleur du halo du liseré | `rgb(202 223 237 / 0.7)` |
| `tilt` | degrés max (0 = aucune) | `5` |
| `size` | diamètre du halo (px) | `420` |

```tsx
<SpotlightCard className="studio-glass rounded-[24px] p-6" color="rgb(76 141 255 / 0.14)">…</SpotlightCard>
```

Pointeur grossier (tactile) ou mouvement réduit : ni halo ni inclinaison, la carte reste statique. Le halo est en
`pointer-events: none` : liens et boutons restent cliquables.

### `SpotlightLayer` (client)

Sous-couche d’une `SpotlightCard` qui glisse en parallaxe au survol (ressorts motion, transform seulement) :
`depth` (px, négatif = à l’opposé du curseur, donc de l’inclinaison) et `zoom` (0,06 = 1,06 au survol). Immobile hors survol,
sur écran tactile et en mouvement réduit. `CharacterCard` l’utilise pour le portrait (`depth={-6} zoom={0.06}`) et le prénom (`depth={3}`).

## `FlowStage` + `FlowNode` (client)

Schéma de flux lisible : **un seul rail continu** du centre du premier nœud au centre du dernier, **une seule comète** qui le parcourt
en entier (70 % du cycle, linéaire), et un bref éclat de l’anneau de chaque nœud au moment où elle l’atteint (halo : opacity + scale).
Les nœuds sont des `FlowNode` posés n’importe où dans les enfants (rendus côté serveur) ; leur centre est mesuré dans la page
(sans les transforms des entrées), donc le rail tombe juste en rangée comme en colonne et suit les redimensionnements.

| Prop | Type | Défaut |
| --- | --- | --- |
| `color` | couleur du rail et de la comète | — |
| `segment` | secondes de trajet entre deux nœuds voisins | `1.1` |
| `tail` | longueur de la traîne (px) | `140` horizontal, `110` vertical |

```tsx
<FlowStage color={DEPT_GLOW.prospection} className="grid gap-y-8 xl:grid-cols-4">
  {steps.map((s) => (
    <li key={s.key}>
      <FlowNode><AgentAvatar agent={s.agent} size={56} decorative /></FlowNode>
      <p>{s.title}</p>
    </li>
  ))}
</FlowStage>
```

La comète ne tourne que quand le schéma est à l’écran. Mouvement réduit : le rail seul. Décoratif : l’ordre est dit par le texte.

## `GlowBorder` (serveur)

Bordure en dégradé conique qui tourne (8 s par tour) autour de l’élément clé de l’écran — la carte d’Alma. Une seule par écran.

| Prop | Type | Défaut |
| --- | --- | --- |
| `as` | `"div" \| "section" \| "article" \| "aside"` | `"div"` |
| `className` | classes du conteneur (placement) | |
| `innerClassName` | classes du corps (padding, grille) | |
| `colors` | `[principale, reflet]` | `["#4C8DFF", "#CADFED"]` |
| `radius` | px | `28` |
| `width` | épaisseur (px) | `1.5` |
| `speed` | secondes par tour | `8` |
| `start` | angle de départ (deg) | `0` |
| `bloom` | halo flou statique derrière (desktop) | `true` |
| `surface` | `"solid" \| "glass" \| false` | `"solid"` (verre presque opaque) |

```tsx
<GlowBorder as="section" aria-labelledby="priorite-jour" colors={["#9CC3FF", "#CADFED"]} innerClassName="p-6 sm:p-10">
  …
</GlowBorder>
```

Mouvement réduit : le dégradé reste, immobile. Mobile : pas de halo flou.

## `Beam` (client)

Connecteur SVG court (une branche de la coordination d’Alma), avec une lumière qui le parcourt (seulement quand il est à l’écran).
Pour un schéma à plusieurs étapes, préférer `FlowStage` : un tronçon par lien donne un clignotement, pas un flux.

| Prop | Type | Défaut |
| --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical" \| "responsive"` | `"horizontal"` (responsive : vertical < 768 px, horizontal au-delà) |
| `color` | couleur | `#4C8DFF` |
| `duration` | secondes par passage | `3.2` |
| `delay` | secondes (pour enchaîner : 0, 0.8, 1.6…) | `0` |
| `reverse` | `boolean` | `false` |
| `active` | `false` = lien pas encore en service : pointillé, sans lumière | `true` |
| `caps` | pastilles aux extrémités | `true` |
| `length` | longueur min. en vertical (CSS) | `"2.5rem"` |
| `className` | | |

```tsx
<div className="flex flex-col items-center md:flex-row">
  <CharacterCard agent={leo} accent={DEPT_GLOW.prospection} size="sm" />
  <Beam orientation="responsive" delay={0} />
  <CharacterCard agent={ines} accent={DEPT_GLOW.prospection} size="sm" />
  <Beam orientation="responsive" delay={0.8} />
  <PlannedAvatar size={52} />
</div>
```

Horizontal : s’étire dans une rangée flex (`flex: 1`, 14 px de haut). Décoratif (`aria-hidden`) : le sens du flux s’écrit dans le texte.
Mouvement réduit : le trait seul.

## `CountUp` (client)

Monte de 0 à la valeur à l’entrée dans l’écran (une fois), chiffres tabulaires, format `fr-FR`.

| Prop | Type | Défaut |
| --- | --- | --- |
| `value` | `number \| null` | — (`null` → « — » en trait fin `.studio-null`, sans animation, « Non disponible » pour les lecteurs d’écran) |
| `duration` | secondes | de 0,6 s à 1,6 s selon la taille du nombre |
| `className` | | |
| `nullText` | texte lu à la place de « — » | `"Non disponible"` |

```tsx
<CountUp value={stats.connected && !stats.error ? stats.leadsWeek : null} />
```

La valeur finale est toujours dans le HTML (sr-only). Le chiffre visible attend le départ ; filet CSS s’il ne démarre pas (1,8 s).
Mouvement réduit : valeur finale immédiate. Valeur absente : `.studio-null` (Inter 300, 70 % de la taille, sans interlettrage, blanc 30 %),
et la tuile prend un état éteint assumé (pointillés `studio-glass--dashed`, pas de filet de couleur, prise débranchée à côté du libellé).

## `FadeIn` et `Stagger` (client)

Entrées en cascade (fondu + montée). `Stagger` anime chaque enfant direct à son tour, sans enveloppe ajoutée (jusqu’à 20 rangs).

| Prop | Type | Défaut |
| --- | --- | --- |
| `as` | `div, section, article, aside, header, footer, nav, li, ul, ol, span, p, figure` | `"div"` |
| `trigger` | `"mount"` (dès l’affichage, CSS, sans attendre le JS) `\| "inView"` (à l’entrée dans l’écran, `useInView` de motion) | `"mount"` |
| `delay` | secondes | `0` |
| `step` (Stagger) | secondes entre deux enfants | `0.07` |
| `y` | montée de départ (px) | `14` |
| `duration` | secondes | `0.7` |
| …attributs HTML | `id`, `aria-*`, `className`, `style` | |

```tsx
<Stagger as="ul" className="grid gap-4 md:grid-cols-4" delay={0.15}>
  {team.map((a) => <li key={a.id}><CharacterCard agent={a} accent={glow} /></li>)}
</Stagger>
<FadeIn trigger="inView" as="section">…</FadeIn>
```

`"mount"` pour le haut de page (rien n’est caché en attendant l’hydratation), `"inView"` plus bas (caché au rendu serveur, filet CSS à 1,8 s).
Mouvement réduit : aucun décalage, contenu visible immédiatement, même avant l’hydratation.

## `TypeText` (client)

Saisie progressive d’un texte brut (le message d’Alma), avec curseur lumineux et pauses après la ponctuation.

| Prop | Type | Défaut |
| --- | --- | --- |
| `text` | `string` | — |
| `as` | `"p" \| "span" \| "div" \| "h1" \| "h2" \| "h3" \| "blockquote"` | `"p"` |
| `speed` | ms par caractère | `26` |
| `delay` | secondes avant la première lettre | `0.3` |
| `caret` | couleur du curseur | `#9CC3FF` |
| `className`, `id` | | |

```tsx
<TypeText as="p" text={agent.tagline} className="studio-lead" />
```

Le texte complet est dans un `span` sr-only (lu d’un bloc), la partie animée est `aria-hidden`. Le reste du texte est déjà en place
(transparent) : aucun saut de mise en page. Démarre à l’entrée dans l’écran ; filet CSS à 2,2 s. Mouvement réduit : texte complet, sans curseur.

## `LiveDot` (serveur)

Point de statut lumineux, fixe par défaut ; onde qui pulse sur demande (un seul point « vivant » par écran).

| Prop | Type | Défaut |
| --- | --- | --- |
| `status` | `AgentStatus` | — (« À entraîner » : ambre, fixe) |
| `tone` | `"ok" \| "info" \| "warn" \| "error" \| "idle" \| "live"` | dérivé de `status`, sinon `"info"` |
| `pulse` | `boolean` | `false` (jamais sur `"idle"`) |
| `size` | px | `8` |
| `label` | texte lu seul (sinon décoratif, `aria-hidden`) | — |

```tsx
<LiveDot status={agent.status} /> {statusLabel[agent.status]}
```

Mouvement réduit : le point reste, l’onde disparaît.

## `OrbitRing` (serveur)

Anneaux décoratifs qui tournent lentement autour d’un portrait (38 s, 64 s inverse, 90 s), avec un satellite lumineux.
À poser dans un parent `relative` (le portrait).

| Prop | Type | Défaut |
| --- | --- | --- |
| `color` | couleur | `#9CC3FF` |
| `rings` | `1 \| 2 \| 3` | `2` (au plus un anneau par écran dans les pages) |
| `inset` | débord (valeur CSS de `inset`) | `"-14%"` |
| `speed` | multiplicateur de durée | `1` |

```tsx
<div className="relative">
  <AgentAvatar agent={alma} size={200} animated priority />
  <OrbitRing color={DEPT_GLOW.direction} rings={3} />
</div>
```

Mouvement réduit : anneaux immobiles.

## `DocumentTone` (client)

Donne au document (`html`, `body`) le fond nuit et le schéma sombre tant que le studio est monté (pas de bande blanche au rebond,
barre de défilement sombre), et rétablit tout au démontage. Déjà posé dans `app/studio/layout.tsx`.

---

## Personnages et éléments partagés (hors `fx`)

### `AgentAvatar` / `PlannedAvatar` (`components/studio/AgentAvatar.tsx`, serveur)

`AgentAvatar({ agent: Pick<Agent, "name" | "avatar">, size?, animated?, ring?, decorative?, priority?, className? })` :
portrait 3D (`agent.avatar.portrait`) via `next/image`, recadré sur le visage (plus serré sous 56 px), anneau lumineux fin + halo.
`ring` : couleur (défaut glacier). `animated` : flottement + halo qui respire (coupés en mouvement réduit), ignoré sous 120 px.
`alt` = prénom ; `decorative` → `alt=""` et `aria-hidden`. `priority` : portrait principal au-dessus de la ligne de flottaison
(`loading="eager"`, `fetchPriority="high"` — `priority` de `next/image` est obsolète en Next 16).

`PlannedAvatar({ size?, className? })` : disque de verre, contour pointillé, silhouette en pointillé bleu poudré, `aria-hidden`.

### `CharacterCard` (`components/studio/CharacterCard.tsx`, serveur + SpotlightCard)

Carte « sélection de personnage » : portrait vertical éclairé par la couleur du département et fondu vers la carte,
prénom très grand, rôle, `LiveDot` + statut, puis `details` (à 20 px fixes sous le statut) et `footer` (poussé en bas).
Survol souris : inclinaison, halo, parallaxe (portrait −6 px et 1,06 ; prénom +3 px), liseré plus vif.
Toute la carte mène à la fiche (lien couvrant, focus visible dans les coins arrondis) ; les liens et boutons de `details`/`footer`
restent cliquables au-dessus.

| Prop | Type | Défaut |
| --- | --- | --- |
| `agent` | `Pick<Agent, "id" \| "name" \| "role" \| "status" \| "avatar">` | — |
| `accent` | couleur du département (`DEPT_GLOW[...]`) | — |
| `href` | `string \| null` | `/studio/agents/{id}` (`null` : sans lien) |
| `details`, `footer` | `ReactNode` | — |
| `subgrid` | carte sur 4 rangées de la grille parente (portrait, identité, détails, pied), dès 640 px | `false` |
| `roleLines` | `1 \| 2` : réserve deux lignes au rôle (statuts alignés dans une rangée) | `1` |
| `size` | `"lg" \| "md" \| "sm"` | `"md"` (portrait 4/5, 5/6, carré ; rayons 26, 20, 16) |
| `as` | `"h2" \| "h3" \| "h4"` | `"h3"` |
| `priority` | `boolean` | `false` |
| `sizes` | attribut `sizes` du portrait | adapté à `size` |

```tsx
<ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <li className="sm:row-span-4 sm:grid sm:grid-rows-subgrid sm:gap-y-0">
    <CharacterCard agent={leo} accent={DEPT_GLOW.prospection} size="lg" subgrid details={…} footer={…} />
  </li>
</ul>
```

### `PortraitBusts` / `PlannedBusts` (`components/studio/PortraitBusts.tsx`, serveur)

Rangée de portraits en buste qui se chevauchent (découpes verticales fondues vers le bas, un buste sur deux plus bas et derrière),
`size="lg"` (150 → 220 px de haut, en-têtes des départements) ou `"sm"` (104 → 136 px, QG). `linked` : chaque buste mène à la fiche ;
`names` : prénom sur le fondu. `PlannedBusts` : capsules en pointillés des postes prévus.

### Portraits découpés (`studio.css`, section 12 bis)

`.studio-cut` (+ `--b`, `--hero`, `--alma` : masques de fondu), `.studio-cut-layer` (couche de l’image, avec `studio-float`),
`.studio-cut-glow` (lumière du département en anneau autour de la tête, mode « screen » : le fond des portraits est opaque),
`.studio-edge-v` (liseré lumineux vertical). Utilisés par `HeroPortrait` (fiche agent) et la carte d’Alma au QG.

### `ui.tsx` (mêmes exports, mêmes props)

`StatusPill` (pastille de verre + `LiveDot`), `Kpi` (verre, `CountUp`, « — » + raison si `null`), `DeptBadge` (pastille lumineuse
`DEPT_GLOW` ; accepte aussi `id` pour la couleur), `Panel` (verre), `PanelTitle`, `shortDate` inchangé.

### Transition de page

`app/studio/(prive)/template.tsx` : fondu + montée + flou qui se dissipe (desktop), clé sur le chemin pour rejouer d’une fiche à l’autre.
CSS seulement, `backwards` (aucun transform ni filtre ne reste). Mouvement réduit : coupée.
