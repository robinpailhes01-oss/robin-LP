/**
 * Contenus du site Luma.
 * Voix : « je » pour le parcours et l’approche de Robin, « Luma » pour l’offre, « vous » pour le client.
 * Règle : aucun chiffre, témoignage, logo ou résultat qui ne soit réel et fourni par Robin.
 */

export const site = {
  title: "Luma · Des outils IA pour simplifier votre relation client, par Robin Pailhes",
  description:
    "Robin Pailhes, fondateur de Luma, aide les PME à améliorer et simplifier leur relation client grâce à des outils IA personnalisés.",
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
  title: "Une relation client plus simple, grâce à l’IA.",
  /** Mot ou groupe surligné dans le titre (un seul accent par page). */
  accent: "plus simple",
  text: "J’aide les PME à améliorer et simplifier leur relation client avec des outils IA personnalisés.",
  note: "Un seul interlocuteur, de la première discussion au suivi.",
};

/** Section « Besoins » : situations concrètes du dirigeant, chacune reliée à un usage précis. */
export const needs = {
  kicker: "Relation client",
  title: "Là où votre relation client se complique.",
  text: "L’IA n’est pas utile partout. Voici les moments où elle simplifie vraiment le contact avec vos clients, avec l’outil que Luma construit pour chacun.",
  labelNeed: "Votre situation",
  labelUse: "Ce que Luma met en place",
  items: [
    {
      title: "Les demandes clients",
      need: "Les mêmes questions reviennent chaque jour, sur WhatsApp, par email ou au téléphone, souvent quand vous êtes occupé ailleurs.",
      use: "Un agent répond aux questions courantes et vous transmet le reste.",
    },
    {
      title: "L’historique client",
      need: "Ce qu’un client vous a dit ou demandé est éparpillé entre emails, messages et fichiers.",
      use: "Tous les échanges d’un client, réunis au même endroit.",
    },
    {
      title: "Les devis et les rendez‑vous",
      need: "Préparer un devis, caler un rendez‑vous, envoyer une confirmation : des allers‑retours qui prennent du temps et retardent le client.",
      use: "Devis préparés, créneaux proposés, confirmations envoyées. Vous validez.",
    },
    {
      title: "Les relances",
      need: "Des devis restent sans réponse, des relances sont oubliées, un client attend sans nouvelles.",
      use: "Des relances programmées au bon moment.",
    },
    {
      title: "Vos outils",
      need: "Vous faites vous-même le lien entre la messagerie où vos clients écrivent, votre agenda, vos tableurs et votre CRM.",
      use: "Messagerie, agenda et CRM reliés entre eux.",
    },
  ],
};

/** Section « Démonstration » : un exemple de fonctionnement, présenté comme tel. */
export const demo = {
  kicker: "Exemple de fonctionnement",
  title: "Quand un client vous écrit.",
  text: "",
  label: "Exemple illustratif",
  steps: [
    { title: "Le client écrit", text: "Sur WhatsApp, par email ou depuis votre site, à n’importe quelle heure." },
    { title: "L’agent rassemble l’essentiel", text: "Il répond à ce qu’il sait, pose les questions utiles et s’arrête là où vos règles le prévoient." },
    { title: "La demande est enregistrée", text: "Elle arrive complète dans votre outil de suivi : CRM, tableur ou agenda." },
    { title: "Vous validez", text: "Vous recevez un résumé. Rien de sensible ne part sans votre accord." },
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
    "Entrepreneur, j’ai d’abord mis en place un agent WhatsApp dans ma propre entreprise, Harmonie Yacht : trois heures gagnées chaque jour.",
    "Avec Luma, je fais la même chose pour d’autres PME. Je suis votre seul interlocuteur, du premier échange au suivi.",
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
  guarantee: "Satisfait ou remboursé",
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
      { name: "J’apprends votre activité", text: "Vos réponses, votre ton, vos règles." },
      { name: "Je le connecte", text: "À votre numéro WhatsApp et à vos outils." },
      { name: "On teste, puis il répond", text: "Vous voyez tout et reprenez la main à tout moment." },
    ],
    guaranteeTitle: "Satisfait ou remboursé",
    guaranteeText: "Si l’agent ne vous convient pas, vous êtes remboursé. Conditions fixées ensemble avant tout engagement.",
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
  title: "Des résultats concrets.",
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
    { q: "Comment sont gérées les données ?", a: "Elles restent les vôtres. Je vous montre où elles passent avant la mise en place." },
  ],
};

export const contact = {
  kicker: "Contact",
  title: "Parlons de votre projet.",
  text: "Quelques questions rapides, et je reviens vers vous sous 24 h.",
  note: "Gratuit et sans engagement.",
};
