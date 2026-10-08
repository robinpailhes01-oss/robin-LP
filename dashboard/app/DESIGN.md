# Dashboard prospection : design

## Type de projet
Dashboard interne (« product mode », dense). Robin le consulte surtout sur iPhone : on conçoit d'abord pour 390 px.

## Direction
La rigueur typographique de Linear croisée avec un carnet de bord : les repères (dates, compteurs, en-têtes de colonnes) sont en mono et en petites capitales, comme les entrées d'un journal de navigation. La marque Luma est reprise telle quelle depuis le site : pas de nouvelle identité.

## Tokens (voir `app/globals.css`)
- **Couleurs** : `ink` #12102B (texte), `ink-2` #4B4F63, `muted` #6A6E83 (contraste ≥ 4,5:1 sur les deux fonds), `surface` #FFFFFF et `surface-2` #F7F8FC, `line` #E9EBF3, `accent` #4636F0, réservé au signal (taux, RDV, actions, onglet actif).
- **Variantes A/B** : `v1` #4636F0 et `v2` #D97706. La paire a été validée avec le script dataviz (contraste, daltonisme).
- **États** : `good` #166534 (RDV), `bad` #B42318 (refus). Toujours accompagnés d'un libellé, jamais la couleur seule.
- **Type** : Geist Sans (la police de la marque) + Geist Mono pour les données. Grands chiffres en chiffres proportionnels, colonnes en `tabular-nums`.
- **Espacement** : base 4 px. **Rayons** : 12 px pour les blocs, 8 px pour les champs et boutons, pilule pour les badges et le CTA. **Ombres** : aucune, uniquement des filets de 1 px.
- **Bandeau** : le chiffre héros vit sur le bandeau sombre du site (`band` #14162A, halo violet en dégradé radial), avec `accent-clair` #AAA5FF pour le violet lisible sur fond sombre.
- **Mouvement** : les barres de l'entonnoir et la réglette se remplissent une fois au chargement (transform seulement, coupé si « réduire les animations »). Rien d'autre ne bouge.

## Élément signature
Le **compteur de preuve** : sous chaque variante, une réglette de 20 crans (5 envois par cran) qui se remplit jusqu'à 100 envois, comme les relevés d'un carnet de bord. Le même langage de crans sert au score des leads (10 crans). Tant qu'elle n'est pas pleine, le verdict reste une « tendance ». Il rend visible la règle d'honnêteté statistique du brief.

## Un seul chiffre héros par écran
Sur la vue d'ensemble, c'est le taux de réponse, parce que c'est la métrique principale du brief.
