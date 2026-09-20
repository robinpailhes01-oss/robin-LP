/**
 * Copy du site, reprise de la maquette du 19 septembre 2026.
 * Ce qui n’est pas sur la maquette (méthode, FAQ, CTA final) est écrit dans le même ton.
 * Les logos et les témoignages sont des emplacements : rien n’est inventé tant que Robin ne les fournit pas.
 */

export const nav = [
  { label: "Solutions", href: "/#expertise" },
  { label: "Agent WhatsApp", href: "/agent-whatsapp" },
  { label: "Cas clients", href: "/cas-clients" },
  { label: "Notre méthode", href: "/methode" },
  { label: "FAQ", href: "/#faq" },
];

export const cta = {
  primary: "Demander un audit gratuit",
  video: "Voir la vidéo",
  videoDuration: "(2 min)",
  method: "Découvrir notre méthode",
};

export const hero = {
  kicker: "Automatisations et outils IA pour les PME",
  /** Lignes du titre ; `accent` est le mot mis en violet et souligné à la main. */
  lines: [
    { text: "Vos outils IA,", accent: "outils IA" },
    { text: "pour votre entreprise." },
  ],
  text: "On crée pour vous des automatisations et des outils IA qui vous font gagner du temps et économiser de l’argent. Pas besoin de connaître l’IA : on vous montre concrètement ce qu’elle peut faire chez vous.",
  trust: ["Réponse sous 24h", "Sans engagement", "100% sur-mesure"],
};

export const logos = {
  kicker: "Ils nous font déjà confiance",
  /** À remplir avec les vrais logos clients (nom + fichier SVG dans public/logos). Vide = emplacements neutres. */
  items: [] as { name: string; src: string }[],
};

/** Agent WhatsApp : spécialité Luma. Aperçu sur l’accueil, page complète sur /agent-whatsapp. */
export const whatsapp = {
  pill: "Notre spécialité",
  guarantee: "Satisfait ou remboursé",
  teaser: {
    title: "Un agent qui répond à vos clients sur WhatsApp. Jour et nuit.",
    text: "Questions, disponibilités, devis, rendez-vous : vos clients écrivent, l’agent répond immédiatement avec vos mots, et ne vous dérange que quand il le faut.",
    points: ["Répond en quelques secondes, 24h/24", "Qualifie et prend les rendez-vous", "Vous gardez la main à tout moment"],
    cta: "Découvrir l’agent WhatsApp",
  },
  page: {
    title: "Un agent qui répond à vos clients sur WhatsApp. Jour et nuit.",
    text: "Vos clients vous écrivent sur WhatsApp : une question, une disponibilité, un devis, un rendez-vous. L’agent Luma leur répond tout de suite, avec votre ton et vos règles, et vous transmet seulement ce qui demande vraiment votre attention.",
    videoKicker: "Vidéo",
    videoTitle: "Comment l’agent WhatsApp m’a libéré trois heures par jour",
    videoText: "Robin, fondateur de Luma, raconte ce que l’agent a changé dans sa propre entreprise, Harmonie Yacht.",
    videoUrl: "",
    doTitle: "Concrètement, il fait quoi ?",
    doItems: [
      { title: "Répondre aux questions", text: "Horaires, tarifs, conditions, accès : les questions qui reviennent chaque jour trouvent une réponse immédiate." },
      { title: "Donner vos disponibilités", text: "Il consulte votre agenda ou votre planning et répond avec les créneaux réellement libres." },
      { title: "Envoyer un tarif ou un devis", text: "Il pose les bonnes questions, puis envoie le tarif ou prépare le devis selon vos règles." },
      { title: "Prendre le rendez-vous", text: "Le client choisit, le créneau se bloque, la confirmation part. Sans aller-retour." },
      { title: "Relancer sans oublier", text: "Un devis sans réponse, une demande en attente : la relance part au bon moment." },
      { title: "Passer la main quand il faut", text: "Dès qu’une demande sort du cadre, il vous prévient et vous reprenez la conversation." },
    ],
    howTitle: "Comment ça se passe",
    howSteps: [
      { name: "On apprend votre activité", text: "Vos réponses habituelles, votre ton, vos règles, ce que l’agent peut dire et ne pas dire." },
      { name: "On le branche", text: "À votre numéro WhatsApp et à vos outils : agenda, CRM, devis, paiements." },
      { name: "Il répond, vous gardez la main", text: "Vous voyez toutes les conversations et pouvez en reprendre une à tout moment." },
    ],
    guaranteeTitle: "Satisfait ou remboursé",
    guaranteeText: "Si l’agent ne vous convient pas, on vous rembourse. Les conditions précises sont posées avec vous lors de l’audit, avant tout engagement.",
    faq: [
      { q: "Mes clients sauront-ils qu’ils parlent à un agent ?", a: "C’est vous qui décidez de la présentation. Dans tous les cas, il répond avec votre ton et passe la main dès que nécessaire." },
      { q: "Et s’il ne sait pas répondre ?", a: "Il le dit simplement, prévient un humain et n’invente jamais de réponse." },
      { q: "Faut-il changer de numéro WhatsApp ?", a: "Non. L’agent se branche sur votre numéro professionnel existant." },
      { q: "Combien de temps pour le mettre en place ?", a: "Cela dépend de votre activité. On vous donne un calendrier précis après l’audit." },
    ],
  },
};

