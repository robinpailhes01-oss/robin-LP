/**
 * Copy du site, reprise de LUMA-BRAND-UX-INSTRUCTIONS.md.
 * Les textes marqués "premier jet" sont à valider (voir BRIEF.md, questions ouvertes).
 */

export const nav = [
  { label: "Solutions", href: "#infrastructure" },
  { label: "Cas d’usage", href: "#cas-usage" },
  { label: "Méthode", href: "#methode" },
  { label: "À propos", href: "#a-propos" },
  { label: "FAQ", href: "#faq" },
];

export const cta = {
  primary: "Parler de mon entreprise",
  discover: "Découvrir ce qu’on peut automatiser",
  demo: "Voir une démo",
};

export const hero = {
  title: "Vous n’avez rien eu à faire.",
  subtitle:
    "Luma construit des infrastructures IA sur mesure qui prennent en charge les tâches qui monopolisent votre entreprise.",
};

/** Conversation du hero. Réponses Luma et deuxième demande : premier jet à valider. */
export const heroConversation = {
  time: "22:47",
  client1: "Bonsoir, vous avez encore une disponibilité samedi ?",
  luma1: "Bonsoir. Oui, il reste un créneau samedi à 10h30. Je vous le réserve ?",
  client2: "Oui parfait. C’est pour un devis, on est une équipe de douze.",
  qualified: "Qualifié",
  action: "Rendez-vous créé · samedi 10:30",
  treated: "Traité par Luma",
};

export const problem = {
  title: "Votre entreprise vous sollicite trop.",
  conclusion: [
    "Individuellement, aucune de ces tâches n’est compliquée.",
    "Additionnées, elles prennent vos journées.",
  ],
  /** Sept sollicitations du fichier, chacune avec un exemple générique du quotidien. */
  items: [
    { kind: "Demande client", text: "« Vous êtes ouverts dimanche matin ? »" },
    { kind: "Devis", text: "« Vous pouvez me renvoyer le devis mis à jour ? »" },
    { kind: "Relance", text: "Trois devis envoyés, aucune réponse depuis six jours." },
    { kind: "Question", text: "« C’est possible de payer en plusieurs fois ? »" },
    { kind: "Rendez-vous", text: "« Je peux décaler à jeudi 15h ? »" },
    { kind: "Suivi", text: "Dossier en attente de retour depuis lundi." },
    { kind: "Tâche répétitive", text: "Ressaisir la commande dans le CRM." },
  ],
};

export const promise = {
  title: "Moins à gérer. Plus à construire.",
  text: "Luma prend en charge les tâches répétitives et les demandes qui monopolisent votre quotidien.",
};

export const flow = {
  title: "Comment Luma fonctionne",
  steps: ["Demande client", "Luma", "Réponse + qualification + CRM + rendez-vous"],
};

export const infrastructure = {
  title: "Pas un outil de plus. Une infrastructure pensée autour de votre entreprise.",
  items: ["vos outils", "vos process", "votre ton", "vos équipes", "vos données", "vos clients"],
  text: "Luma s’adapte à votre fonctionnement. Pas l’inverse.",
};

export const useCases = [
  { title: "Service client", text: "Répondre aux demandes récurrentes." },
  { title: "Qualification", text: "Identifier les prospects réellement intéressés." },
  { title: "Relance", text: "Recontacter automatiquement les demandes sans réponse." },
  { title: "Rendez-vous", text: "Proposer et enregistrer un créneau." },
  { title: "CRM", text: "Mettre à jour les informations automatiquement." },
  { title: "Process internes", text: "Faire circuler les informations sans intervention manuelle." },
];

