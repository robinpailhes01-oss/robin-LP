/**
 * Mini-audit gratuit : 5 questions à choix rapides, puis des pistes d’automatisation
 * déduites des réponses (règles simples, aucun chiffre inventé), et une demande d’analyse complète.
 */

export type Question = {
  key: "sector" | "size" | "pains" | "channels" | "tools";
  title: string;
  hint?: string;
  multiple?: boolean;
  options: string[];
};

export const audit = {
  pill: "Mini-audit gratuit",
  /** Voix de la mascotte dans le panneau conversationnel. */
  agent: {
    name: "Luma",
    role: "Votre assistant pour le mini-audit",
    hello: "Bonjour ! Je suis Luma. En cinq questions, je repère ce qui pourrait fonctionner sans vous dans votre entreprise. C’est gratuit et ça prend deux minutes.",
    beforeLeads: "Merci ! Voici ce que je regarderais en premier chez vous.",
    askContact: "Pour recevoir votre analyse complète, faite à la main par Robin, laissez-moi un email ou un numéro. Il revient vers vous sous 24 h.",
    done: "C’est noté, merci ! Robin vous recontacte sous 24 h avec votre analyse. À très vite.",
    error: "L’envoi n’a pas abouti. Vous pouvez réessayer en renvoyant votre email ou votre numéro.",
  },
  title: "Vous voyez de l’IA partout. Mais concrètement, chez vous ?",
  text: "Luma, notre assistant, vous pose cinq questions simples et vous montre gratuitement ce qui pourrait tourner sans vous dans votre entreprise. Robin vous rappelle ensuite avec une analyse complète. Sans engagement, sans jargon.",
  start: "Lancer le mini-audit avec Luma",
  next: "Suivant",
  back: "Retour",
  see: "Voir mes premières pistes",
  resultKicker: "Premières pistes d’après vos réponses",
  resultTitle: "Voici ce que Luma regarderait en premier chez vous.",
  resultNote: "Ce sont des pistes générales. L’analyse complète est faite à la main par Robin, à partir de votre fonctionnement réel.",
  leadTitle: "Recevez votre analyse complète, gratuitement.",
  leadText: "Un email ou un numéro, et Robin vous envoie sous 24 h ce qu’il verrait chez vous, avec des exemples concrets.",
  leadPlaceholder: "Email ou téléphone",
  leadButton: "Recevoir mon analyse gratuite",
  leadDone: "Reçu. Robin revient vers vous sous 24 h avec votre analyse.",
  leadError: "L’envoi n’a pas abouti. Réessayez dans un instant.",
  restart: "Refaire le mini-audit",
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

export type Answers = Partial<Record<Question["key"], string[]>>;

const LEADS: Record<string, { title: string; text: string }> = {
  "Demandes clients": { title: "Un agent qui répond à vos demandes", text: "Il répond 24/7 sur vos canaux, qualifie la demande et ne vous transmet que ce qui mérite votre attention." },
  Devis: { title: "Des devis préparés automatiquement", text: "À partir de la demande, le devis est généré, envoyé, et suivi jusqu’à la réponse du client." },
  Relances: { title: "Des relances qui partent toutes seules", text: "Devis sans réponse, demandes en attente : la relance part au bon moment, avec vos mots." },
  "Rendez-vous": { title: "La prise de rendez-vous sans aller-retour", text: "Le client choisit un créneau, l’agenda se remplit, la confirmation part. Vous n’intervenez pas." },
  "Facturation et admin": { title: "L’administratif qui se fait en arrière-plan", text: "Factures, paiements, saisie : ce qui se répète chaque semaine est pris en charge." },
  "Suivi CRM": { title: "Un CRM toujours à jour", text: "Chaque échange met à jour la fiche client, sans ressaisie." },
  Reporting: { title: "L’essentiel de votre activité chaque semaine", text: "Un tableau de bord qui vous envoie ce qu’il faut savoir, au lieu de le chercher." },
};

const DEFAULT_LEADS = [LEADS["Demandes clients"], LEADS["Relances"], LEADS["Suivi CRM"]];

export function leadsFor(answers: Answers): { title: string; text: string }[] {
  const pains = answers.pains ?? [];
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