/** Page /cas-clients : liste de tous les cas. */
export const casesIndex = {
  pill: "Cas clients",
  title: "Ce qu’on a construit, et ce que ça a changé.",
  text: "Chaque cas détaille le besoin, ce qu’on a mis en place et le résultat mesuré. La liste s’allonge au fil des projets.",
};

/** Page /methode. */
export const methodPage = {
  title: "Notre méthode",
  text: "On commence par comprendre votre entreprise, pas par vous vendre un outil. Voici comment on travaille, de l’audit au pilotage.",
};

/** Section « connecté à vos outils » : la mascotte au centre, les outils qui se relient au scroll. */
export const connect = {
  title: "Un agent connecté aux outils que vous utilisez déjà.",
  annotation: "Il se connecte à vos outils",
  notification: { title: "Nouveau message client !", text: "Bonjour, j’aimerais un devis…", time: "Maintenant" },
  tools: ["Notion", "WhatsApp", "HubSpot", "Google Calendar", "Airbnb", "Gmail", "Stripe"] as const,
};

export const expertise = {
  pill: "Notre expertise",
  titleA: "Un agent IA qui",
  titleB: "s’adapte",
  titleC: "à vos besoins.",
  text: "Nous concevons, déployons et pilotons des agents IA qui s’intègrent à vos outils pour automatiser vos tâches et améliorer vos performances.",
  cards: [
    { icon: "bolt", title: "Automatiser", text: "Vos tâches répétitives en toute fiabilité." },
    { icon: "users", title: "Optimiser", text: "Vos processus et gagner en efficacité." },
    { icon: "chart", title: "Piloter", text: "Des résultats concrets et mesurables." },
    { icon: "clock", title: "Libérer", text: "Du temps pour ce qui crée de la valeur." },
  ] as const,
};

export const partner = {
  pill: "Un accompagnement de A à Z",
  title: "Bien plus qu’un outil, un véritable partenaire.",
  text: "De l’audit à la mise en production, nous vous accompagnons à chaque étape pour garantir un déploiement réussi et des résultats durables.",
};

/**
 * Études de cas. Chiffres et faits fournis par Robin, jamais inventés.
 * Chaque étude a sa page : /cas-clients/[slug]. `videoUrl` accepte YouTube, Vimeo ou un fichier .mp4 ;
 * vide = emplacement « vidéo à venir ».
 */
export type CaseStudy = {
  slug: string;
  client: string;
  /** Initiales affichées dans le badge et l’avatar de l’agent. */
  initials: string;
  sector: string;
  headline: string;
  description: string;
  summary: string;
  /** Un à trois chiffres réels. Le bandeau s’adapte au nombre fourni. */
  stats: { value: string; label: string }[];
  /** Ce que l’agent sait faire, affiché en bulles flottantes autour du téléphone. */
  chips: string[];
  greeting: string;
  videoUrl: string;
  need: string;
  built: { title: string; text: string }[];
  outcomes: string[];
};

