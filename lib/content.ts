/**
 * Contenus du site Luma.
 * Voix : « je » pour le parcours et l’approche de Robin, « Luma » pour l’offre, « vous » pour le client.
 * Règle : aucun chiffre, témoignage, logo ou résultat qui ne soit réel et fourni par Robin.
 */

export const site = {
  title: "Luma · Agents IA et automatisations, par Robin Pailhes",
  description:
    "Robin Pailhes, fondateur de Luma, accompagne les entreprises pour automatiser leurs tâches répétitives, mieux traiter leurs demandes clients et connecter leurs outils.",
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

export const nav = [
  { label: "Solutions", href: "/#besoins" },
  { label: "Agent WhatsApp", href: "/agent-whatsapp" },
  { label: "Réalisations", href: "/cas-clients" },
  { label: "Méthode", href: "/methode" },
  { label: "À propos", href: "/#a-propos" },
];

export const cta = {
  /** Ouvre le panneau de contact (questions courtes pour préparer l’échange). */
  primary: "Échanger sur mon projet",
  primaryShort: "Échanger",
  /** Fait défiler jusqu’à la démonstration. */
  example: "Voir un exemple concret",
};

export const hero = {
  title: "Des agents IA utiles à votre entreprise.",
  text: "Je vous accompagne pour automatiser vos tâches répétitives, mieux traiter vos demandes clients et connecter vos outils.",
  note: "Un seul interlocuteur, de la première discussion au suivi.",
};

/** Section « Besoins » : situations concrètes du dirigeant, chacune reliée à un usage précis. */
export const needs = {
  kicker: "Solutions",
  title: "Vous reconnaissez une de ces situations ?",
  text: "L’IA n’est pas utile partout. Voici les cas où elle vous fait vraiment gagner du temps, avec ce que Luma met en place pour chacun.",
  labelNeed: "Votre situation",
  labelUse: "Ce que Luma met en place",
  items: [
    {
      title: "Les demandes clients",
      need: "Les mêmes questions reviennent chaque jour, sur WhatsApp, par email ou au téléphone, souvent quand vous êtes occupé ailleurs.",
      use: "Un agent qui répond aux questions courantes à partir de vos informations, et vous transmet tout ce qui demande votre avis.",
    },
    {
      title: "Les informations dispersées",
      need: "Ce qu’il faut savoir sur un client ou un dossier est éparpillé entre emails, fichiers et messages.",
      use: "Un outil qui rassemble les demandes et les données au même endroit, retrouvables en quelques secondes.",
    },
    {
      title: "Les tâches répétitives",
      need: "Ressaisies, copier-coller, documents remplis à la main puis corrigés.",
      use: "Des automatisations qui remplissent, vérifient et transmettent les documents, avec des contrôles avant envoi.",
    },
    {
      title: "Le suivi commercial",
      need: "Des devis restent sans réponse, des relances sont oubliées, l’historique d’un client se perd.",
      use: "Un suivi qui programme les relances au bon moment et garde la trace de chaque échange.",
    },
    {
      title: "Les outils qui ne se parlent pas",
      need: "Vous faites vous-même le lien entre votre messagerie, votre agenda, vos tableurs et votre CRM.",
      use: "Des connexions entre ces outils, pour qu’une information saisie une fois arrive partout où elle sert.",
    },
  ],
};

/** Section « Démonstration » : un exemple de fonctionnement, présenté comme tel. */
export const demo = {
  kicker: "Exemple de fonctionnement",
  title: "Ce qui se passe quand un client vous écrit.",
  text: "Voici, étape par étape, comment un agent traite une demande. L’exemple est illustratif : chaque agent est construit avec vos informations, vos règles et vos outils.",
  label: "Exemple illustratif",
  steps: [
    { title: "Le client écrit", text: "Sur WhatsApp, par email ou depuis votre site, à n’importe quelle heure." },
    { title: "L’agent rassemble les informations", text: "Il répond à ce qu’il sait, pose les questions utiles et s’arrête là où vos règles le prévoient." },
    { title: "La demande est enregistrée", text: "Elle arrive complète dans votre outil de suivi : CRM, tableur ou agenda." },
    { title: "Vous êtes prévenu et vous validez", text: "Vous recevez un résumé. Rien de sensible ne part sans votre accord." },
  ],
  conversation: {
    title: "Demande de devis",
    sector: "Exemple · entreprise de services",
    time: "21:14",
    messages: [
      { from: "client", text: "Bonsoir, vous faites l’entretien de jardins ? J’ai environ 400 m²." },
      { from: "agent", text: "Bonsoir, oui. Pour préparer votre devis : c’est un entretien ponctuel ou régulier ? Et dans quelle ville ?" },
      { from: "client", text: "Régulier, une fois par mois, à Pessac." },
      { from: "agent", text: "Merci, c’est noté. Votre demande est transmise, vous recevez une proposition demain dans la journée." },
    ] as { from: "client" | "agent"; text: string }[],
    action: "Demande enregistrée · résumé envoyé au dirigeant",
  },
  record: {
    title: "Nouvelle demande",
    status: "À valider",
    fields: [
      { label: "Besoin", value: "Entretien de jardin, 400 m²" },
      { label: "Fréquence", value: "Mensuelle" },
      { label: "Ville", value: "Pessac" },
      { label: "Canal", value: "WhatsApp" },
    ],
    note: "Enregistrée dans votre outil de suivi",
  },
  link: "Voir l’agent WhatsApp en détail",
};

/** Section « À propos ». Uniquement des faits confirmés. */
export const about = {
  kicker: "À propos",
  title: "Je suis Robin Pailhes, fondateur de Luma.",
  paragraphs: [
    "Je suis entrepreneur. Dans ma propre entreprise, Harmonie Yacht, j’ai mis en place un agent WhatsApp et un tableau de bord de pilotage. Le traitement des demandes nous prend aujourd’hui trois heures de moins par jour.",
    "Luma est née de cette expérience. J’y conçois des agents IA et des automatisations pour des entreprises qui veulent gagner du temps sans changer leur façon de travailler.",
    "Je suis votre interlocuteur du premier échange au suivi. Je prends le temps de comprendre votre activité avant de proposer quoi que ce soit.",
  ],
  points: [
    { title: "Un seul interlocuteur", text: "Vous parlez à la personne qui conçoit et met en place." },
    { title: "Sur mesure", text: "Construit à partir de vos outils et de vos règles." },
    { title: "Vous gardez la main", text: "Vous validez ce qui part, et pouvez reprendre à tout moment." },
  ],
};

/** Accompagnement en quatre étapes, repris sur /methode. */
export const method = {
  kicker: "Accompagnement",
  title: "Comment je vous accompagne.",
  text: "Une démarche simple, en quatre temps. Vous savez à chaque étape ce qui est fait, et rien n’est mis en service sans avoir été testé avec vous.",
  steps: [
    { name: "Compréhension", text: "On échange sur votre activité, vos outils et ce qui vous prend du temps. On choisit ensemble par où commencer." },
    { name: "Conception", text: "Je vous propose une solution précise : ce que l’outil fait, ce qu’il ne fait pas, à quoi il se connecte. Vous validez avant toute mise en place." },
    { name: "Mise en place et tests", text: "Je construis, je teste sur vos cas réels, et on corrige ensemble avant la mise en service." },
    { name: "Suivi et ajustements", text: "Après le lancement, je suis les résultats avec vous et j’ajuste ce qui doit l’être." },
  ],
};

export const methodPage = {
  title: "Ma méthode",
  text: "Avant de parler d’outil, je cherche à comprendre votre entreprise. Voici comment se déroule un accompagnement, de la première discussion au suivi.",
  principlesTitle: "Ce à quoi je tiens",
  principles: [
    { title: "Commencer petit", text: "Un premier usage bien choisi, qui fonctionne, plutôt qu’un grand projet qui s’éternise." },
    { title: "Préparer et contrôler", text: "Un agent ne fonctionne bien qu’avec de bonnes informations et des règles claires. On les écrit ensemble." },
    { title: "Rester transparent", text: "Vous savez ce que fait l’outil, où passent vos données et ce qui vous est transmis." },
  ],
};

/** Agent WhatsApp : aperçu sur l’accueil, page complète sur /agent-whatsapp. */
export const whatsapp = {
  guarantee: "Satisfait ou remboursé",
  page: {
    kicker: "Agent WhatsApp",
    title: "Un agent qui répond à vos clients sur WhatsApp.",
    text: "Vos clients vous écrivent sur WhatsApp pour une question, une disponibilité, un devis ou un rendez‑vous. L’agent Luma leur répond avec vos informations et votre ton, et vous transmet ce qui demande votre attention.",
    note: "Fonctionne avec votre numéro WhatsApp professionnel actuel.",
    videoKicker: "Vidéo",
    videoTitle: "Comment l’agent WhatsApp m’a libéré trois heures par jour",
    videoText: "Ce que l’agent a changé dans ma propre entreprise, Harmonie Yacht.",
    videoUrl: "",
    doTitle: "Ce qu’il prend en charge",
    doText: "Vous choisissez ce que l’agent fait et ce qu’il vous laisse. Voici les usages les plus courants.",
    doItems: [
      { title: "Répondre aux questions", text: "Horaires, tarifs, conditions, accès : les questions qui reviennent chaque jour." },
      { title: "Donner vos disponibilités", text: "Il consulte votre agenda ou votre planning et propose les créneaux réellement libres." },
      { title: "Préparer un devis", text: "Il pose les bonnes questions et prépare la demande selon vos règles. Vous validez avant l’envoi." },
      { title: "Prendre un rendez-vous", text: "Le client choisit un créneau, il est bloqué dans votre agenda et la confirmation part." },
      { title: "Relancer au bon moment", text: "Un devis sans réponse ou une demande en attente : la relance est programmée." },
      { title: "Passer la main", text: "Dès qu’une demande sort du cadre, il vous prévient et vous reprenez la conversation." },
    ],
    examplesKicker: "Exemples",
    examplesTitle: "À quoi ressemblent les échanges.",
    examplesText: "Quatre situations types. Ce sont des exemples illustratifs, pas des conversations de clients : chaque agent reprend le ton et les règles de votre entreprise.",
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
        action: "Demande qualifiée · devis à valider par le dirigeant",
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
      { name: "J’apprends votre activité", text: "Vos réponses habituelles, votre ton, vos règles, ce que l’agent peut dire et ce qu’il doit vous laisser." },
      { name: "Je le connecte", text: "À votre numéro WhatsApp et, si besoin, à vos outils : agenda, CRM, devis." },
      { name: "On teste, puis il répond", text: "On vérifie ensemble sur des cas réels. Vous voyez toutes les conversations et pouvez en reprendre une à tout moment." },
    ],
    guaranteeTitle: "Satisfait ou remboursé",
    guaranteeText: "Si l’agent ne vous convient pas, vous êtes remboursé. Les conditions précises sont fixées avec vous lors de notre premier échange, avant tout engagement.",
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
  text: "Chaque réalisation détaille le point de départ, ce qui a été mis en place et ce qui a changé. Les résultats sont ceux constatés par les entreprises.",
  read: "Lire la réalisation",
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
};

export const caseStudies = {
  kicker: "Réalisations",
  title: "Ce que j’ai mis en place, et ce que ça a changé.",
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
  title: "Les questions qu’on me pose souvent.",
  items: [
    { q: "Est-ce qu’un agent IA remplace mon équipe ?", a: "Non. Il prend en charge ce qui est répétitif pour que votre équipe se concentre sur ce qui demande vraiment quelqu’un." },
    { q: "Faut-il s’y connaître en IA ?", a: "Non. Vous connaissez votre entreprise, c’est ce qui compte. Je vous explique simplement ce que l’outil fait et comment l’utiliser." },
    { q: "L’IA peut-elle se tromper ?", a: "Oui, c’est possible. C’est pour cela que chaque outil est préparé avec vos informations, testé sur vos cas réels, et que ses limites sont fixées : ce qui est sensible vous est transmis." },
    { q: "Peut-il être connecté à nos outils ?", a: "C’est le principe. Je pars des outils que vous utilisez déjà plutôt que de vous en ajouter un." },
    { q: "Peut-on commencer par un seul usage ?", a: "Oui, et c’est souvent la meilleure façon de démarrer. On étend ensuite à ce qui a du sens." },
    { q: "Comment sont gérées les données ?", a: "Vos données restent les vôtres. Je vous détaille où elles transitent et ce qui est conservé, avant la mise en place." },
  ],
};

export const contact = {
  kicker: "Contact",
  title: "Parlons de votre projet.",
  text: "Répondez à quelques questions sur votre activité et ce qui vous prend du temps. Je lis chaque réponse et je reviens vers vous sous 24 h pour en discuter.",
  note: "Gratuit et sans engagement.",
};
