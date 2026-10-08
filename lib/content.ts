/**
 * Contenus du site Luma.
 * Voix : « je » pour le parcours et l’approche de Robin, « Luma » pour l’offre, « vous » pour le client.
 * Règle : aucun chiffre, témoignage, logo ou résultat qui ne soit réel et fourni par Robin.
 */

export const site = {
  title: "Luma · Des outils IA pour simplifier votre relation client, par Robin Pailhes",
  description:
    "Robin Pailhes simplifie et automatise la relation client des PME avec des outils IA sur mesure. Audit gratuit en ligne : votre futur outil et vos gains, en 5 minutes.",
};

export const founder = {
  name: "Robin Pailhes",
  role: "Fondateur de Luma",
  signature: "Robin Pailhes — Fondateur de Luma",
  photos: {
    portrait: { src: "/images/robin-portrait.jpg", width: 800, height: 1000, alt: "Robin Pailhes, fondateur de Luma, souriant, en manteau bleu marine et écharpe camel" },
    buste: { src: "/images/robin-buste.jpg", width: 560, height: 700, alt: "Portrait de Robin Pailhes, fondateur de Luma" },
    avatar: { src: "/images/robin-avatar.jpg", width: 192, height: 192, alt: "Robin Pailhes" },
  },
};

/** Menu volontairement court : la page d’accueil est un parcours, pas un catalogue. */
export const nav = [
  { label: "Comment ça marche", href: "/#parcours" },
  { label: "Réalisations", href: "/cas-clients" },
  { label: "À propos", href: "/#a-propos" },
];

/** Pied de page : toutes les pages. */
export const footerNav = [
  { label: "Comment ça marche", href: "/#parcours" },
  { label: "Agent WhatsApp", href: "/agent-whatsapp" },
  { label: "Réalisations", href: "/cas-clients" },
  { label: "Méthode", href: "/methode" },
  { label: "À propos", href: "/#a-propos" },
];

export const cta = {
  /** Mène à la page /audit : la VSL, puis l’audit en ligne ou la réservation d’un appel. */
  primary: "Faire mon audit gratuit",
  primaryShort: "Audit gratuit",
  reassurance: "Gratuit · 5 minutes · Résultat immédiat",
  /** Second choix : réserver un appel (lien de rendez-vous, sinon l’assistant). */
  call: "Réserver un appel",
};

export const hero = {
  /** Titre en deux temps : le bénéfice, puis la réassurance. Un seul accent par page. */
  title: "Je simplifie et automatise votre relation client.",
  second: "Plus de temps. Moins de charges.",
  accent: "Moins de charges",
  badge: "Robin Pailhes · Agence IA à Montpellier",
  text: "J’ai d’abord mis l’IA dans ma propre entreprise, Harmonie Yacht. Je crée maintenant des outils IA sur mesure pour les PME qui veulent se libérer des tâches chronophages.",
  reassurance: ["Gratuit", "5 minutes", "Résultat immédiat"],
  flowKicker: "Une demande client",
  flow: ["Message reçu", "Besoin compris", "Fiche client à jour", "Devis ou RDV prêt"],
};

/** Garantie affichée sur le site. Conditions précises à écrire dans les CGV. */
export const guarantee = {
  short: "Satisfait ou remboursé pendant 7 jours",
  text: "Vous avez 7 jours après la mise en service pour tester votre outil. S’il ne vous convient pas, vous êtes remboursé.",
};

/**
 * VSL de l’accueil. Coller ici l’adresse YouTube, Vimeo ou d’un fichier .mp4.
 * Vide : la vidéo n’apparaît pas et le parcours animé d’une demande la remplace.
 */
/** Page /audit : la VSL, puis deux choix. `url` accepte YouTube, Vimeo ou un fichier .mp4 ; vide = image d’attente. */
export const vsl = {
  url: "/videos/vsl-luma.mp4",
  /** Image affichée avant la lecture d’un fichier .mp4. */
  poster: "/videos/vsl-luma-poster.jpg",
  meta: { title: "Audit gratuit", description: "La vidéo, puis votre audit gratuit : en ligne en 5 minutes, ou lors d’un appel." },
  kicker: "Audit gratuit",
  title: "Voyez ce que l’IA peut changer dans votre entreprise.",
  text: "Dans cette vidéo, je vous montre comment je simplifie la relation client des PME. Ensuite, à vous de choisir : l’audit en ligne, ou un appel avec moi.",
  soon: "La vidéo arrive bientôt",
  online: "Faire mon audit gratuit en ligne maintenant",
  onlineNote: "5 minutes · Résultat immédiat · Sans appel",
  call: "Réserver un appel",
  callNote: "Gratuit et sans engagement",
};