export const caseStudies = {
  pill: "Étude de cas",
  cta: "Voir l’étude de cas complète",
  ctaShort: "Voir l’étude de cas",
  back: "Tous les cas clients",
  annotation: "Des résultats concrets.",
  videoPending: "La vidéo de ce cas client arrive bientôt.",
  items: [
    {
      slug: "harmonie-yacht",
      client: "Harmonie Yacht",
      initials: "HY",
      sector: "Location de yachts",
      headline: "Comment Harmonie Yacht a gagné un temps précieux avec Luma.",
      description:
        "Harmonie Yacht recevait ses demandes en continu sur WhatsApp. En déployant un agent IA qui y répond et un tableau de bord de pilotage, l’équipe a gagné trois heures par jour.",
      summary: "Un tableau de bord de pilotage et un agent WhatsApp qui répond à toutes les demandes.",
      stats: [{ value: "3 h", label: "gagnées par jour sur les demandes" }],
      chips: ["Demande de disponibilité", "Envoi du tarif", "Prendre un rendez-vous"],
      greeting: "Bonjour ! Je suis l’assistant Harmonie Yacht. Comment puis-je vous aider ?",
      videoUrl: "",
      need: "Les demandes clients arrivaient en continu sur WhatsApp et le suivi de l’activité prenait un temps que l’équipe ne pouvait plus consacrer aux clients eux-mêmes.",
      built: [
        { title: "Agent WhatsApp", text: "Un agent qui répond à toutes les demandes entrantes, à toute heure, avec le ton de l’entreprise." },
        { title: "Tableau de bord de pilotage", text: "Une vue unique pour suivre l’activité et prendre les décisions sans ressaisie." },
      ],
      outcomes: ["3 heures gagnées chaque jour sur le traitement des demandes", "Des réponses immédiates aux clients, y compris hors horaires", "Un pilotage de l’activité lisible en un coup d’œil"],
    },
  ] satisfies CaseStudy[],
};

export const testimonials = {
  kicker: "Témoignages",
  title: "Ils en parlent mieux que nous.",
  /** Emplacements : à remplacer par de vrais témoignages. */
  items: [] as { quote: string; name: string; role: string }[],
};

export const method = {
  pill: "Notre méthode",
  title: "Un déploiement en quatre étapes.",
  text: "Une méthode simple, éprouvée sur le terrain, pour passer de l’idée à un agent en production sans immobiliser vos équipes.",
  steps: [
    { name: "Audit", text: "On cartographie vos process et on identifie ce qui vous coûte le plus de temps." },
    { name: "Conception", text: "On dessine l’agent, ses règles, son ton et ses connexions à vos outils." },
    { name: "Déploiement", text: "On met en production progressivement, avec vos équipes, sans rupture." },
    { name: "Pilotage", text: "On suit les résultats et on fait évoluer l’agent au rythme de votre activité." },
  ],
};

export const faq = {
  kicker: "FAQ",
  title: "Les questions qu’on nous pose souvent.",
  items: [
    { q: "Est-ce qu’un agent IA remplace mon équipe ?", a: "Non. Il prend en charge ce qui est répétitif pour que votre équipe se concentre sur ce qui demande vraiment quelqu’un." },
    { q: "Est-ce que l’agent parle comme nous ?", a: "Oui. Le ton, le vocabulaire et les réponses sont construits à partir de votre façon de parler à vos clients." },
    { q: "Peut-il être connecté à nos outils ?", a: "C’est le principe. L’agent se branche sur les outils que vous utilisez déjà plutôt que d’en ajouter un." },
    { q: "Peut-on commencer par un seul process ?", a: "Oui, et c’est souvent la meilleure façon de démarrer. On étend ensuite à ce qui a du sens." },
    { q: "Combien de temps faut-il pour mettre l’agent en place ?", a: "Cela dépend du périmètre. On vous donne une estimation précise après l’audit." },
    { q: "Comment sont gérées les données ?", a: "Vos données restent les vôtres. On détaille avec vous où elles transitent et ce qui est conservé." },
  ],
};

export const finalCta = {
  title: "Prêt à libérer du temps dans votre entreprise ?",
  text: "Un audit gratuit de 30 minutes pour identifier ce qui peut être automatisé chez vous, sans engagement.",
};

export const contactQuestions = [
  { key: "sector", text: "Bonjour. Pour préparer votre audit, dans quel secteur est votre entreprise ?", placeholder: "Par exemple : hôtellerie, cabinet, services…" },
  { key: "pain", text: "Et quelles tâches vous prennent le plus de temps au quotidien ?", placeholder: "Demandes clients, devis, relances…" },
  { key: "contact", text: "Merci. Sur quel email ou numéro peut-on vous répondre ?", placeholder: "Email ou téléphone" },
] as const;

export const contactDone = "Reçu. On revient vers vous sous 24 h pour planifier l’audit.";