export const proof = {
  title: "Une entreprise qui grandit ne devrait pas devenir plus lourde à gérer.",
  before: ["interruptions", "demandes oubliées", "réponses tardives", "tâches répétitives", "suivi manuel"],
  after: ["demandes traitées", "réponses immédiates", "informations centralisées", "suivi automatique", "plus d’espace mental"],
  /** Placeholders visibles : à remplacer par les résultats réels. Jamais de chiffre inventé. */
  metrics: [
    { value: "[XX] h", label: "récupérées par semaine" },
    { value: "[XX] %", label: "des demandes traitées sans intervention" },
    { value: "[XX]", label: "rendez-vous générés" },
  ],
  /** Vide pour l’instant : la rangée de logos est masquée tant qu’elle est vide. */
  logos: [] as { name: string; src: string }[],
};

export const method = {
  title: "On commence par comprendre votre entreprise. Pas par vous vendre un outil.",
  steps: [
    { name: "Comprendre", text: "Audit du fonctionnement actuel." },
    { name: "Identifier", text: "Repérer ce qui consomme du temps inutilement." },
    { name: "Construire", text: "Créer l’infrastructure personnalisée." },
    { name: "Optimiser", text: "Faire évoluer le système selon les besoins." },
  ],
};

export const forWho = {
  title: "Pour les entreprises qui ont déjà du volume, mais plus envie de tout gérer manuellement.",
  sectors: ["PME", "hôtellerie", "restauration", "salles de sport", "cabinets", "services", "entreprises locales", "réseaux", "équipes commerciales"],
};

/** Réponses : premier jet à valider, aucun chiffre ni engagement inventé. */
export const faq = [
  { q: "Est-ce que Luma remplace mon équipe ?", a: "Non. Luma prend en charge ce qui est répétitif pour que votre équipe se concentre sur ce qui demande vraiment quelqu’un." },
  { q: "Est-ce que l’agent parle comme nous ?", a: "Oui. Le ton, le vocabulaire et les réponses sont construits à partir de votre façon de parler à vos clients." },
  { q: "Peut-il être connecté à nos outils ?", a: "C’est le principe. Luma se branche sur les outils que vous utilisez déjà plutôt que d’en ajouter un." },
  { q: "Est-ce que tout est personnalisé ?", a: "Oui. Il n’y a pas de version standard : chaque infrastructure est construite autour de votre fonctionnement." },
  { q: "Peut-on commencer par un seul process ?", a: "Oui, et c’est souvent la meilleure façon de démarrer. On étend ensuite à ce qui a du sens." },
  { q: "Combien de temps faut-il pour mettre le système en place ?", a: "Cela dépend du périmètre. On vous donne une estimation précise après le premier échange." },
  { q: "Peut-on intervenir si nécessaire ?", a: "Oui. Vous gardez la main à tout moment et pouvez reprendre n’importe quelle conversation." },
  { q: "Comment sont gérées les données ?", a: "Vos données restent les vôtres. On détaille avec vous où elles transitent et ce qui est conservé." },
  { q: "Est-ce que cela fonctionne sur WhatsApp ?", a: "On en parle lors du premier échange, selon les canaux que vos clients utilisent réellement." },
  { q: "Est-ce que Luma peut évoluer avec l’entreprise ?", a: "Oui. Le système est conçu pour s’étendre à mesure que votre activité change." },
];

export const finalCta = {
  title: "Et si votre entreprise vous interrompait moins ?",
  text: "On identifie ensemble ce qui vous fait perdre du temps et ce qui pourrait fonctionner sans vous.",
};

export const contactQuestions = [
  { key: "sector", text: "Bonjour. Pour commencer, dans quel secteur est votre entreprise ?", placeholder: "Par exemple : hôtellerie, cabinet, services…" },
  { key: "pain", text: "Et qu’est-ce qui vous sollicite le plus au quotidien ?", placeholder: "Demandes clients, devis, relances…" },
  { key: "contact", text: "Merci. Sur quel email ou numéro peut-on vous répondre ?", placeholder: "Email ou téléphone" },
] as const;

export const contactDone = "Reçu. On revient vers vous sous 24 h.";