/**
 * Réservation d’un appel : lien de prise de rendez-vous (Calendly, Cal.com, Google Agenda…).
 * Vide = le bouton ouvre l’assistant, qui recueille un numéro pour être rappelé.
 */
export const booking = { url: "" };

export const trust = {
  kicker: "Déjà en place chez",
  stats: [
    { value: "3 h", label: "gagnées par jour · Harmonie Yacht" },
    { value: "3 à 4 h", label: "gagnées par jour · Énergies Concept" },
  ],
  own: "Mon entreprise",
  client: "Client",
};

/** Le constat : les demandes arrivent de partout et tout repose sur le dirigeant. Messages illustratifs. */
export const problem = {
  kicker: "Ce que ça vous coûte",
  title: "Vos journées partent dans des tâches répétitives.",
  second: "Et elles vous coûtent cher.",
  messages: [
    { icon: "WhatsApp", channel: "WhatsApp", text: "Bonsoir, une dispo samedi ?", time: "22:47" },
    { icon: "Gmail", channel: "Email", text: "Demande de devis pour la semaine prochaine", time: "09:12" },
    { icon: "phone", channel: "Téléphone", text: "Appel manqué, à rappeler", time: "12:30" },
    { icon: "instagram", channel: "Instagram", text: "C’est combien ?", time: "18:05" },
    { icon: "site", channel: "Site web", text: "Nouveau formulaire reçu", time: "20:16" },
  ],
  you: "Vous",
  pending: "5 en attente",
  note: "Messages d’exemple",
  caption: "Répondre aux mêmes questions, ressaisir, relancer, préparer des devis : autant d’heures payées qui ne font pas grandir votre entreprise.",
  alt: "Schéma : des messages arrivent en même temps par WhatsApp, email, téléphone, Instagram et le site, et convergent tous vers le dirigeant. Cinq demandes en attente.",
};

/** Le système : un outil Luma au centre, relié aux canaux, au contexte et aux outils du client. */
export const system = {
  kicker: "Ce que je construis",
  title: "Votre outil travaille.",
  second: "Vous validez.",
  text: "Un outil créé pour votre entreprise, relié à vos outils, qui prend en charge les tâches répétitives.",
  hub: "Votre outil",
  nodes: {
    you: { label: "Vous", caption: "Vous pilotez et validez", action: "Vous validez" },
    context: { label: "Votre contexte", caption: "Offres, tarifs, règles" },
    agent: { label: "L’agent IA", caption: "Répond, pose les questions, relance" },
    channels: { label: "Vos canaux", caption: "WhatsApp, email, site" },
    tools: { label: "Vos outils", caption: "Agenda, fichier clients, devis" },
  },
  tools: ["Agenda", "CRM", "Devis", "Paiement", "Tableur", "Mail"],
  toasts: ["Devis préparé · à valider", "Relance envoyée", "RDV confirmé samedi 10 h 30"],
  alt: "Schéma : au centre, votre outil Luma. Il est relié à vos canaux (WhatsApp, email, site), à votre contexte (offres, tarifs, règles), à vos outils (agenda, fichier clients, devis) et à un agent IA qui répond, pose les questions et relance. Au sommet, vous pilotez et validez.",
};

/** Trois points de départ, chacun appuyé sur une réalisation réelle. */
/** Le pivot de la page : texte révélé mot à mot au défilement. Les mots marqués * sont appuyés. */
export const manifesto = {
  text: "Vous savez que l’IA peut vous faire gagner du temps et de l’argent. Mais vous n’avez ni le temps, ni les compétences pour vous en occuper. C’est là que j’interviens : je crée *vos *outils *IA.",
};

