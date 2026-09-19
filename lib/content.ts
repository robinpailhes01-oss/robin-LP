/**
 * Copy du site, reprise de la maquette du 19 septembre 2026.
 * Ce qui n’est pas sur la maquette (méthode, FAQ, CTA final) est écrit dans le même ton.
 * Les logos et les témoignages sont des emplacements : rien n’est inventé tant que Robin ne les fournit pas.
 */

export const nav = [
  { label: "Solutions", href: "/#expertise" },
  { label: "Notre méthode", href: "/#methode" },
  { label: "Cas clients", href: "/#cas-clients" },
  { label: "FAQ", href: "/#faq" },
];

export const cta = {
  primary: "Demander un audit gratuit",
  video: "Voir la vidéo",
  videoDuration: "(2 min)",
  method: "Découvrir notre méthode",
};

export const hero = {
  kicker: "Des agents IA pour les entreprises",
  titleA: "Moins de tâches.",
  titleB: "Plus",
  titleC: "d’impact.",
  text: "Automatisez vos processus avec des agents IA sur-mesure et libérez du temps pour ce qui compte vraiment : la croissance.",
  trust: ["Réponse sous 24h", "Sans engagement", "100% sur-mesure"],
};

export const logos = {
  kicker: "Ils nous font déjà confiance",
  /** À remplir avec les vrais logos clients (nom + fichier SVG dans public/logos). Vide = emplacements neutres. */
  items: [] as { name: string; src: string }[],
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
  sector: string;
  summary: string;
  result: { value: string; unit: string; label: string };
  videoUrl: string;
  need: string;
  built: { title: string; text: string }[];
  outcomes: string[];
};

export const caseStudies = {
  pill: "Cas clients",
  title: "Ce qu’on a construit, et ce que ça a changé.",
  text: "Des systèmes déployés chez de vraies entreprises, avec un résultat mesuré. Cliquez pour voir les détails.",
  cta: "Voir l’étude de cas",
  back: "Tous les cas clients",
  videoPending: "La vidéo de ce cas client arrive bientôt.",
  items: [
    {
      slug: "harmonie-yacht",
      client: "Harmonie Yacht",
      sector: "Location de yachts",
      summary: "Un tableau de bord de pilotage et un agent WhatsApp qui répond à toutes les demandes.",
      result: { value: "3 h", unit: "par jour", label: "gagnées sur le traitement des demandes" },
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
