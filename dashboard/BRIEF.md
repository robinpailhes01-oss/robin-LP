# Brief : prospection Luma

Brief rédigé par Robin le 8 octobre 2026. Les décisions prises depuis sont en bas de page, à mettre à jour à chaque nouvelle décision.

## Contexte

Luma est une agence d'automatisation IA de la relation client. Preuve : Robin a automatisé la relation client de sa propre société de location de yachts. Offre : mise en place payée d'avance, puis facturation à l'usage.

Outils : Outscraper (leads), Resend (envoi, domaine déjà configuré).

Deux segments (champ `segment` sur chaque lead) :
- **B « montagne »** : indépendants des grosses stations (Alpe d'Huez, etc.) : hébergements, écoles de ski, loueurs, restos d'altitude. PREMIÈRE vague d'envoi, car la saison approche.
- **A « PME à l'année »** : Occitanie + Côte d'Azur, PME à environ 300 k€/an ou plus. On collecte, on n'envoie pas tant que Robin n'a pas dit go.

## Ordre imposé (ne sauter aucune étape)

- **Phase 1** : leads + mails prêts à envoyer. Pas de dashboard.
- **Phase 2** : seulement après le feu vert de Robin ET l'envoi du premier lot : dashboard v1.
- **Phase 3** (plus tard, on en reparlera) : rapports automatiques, agent « explorateur », agent manager conversationnel.

## Sous-agents (`.claude/agents/`, un fichier chacun, outils limités au strict nécessaire)

1. **lead-scout** : récupère les leads via l'API Outscraper, par segment, activité et station. Dédoublonne. Champs : nom, activité, segment, zone, site web, email, téléphone, adresse, nombre d'avis Google, source, date. Score de 0 à 10 avec justification. Il ne contacte personne.
2. **mail-writer** : rédige objets, corps et relances. Utilise UNIQUEMENT le skill cold-email (coreyhaines31/marketingskills), puis une relecture « humanizer ». Règles : français, tutoiement, ton parlé, court et direct, une seule promesse, une seule question, pas de prix dans le premier mail. Aucun fait inventé : toute phrase de personnalisation doit être vérifiable sur le site ou les avis du lead. Produit 2 variantes qui ne diffèrent que sur UNE variable, réparties au hasard 50/50 dans chaque segment.
3. **analyste** (Phase 3) : stats et rapports.
4. **explorateur** (Phase 3) : lecture seule. Il analyse tout (leads, mails, résultats) et donne un regard extérieur : ce que Robin pourrait essayer et auquel il n'a pas pensé. Il ne modifie ni code ni données, et n'envoie rien.

## Règles d'envoi

- Chaque mail : identité claire de l'expéditeur, lien de désinscription, liste de suppression respectée automatiquement.
- Démarrage progressif : une vingtaine de mails le premier jour.
- Pas de pixel d'ouverture par défaut. Métrique principale : les RÉPONSES. En v1, Robin marque le statut (répondu, rdv, refus) à la main.
- Aucun envoi réel sans la validation explicite de Robin, lot par lot. Dry-run par défaut.

## Dashboard (Phase 2)

- Vue d'ensemble : leads, contactés, réponses, taux de réponse, par segment et par variante.
- Onglet Leads : une fiche par lead (emails, téléphone, site web, historique, notes, statut), enrichissable plus tard. Filtres par segment, domaine, zone, statut.
- Design premium et sobre, aux couleurs de Luma. Pas de rendu « template ».

## Rapports (Phase 3)

Hebdo : ce qui a marché, ce qui n'a pas marché, quel segment répond le plus. Honnêteté statistique : en dessous d'environ 100 envois par variante, parler de « tendance », jamais de « preuve ». L'analyste peut PROPOSER des modifications de prompt ou de ciblage, mais ne les applique qu'après validation de Robin.

---

## Décisions

### 8 octobre 2026

- **Organisation** : tout est dans `dashboard/`, à côté du site, dans ce repo. `dashboard/prospection/` pour la Phase 1, `dashboard/app/` pour la Phase 2.
- **Branche** : `claude/gallant-faraday-si4ubd`, imposée par l'environnement cloud. Elle pourra être renommée `feature/prospection` au moment de la fusion.
- **Où ça tourne** : Robin utilise uniquement Claude Code en version web, rien sur son ordinateur. SQLite local est donc impossible. Stockage à décider (Supabase recommandé).
- **Domaine d'envoi** : `robinpailhes.fr`, sans tiret, choisi parce qu'il fait humain. Il est vérifié dans Resend. Robin veut recevoir les réponses sur ce domaine, mais au 8 octobre il n'a aucune boîte mail (pas d'enregistrement MX) : il faut en créer une avant le premier envoi.
- **Segment B** : les indépendants qui prennent des réservations (restaurants, spas, hôtels, gîtes, chambres d'hôtes) et les écoles de ski indépendantes. Exclus : ESF, ESI et chaînes. Premier lot : Alpe d'Huez seulement.
- **Outscraper** : budget pas encore fixé. Plafond de résultats par recherche, coût estimé montré avant chaque lancement.
- **Relecture** : `blader/humanizer` (« gohuman » introuvable). Le montrer à Robin avant de l'installer, comme le skill cold-email.
- **Objets** : Robin veut des objets plus captivants et en tester beaucoup. Proposition : deux objets à la fois, jugés sur les réponses, puisqu'il n'y a pas de pixel. En attente de sa réponse.
- **Désinscription** : un lien qui ouvre un mail « STOP » vers Robin. L'adresse part ensuite dans la liste de suppression.
- **Relance** : une seule, à J+3.
- **Segment A** : proposition de ne pas collecter avant l'envoi du premier lot B, pour ne pas dépenser de crédits Outscraper sans envoyer. Pas encore de réponse de Robin.
- **Stockage** : Supabase, validé par Robin. Il pense avoir un projet « Luma », mais le compte connecté ne contient que `harmonie-yacht`. On ne met pas la prospection dans la base de sa société de yachts.
- **Boîte mail** : Robin dit avoir une adresse sur robinpailhes.fr. Le domaine n'a pourtant aucun enregistrement MX : à vérifier avec un mail de test.
- **Mémoire entre les sessions** : `dashboard/ETAT.md` est chargé automatiquement par le CLAUDE.md racine et mis à jour à chaque étape.