/** Le parcours en trois étapes : une seule à faire aujourd’hui, la démo gratuite. */
export const steps = {
  kicker: "Comment ça marche",
  title: "Trois étapes.",
  second: "Une seule à faire aujourd’hui.",
  items: [
    {
      label: "Gratuit · 5 min",
      title: "Votre audit gratuit",
      text: "Répondez à quelques questions : vous voyez aussitôt à quoi ressemblerait votre outil IA, et le temps et les charges qu’il vous ferait économiser.",
      points: ["5 minutes en ligne, ou un appel si vous préférez", "Votre futur outil, adapté à vos réponses", "Une estimation de vos gains"],
    },
    {
      label: "Sur mesure",
      title: "Je crée votre outil",
      text: "Clé en main, ou construit avec vous : à vous de choisir.",
      options: [
        { name: "Clé en main", text: "Je conçois votre infrastructure IA, je la relie à vos outils et je vous accompagne." },
        { name: "Avec vous", text: "Consulting et formation : on crée vos outils ensemble, votre équipe devient autonome." },
      ],
    },
    {
      label: "Résultat",
      title: "Vous gagnez du temps",
      text: "L’outil prend en charge les tâches répétitives. Je suis les résultats et j’ajuste. Vous vous concentrez sur la croissance de votre entreprise.",
      points: ["Moins de tâches répétitives", "Moins de charges", "Satisfait ou remboursé pendant 7 jours"],
    },
  ] as { label: string; title: string; text: string; points?: string[]; options?: { name: string; text: string }[] }[],
};

/** Section « À propos ». Uniquement des faits confirmés. */
export const about = {
  kicker: "À propos",
  title: "Je suis Robin Pailhes, fondateur de Luma.",
  paragraphs: [
    "Entrepreneur, j’ai d’abord mis l’IA dans ma propre entreprise, Harmonie Yacht : un agent WhatsApp qui répond aux clients et un tableau de bord pour tout suivre.",
    "Avec Luma, je fais la même chose pour d’autres PME : conseil, outils sur mesure, formation. Je suis votre seul interlocuteur, du premier échange au suivi.",
  ],
  points: [
    { title: "Un seul interlocuteur", text: "Vous parlez à la personne qui conçoit et met en place." },
    { title: "Outils personnalisés", text: "Chaque outil part de vos clients, de vos outils et de vos règles." },
    { title: "Vous gardez la main", text: "Vous validez ce qui part, et pouvez reprendre à tout moment." },
  ],
};

/** Accompagnement en quatre étapes, repris sur /methode. */
export const method = {
  kicker: "Accompagnement",
  title: "Comment je vous accompagne.",
  text: "",
  steps: [
    { name: "Compréhension", text: "Votre activité, vos clients, vos outils." },
    { name: "Conception", text: "Une solution précise, validée par vous." },
    { name: "Mise en place", text: "Testée sur vos cas réels avant le lancement." },
    { name: "Suivi", text: "J’ajuste selon les résultats." },
  ],
};

export const methodPage = {
  title: "Ma méthode",
  text: "Comprendre votre entreprise d’abord, l’outil ensuite.",
  principlesTitle: "Ce à quoi je tiens",
  principles: [
    { title: "Commencer petit", text: "Un premier usage bien choisi, qui fonctionne, plutôt qu’un grand projet qui s’éternise." },
    { title: "Préparer et contrôler", text: "Un agent ne fonctionne bien qu’avec de bonnes informations et des règles claires. On les écrit ensemble." },
    { title: "Rester transparent", text: "Vous savez ce que fait l’outil, où passent vos données et ce qui vous est transmis." },
  ],
};

