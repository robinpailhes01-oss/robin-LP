# app/ : le dashboard (Phase 2)

Ne rien construire ici avant deux conditions : le feu vert de Robin ET l'envoi du premier lot.

## Ce qui est prévu en v1

- Vue d'ensemble : leads, contactés, réponses et taux de réponse, par segment et par variante.
- Onglet Leads : une fiche par lead (emails, téléphone, site web, historique, notes, statut), enrichissable plus tard. Filtres par segment, domaine, zone et statut.
- Design premium et sobre aux couleurs de Luma, sans rendu « template ». La charte est dans `app/globals.css` à la racine du repo : violet `#4636F0`, navy `#12102B`, police Geist. Utiliser le skill premium-web-design.

## Ne pas toucher

- Le site, à la racine du repo.
- Les scripts de `../prospection/`. Le dashboard lit les données ; il n'écrit que les statuts et les notes.
