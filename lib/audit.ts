/**
 * Questions avant l’échange, posées par l’assistant de Robin : 5 questions à choix rapides, une question libre,
 * des pistes d’automatisation déduites des réponses (règles simples, aucun chiffre inventé), puis prénom, entreprise
 * et téléphone ou email. Robin rappelle sous 24 h.
 */

export type Question = {
  key: "sector" | "size" | "pains" | "channels" | "tools";
  title: string;
  hint?: string;
  multiple?: boolean;
  options: string[];
};

export const audit = {
  /** Voix de l’assistant de Robin : il pose des questions préparées, Robin rappelle sous 24 h. */
  agent: {
    name: "Assistant de Robin",
    role: "Robin vous rappelle sous 24 h",
    hello: "Bonjour, je suis l’assistant de Robin.",
    purpose: "Je vous pose quelques questions pour préparer votre démo gratuite, juste le nécessaire. Robin vous rappelle ensuite sous 24 h pour vous montrer à quoi ressemblerait votre outil IA et ce qu’il vous ferait gagner. Sans engagement.",
    /** Dernière question, en texte libre. La réponse arrive à Robin telle quelle. */
    freeQuestion: "Dernière question, et c’est la plus utile : quelle automatisation vous ferait gagner le plus de temps ou d’efficacité ? Si vous avez déjà une idée en tête, même floue, écrivez‑la.",
    freePlaceholder: "Une idée, même floue… ou « je ne sais pas encore »",
    beforeLeads: "Merci, c’est très clair. D’après vos réponses, voici les pistes que Robin regardera en premier.",
    askWho: "Pour que Robin sache à qui il parle : votre prénom et le nom de votre entreprise ?",
    whoPlaceholder: "Prénom, entreprise",
    askContact: "Et un numéro de téléphone (ou un email) pour que Robin vous rappelle sous 24 h ?",
    done: "C’est noté, merci. Robin vous rappelle sous 24 h pour vous montrer votre futur outil IA. À très vite.",
    error: "L’envoi n’a pas abouti. Vous pouvez réessayer en renvoyant votre téléphone ou votre email.",
  },
  resultKicker: "Premières pistes d’après vos réponses",
  resultNote: "Pistes générales, déduites automatiquement de vos réponses. Robin les affine avec vous lors de son appel.",
  leadPlaceholder: "Téléphone ou email",
  questions: [
    { key: "sector", title: "Dans quel secteur est votre entreprise ?", options: ["Hôtellerie", "Restauration", "Services", "Commerce", "Cabinet", "Immobilier", "Autre"] },
    { key: "size", title: "Quelle est la taille de votre équipe ?", options: ["Je suis seul", "2 à 5", "6 à 20", "Plus de 20"] },
    {
      key: "pains",
      title: "Qu’est-ce qui vous prend le plus de temps ?",
      hint: "Plusieurs réponses possibles",
      multiple: true,
      options: ["Demandes clients", "Devis", "Relances", "Rendez-vous", "Facturation et admin", "Suivi CRM", "Reporting"],
    },
    {
      key: "channels",
      title: "Par où arrivent vos demandes ?",
      hint: "Plusieurs réponses possibles",
      multiple: true,
      options: ["WhatsApp", "Email", "Téléphone", "Instagram ou Facebook", "Site web", "Plateformes (Airbnb, Booking…)"],
    },
    {
      key: "tools",
      title: "Quels outils utilisez-vous au quotidien ?",
      hint: "Plusieurs réponses possibles",
      multiple: true,
      options: ["Google Workspace", "Notion", "HubSpot", "Stripe", "Excel", "Un logiciel métier", "Aucun en particulier"],
    },
  ] satisfies Question[],
};

export type Answers = Partial<Record<Question["key"] | "need" | "who", string[]>>;

/** Pop-up d’invitation, quelques secondes après l’arrivée sur le site. */
export const nudge = {
  delaySeconds: 5,
  title: "Votre mini-audit gratuit",
  text: "Environ 2 minutes pour voir à quoi ressemblerait votre outil IA et ce qu’il vous ferait gagner.",
  cta: "Faire mon mini-audit",
  dismiss: "Plus tard",
};

const LEADS: Record<string, { title: string; text: string }> = {
  "Demandes clients": { title: "Un agent pour vos demandes courantes", text: "Il répond aux questions fréquentes sur vos canaux, rassemble les informations utiles et vous transmet ce qui demande votre avis." },
  Devis: { title: "Des devis préparés à partir de la demande", text: "Les informations sont collectées et le devis est prérempli. Vous le vérifiez avant l’envoi." },
  Relances: { title: "Des relances programmées", text: "Devis sans réponse, demandes en attente : la relance est préparée au bon moment, avec vos mots." },
  "Rendez-vous": { title: "La prise de rendez-vous sans aller-retour", text: "Le client choisit un créneau libre, il est bloqué dans votre agenda et la confirmation part." },
  "Facturation et admin": { title: "Moins de ressaisie administrative", text: "Factures, paiements, saisie : ce qui se répète chaque semaine est préparé, vous contrôlez." },
  "Suivi CRM": { title: "Un CRM tenu à jour", text: "Chaque échange complète la fiche client, sans ressaisie." },
  Reporting: { title: "L’essentiel de votre activité chaque semaine", text: "Un tableau de bord qui rassemble ce qu’il faut savoir, au lieu de le chercher." },
};

const DEFAULT_LEADS = [LEADS["Demandes clients"], LEADS["Relances"], LEADS["Suivi CRM"]];

const KEYWORDS: Array<[RegExp, keyof typeof LEADS]> = [
  [/devis/i, "Devis"],
  [/relanc/i, "Relances"],
  [/rendez|rdv|agenda|créneau|creneau|réserv|reserv/i, "Rendez-vous"],
  [/factur|admin|paiement|compta/i, "Facturation et admin"],
  [/crm|fiche|suivi client/i, "Suivi CRM"],
  [/report|tableau|chiffre|pilot/i, "Reporting"],
  [/demande|message|répond|repond|question|client|whatsapp|mail|téléphone|telephone/i, "Demandes clients"],
];

export function leadsFor(answers: Answers): { title: string; text: string }[] {
  const need = (answers.need ?? []).join(" ");
  const fromNeed = KEYWORDS.filter(([re]) => re.test(need)).map(([, k]) => k);
  const pains = [...fromNeed, ...(answers.pains ?? [])].filter((p, i, a) => a.indexOf(p) === i);
  const picked = pains.map((p) => LEADS[p]).filter(Boolean).slice(0, 3);
  if (picked.length >= 2) return picked;
  return [...picked, ...DEFAULT_LEADS.filter((d) => !picked.includes(d))].slice(0, 3);
}

/** Phrase de contexte construite à partir des canaux et outils cochés. */
export function contextLine(answers: Answers): string {
  const channels = (answers.channels ?? []).slice(0, 3);
  const tools = (answers.tools ?? []).filter((t) => t !== "Aucun en particulier").slice(0, 3);
  const parts: string[] = [];
  if (channels.length) parts.push(`branché sur ${channels.join(", ")}`);
  if (tools.length) parts.push(`connecté à ${tools.join(", ")}`);
  return parts.length ? `Le tout ${parts.join(" et ")}.` : "";
}