/** Agent WhatsApp : aperçu sur l’accueil, page complète sur /agent-whatsapp. */
export const whatsapp = {
  guarantee: "Satisfait ou remboursé pendant 7 jours",
  page: {
    kicker: "Agent WhatsApp",
    title: "Un agent qui répond à vos clients sur WhatsApp.",
    text: "L’agent Luma répond à vos clients avec vos informations et votre ton, et vous transmet ce qui demande votre attention.",
    note: "Fonctionne avec votre numéro WhatsApp professionnel actuel.",
    videoKicker: "Vidéo",
    videoTitle: "Comment l’agent WhatsApp m’a libéré trois heures par jour",
    videoText: "Ce que l’agent a changé dans ma propre entreprise, Harmonie Yacht.",
    videoUrl: "",
    doTitle: "Ce qu’il prend en charge",
    doText: "",
    doItems: [
      { title: "Répondre aux questions", text: "Horaires, tarifs, conditions, accès." },
      { title: "Donner vos disponibilités", text: "Les créneaux réellement libres." },
      { title: "Préparer un devis", text: "Vous validez avant l’envoi." },
      { title: "Prendre un rendez‑vous", text: "Bloqué dans votre agenda, confirmé." },
      { title: "Relancer", text: "Au bon moment, avec vos mots." },
      { title: "Passer la main", text: "Dès qu’une demande sort du cadre." },
    ],
    examplesKicker: "Exemples",
    examplesTitle: "À quoi ressemblent les échanges.",
    examplesText: "Exemples illustratifs, pas des conversations de clients.",
    examples: [
      {
        title: "Une disponibilité",
        sector: "Exemple · location de bateaux",
        time: "22:47",
        messages: [
          { from: "client", text: "Bonsoir, vous avez encore une disponibilité samedi pour 6 personnes ?" },
          { from: "agent", text: "Bonsoir ! Oui, il reste un créneau samedi à 10h30 sur le bateau 8 places. Je vous le réserve ?" },
          { from: "client", text: "Oui parfait." },
          { from: "agent", text: "C’est noté. Vous recevez la confirmation par email dans quelques minutes." },
        ],
        action: "Créneau bloqué dans l’agenda · confirmation envoyée",
      },
      {
        title: "Un devis",
        sector: "Exemple · artisan peintre",
        time: "09:12",
        messages: [
          { from: "client", text: "Bonjour, combien pour repeindre un salon de 25 m² ?" },
          { from: "agent", text: "Bonjour ! Pour vous répondre précisément : murs seuls ou murs et plafond ? Et la peinture est-elle à fournir ?" },
          { from: "client", text: "Murs et plafond, peinture fournie par vous." },
          { from: "agent", text: "Merci. Je transmets votre demande, vous recevez un devis d’ici ce soir." },
        ],
        action: "Besoin compris · devis à valider par le dirigeant",
      },
      {
        title: "Un rendez-vous",
        sector: "Exemple · salon de coiffure",
        time: "18:30",
        messages: [
          { from: "client", text: "Je peux avoir un rdv coupe + barbe jeudi ?" },
          { from: "agent", text: "Bien sûr. Jeudi il reste 11h15 et 16h45. Lequel vous convient ?" },
          { from: "client", text: "16h45" },
          { from: "agent", text: "Noté pour jeudi 16h45, coupe et barbe. Vous recevez un rappel la veille." },
        ],
        action: "Rendez-vous créé · rappel programmé",
      },
      {
        title: "Une demande hors cadre",
        sector: "Exemple · cabinet",
        time: "14:05",
        messages: [
          { from: "client", text: "J’ai un litige avec mon propriétaire, vous pouvez me dire ce que je dois faire ?" },
          { from: "agent", text: "Je comprends. Cette question demande l’avis de quelqu’un du cabinet, je ne vais pas y répondre à sa place. Je transmets votre message pour qu’on vous rappelle." },
          { from: "client", text: "Merci." },
        ],
        action: "Demande transmise · rappel par un membre du cabinet",
      },
    ] as { title: string; sector: string; time: string; messages: { from: "client" | "agent"; text: string }[]; action: string }[],
    howTitle: "Comment se passe la mise en place",
    howSteps: [
      { name: "J’apprends votre activité", text: "Vos réponses, votre ton, vos règles." },
      { name: "Je le connecte", text: "À votre numéro WhatsApp et à vos outils." },
      { name: "On teste, puis il répond", text: "Vous voyez tout et reprenez la main à tout moment." },
    ],
    guaranteeTitle: "Satisfait ou remboursé pendant 7 jours",
    guaranteeText: "Vous avez 7 jours après la mise en service pour tester l’agent. S’il ne vous convient pas, vous êtes remboursé.",
    faqTitle: "Vos questions sur l’agent",
    faq: [
      { q: "Mes clients sauront-ils qu’ils parlent à un agent ?", a: "C’est vous qui décidez de la façon dont il se présente. Dans tous les cas, il répond avec votre ton et passe la main dès que nécessaire." },
      { q: "Et s’il ne sait pas répondre ?", a: "Il le dit simplement, vous prévient et n’invente pas de réponse. Ses limites sont définies avec vous avant la mise en service." },
      { q: "Faut-il changer de numéro WhatsApp ?", a: "Non. L’agent se branche sur votre numéro professionnel existant." },
      { q: "Combien de temps pour le mettre en place ?", a: "Cela dépend de votre activité et des outils à connecter. Je vous donne un calendrier précis après notre premier échange." },
    ],
  },
};

/** Page /cas-clients. */
export const casesIndex = {
  kicker: "Réalisations",
  title: "Des projets menés avec de vraies entreprises.",
  text: "Le point de départ, la solution, le résultat constaté.",
  read: "Voir la réalisation",
  need: "Le point de départ",
  built: "Ce qui a été construit",
  result: "Le résultat",
  tools: "Connecté à",
  quote: "Ce qu’en dit le client",
  nextCase: "Réalisation suivante",
  prevCase: "Réalisation précédente",
  back: "Toutes les réalisations",
};

/**
 * Réalisations. Chiffres et faits fournis par Robin, jamais inventés.
 * Chaque réalisation a sa page : /cas-clients/[slug]. `videoUrl` accepte YouTube, Vimeo ou un fichier .mp4 ;
 * vide = le bloc vidéo n’est pas affiché.
 */
export type CaseStudy = {
  slug: string;
  client: string;
  /** Initiales affichées quand aucun logo n’est fourni. */
  initials: string;
  /** Logo du client, affiché sur fond blanc. */
  logo?: string;
  sector: string;
  headline: string;
  description: string;
  summary: string;
  /** Un à trois chiffres réels. */
  stats: { value: string; label: string }[];
  videoUrl: string;
  /** Outils réellement connectés dans ce cas (noms des icônes de ToolIcons). */
  tools: string[];
  need: string;
  built: { title: string; text: string }[];
  outcomes: string[];
  /** Témoignage réel et autorisé uniquement (nom, fonction). Vide = le bloc n’est pas affiché. */
  testimonial?: { quote: string; author: string; role: string };
};

export const caseStudies = {
  kicker: "Réalisations",
  title: "Des outils déjà en service.",
  text: "Trois entreprises, trois besoins, trois outils sur mesure. Chaque réalisation a sa page : le point de départ, ce qui a été construit, le résultat.",
  all: "Voir toutes les réalisations",
  items: [
    {
      slug: "harmonie-yacht",
      client: "Harmonie Yacht",
      initials: "HY",
      logo: "/logos/harmonie-yacht.png",
      sector: "Location de yachts",
      headline: "Un agent WhatsApp et un tableau de bord de pilotage pour traiter les demandes.",
      description:
        "Harmonie Yacht, ma propre entreprise, recevait ses demandes en continu sur WhatsApp. Avec un agent qui y répond et un tableau de bord de pilotage, le traitement des demandes prend trois heures de moins chaque jour.",
      summary: "Un tableau de bord de pilotage et un agent WhatsApp qui répond aux demandes.",
      stats: [{ value: "3 h", label: "gagnées par jour sur le traitement des demandes" }],
      videoUrl: "",
      tools: ["WhatsApp"],
      need: "Les demandes clients arrivaient en continu sur WhatsApp et le suivi de l’activité prenait un temps qui n’était plus consacré aux clients eux-mêmes.",
      built: [
        { title: "Agent WhatsApp", text: "Un agent qui répond aux demandes entrantes, y compris hors horaires, avec le ton de l’entreprise, et transmet ce qui demande une décision." },
        { title: "Tableau de bord de pilotage", text: "Une vue unique pour suivre l’activité et prendre les décisions sans ressaisie." },
      ],
      outcomes: ["Trois heures gagnées chaque jour sur le traitement des demandes", "Des réponses rapides aux clients, y compris hors horaires", "Un suivi de l’activité lisible en un coup d’œil"],
    },
    {
      slug: "energies-concept",
      client: "Énergies Concept",
      initials: "EC",
      logo: "/logos/energies-concept.png",
      sector: "Énergie",
      headline: "Des bons de commande numériques pour vingt commerciaux et le secrétariat.",
      description:
        "Chez Énergies Concept, une vingtaine de commerciaux remplissaient leurs bons de commande à la main. Erreurs, temps perdu, et parfois des contrats non signés parce que non valides. Tout a été numérisé : l’équipe gagne 3 à 4 heures par jour et les dirigeants se concentrent sur l’essentiel.",
      summary: "Un outil qui numérise les bons de commande de vingt commerciaux et du secrétariat, sans ressaisie.",
      stats: [
        { value: "3 à 4 h", label: "gagnées par jour par l’équipe" },
        { value: "20", label: "commerciaux équipés, plus le secrétariat" },
      ],
      videoUrl: "",
      tools: [],
      need: "Les bons de commande étaient remplis à la main sur le terrain. Certains étaient incomplets ou mal remplis : l’équipe perdait du temps à les corriger, le secrétariat à les ressaisir, et des contrats restaient non signés parce qu’ils n’étaient pas valides.",
      built: [
        { title: "Bon de commande numérique", text: "Un formulaire guidé, utilisable sur le terrain, qui vérifie les champs et refuse un bon incomplet." },
        { title: "Circuit sans papier", text: "Le bon part du commercial au secrétariat sans ressaisie, et les dirigeants ont une vue d’ensemble sans contrôler chaque document." },
      ],
      outcomes: ["3 à 4 heures gagnées chaque jour par l’équipe", "Des bons de commande complets et valides, donc des contrats qui se signent", "Les dirigeants libérés de la vérification et de la ressaisie"],
    },
    {
      slug: "barber-saint-anne",
      client: "Barber Saint-Anne",
      initials: "BS",
      sector: "Coiffure et barbier",
      headline: "Un outil de réservation en ligne qui appartient au salon.",
      description:
        "Le salon voulait prendre ses réservations en ligne sans dépendre d’une grande plateforme. Il dispose maintenant de son propre outil : réservation en ligne, calendrier du salon, emails automatiques de confirmation et de rappel, pour un coût inférieur à celui des grandes plateformes.",
      summary: "Réservation en ligne, calendrier du salon et emails automatiques, pour moins cher que les grandes plateformes.",
      stats: [{ value: "24h/24", label: "réservations possibles, même salon fermé" }],
      videoUrl: "",
      tools: [],
      need: "Prendre les réservations en ligne, tenir le calendrier du salon et limiter les rendez-vous oubliés, sans passer par une plateforme dont le coût pèse sur une petite structure.",
      built: [
        { title: "Réservation en ligne", text: "Le client choisit sa prestation, son barbier et son créneau depuis son téléphone." },
        { title: "Calendrier du salon", text: "La vue de l’équipe, les créneaux disponibles et les blocages au même endroit." },
        { title: "Emails automatiques", text: "Confirmation immédiate et rappel avant le rendez-vous." },
      ],
      outcomes: ["Des réservations possibles à toute heure, même salon fermé", "Moins de rendez-vous oubliés grâce aux rappels", "Un outil qui appartient au salon, moins cher que les plateformes du marché"],
    },
  ] satisfies CaseStudy[],
};

export const faq = {
  kicker: "Questions fréquentes",
  title: "Vos questions.",
  items: [
    { q: "Est-ce qu’un agent IA remplace mon équipe ?", a: "Non. Il prend le répétitif, votre équipe garde ce qui demande quelqu’un." },
    { q: "Faut-il s’y connaître en IA ?", a: "Non. Vous connaissez vos clients, c’est ce qui compte. Je m’occupe du reste." },
    { q: "L’IA peut-elle se tromper ?", a: "Oui. Chaque outil est donc testé sur vos cas réels, avec des limites claires : ce qui est sensible vous est transmis." },
    { q: "En quoi consiste l’audit gratuit ?", a: "En ligne, en 5 minutes : quelques questions sur vos tâches et vos outils. Vous voyez aussitôt à quoi ressemblerait votre outil IA et une estimation du temps et de l’argent qu’il vous ferait gagner. Vous préférez en parler ? Réservez un appel. Gratuit et sans engagement." },
    { q: "Et si l’outil ne me convient pas ?", a: "Vous avez 7 jours après la mise en service pour le tester. S’il ne vous convient pas, vous êtes remboursé." },
    { q: "Peut-on construire l’outil avec vous ?", a: "Oui. En accompagnement, on le construit ensemble et je forme votre équipe pour qu’elle le fasse évoluer seule." },
    { q: "Comment sont gérées les données ?", a: "Elles restent les vôtres. Je vous montre où elles passent avant la mise en place." },
  ],
};

export const contact = {
  kicker: "Contact",
  title: "Votre audit gratuit.",
  text: "En ligne en 5 minutes, ou lors d’un appel si vous préférez : voyez à quoi ressemblerait votre outil IA et ce qu’il vous ferait gagner.",
  note: "Gratuit et sans engagement.",
};
