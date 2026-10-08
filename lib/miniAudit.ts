/**
 * Mini-audit en libre-service : quelques questions, puis les coordonnées, puis le résultat à l’écran.
 * Le résultat assemble un outil à partir des réponses et estime les gains à partir des chiffres
 * donnés par le visiteur lui-même. Aucune donnée inventée : l’hypothèse est affichée avec le résultat.
 */

/** Part du temps passé sur ces tâches que l’outil prend en charge. Hypothèse prudente, à valider par Robin. */
export const AUTOMATION_SHARE = 0.5;
const DAYS_PER_WEEK = 5;
const WEEKS_PER_MONTH = 4.33;

export type Choice = { label: string; value?: number };
export type AuditQuestion = {
  key: "sector" | "size" | "tasks" | "channels" | "time" | "cost" | "tools";
  title: string;
  hint?: string;
  multiple?: boolean;
  options: Choice[];
};

export const miniAudit = {
  meta: {
    title: "Mini-audit IA gratuit",
    description: "En 2 minutes, voyez à quoi ressemblerait votre outil IA et le temps qu’il vous ferait gagner.",
  },
  kicker: "Mini-audit gratuit",
  title: "À quoi ressemblerait votre outil IA ?",
  text: "Quelques questions, environ 2 minutes. Vous voyez aussitôt votre futur outil et ce qu’il vous ferait gagner.",
  start: "Commencer",
  next: "Continuer",
  back: "Retour",
  questions: [
    { key: "sector", title: "Dans quel secteur est votre entreprise ?", options: [{ label: "Services" }, { label: "Commerce" }, { label: "Hôtellerie et tourisme" }, { label: "Restauration" }, { label: "Artisanat et BTP" }, { label: "Cabinet" }, { label: "Immobilier" }, { label: "Autre" }] },
    { key: "size", title: "Combien êtes-vous dans l’entreprise ?", options: [{ label: "Je suis seul" }, { label: "2 à 5" }, { label: "6 à 20" }, { label: "Plus de 20" }] },
    {
      key: "tasks",
      title: "Quelles tâches vous prennent le plus de temps ?",
      hint: "Plusieurs réponses possibles",
      multiple: true,
      options: [{ label: "Répondre aux demandes clients" }, { label: "Préparer les devis" }, { label: "Relancer les clients" }, { label: "Gérer les rendez-vous" }, { label: "Saisie et administratif" }, { label: "Suivre les clients" }],
    },
    {
      key: "channels",
      title: "Par où vos clients vous contactent-ils ?",
      hint: "Plusieurs réponses possibles",
      multiple: true,
      options: [{ label: "WhatsApp" }, { label: "Email" }, { label: "Téléphone" }, { label: "Instagram ou Facebook" }, { label: "Site web" }],
    },
    {
      key: "time",
      title: "Combien de temps ces tâches prennent-elles chaque jour ?",
      hint: "Pour vous et votre équipe, au total",
      options: [{ label: "Moins d’1 h", value: 0.75 }, { label: "1 à 2 h", value: 1.5 }, { label: "2 à 4 h", value: 3 }, { label: "Plus de 4 h", value: 5 }],
    },
    {
      key: "cost",
      title: "Combien coûte une heure de travail chez vous ?",
      hint: "Salaire chargé, ou la valeur de votre propre temps",
      options: [{ label: "Environ 25 €", value: 25 }, { label: "Environ 35 €", value: 35 }, { label: "Environ 50 €", value: 50 }, { label: "75 € ou plus", value: 75 }],
    },
    {
      key: "tools",
      title: "Quels outils utilisez-vous déjà ?",
      hint: "Plusieurs réponses possibles",
      multiple: true,
      options: [{ label: "Google (Gmail, Agenda)" }, { label: "Excel ou Sheets" }, { label: "Un CRM" }, { label: "Un logiciel métier" }, { label: "Aucun en particulier" }],
    },
  ] as AuditQuestion[],
  contact: {
    title: "Votre résultat est prêt.",
    text: "Laissez vos coordonnées pour le voir. Si vous le souhaitez, Robin vous montre ensuite une maquette de votre outil.",
    name: "Prénom",
    company: "Entreprise",
    email: "Email",
    phone: "Téléphone (facultatif)",
    submit: "Voir mon résultat",
    consent: "Vos réponses servent uniquement à préparer votre résultat. Robin peut vous recontacter à ce sujet.",
    invalid: "Indiquez votre prénom et un email valide.",
  },
  result: {
    kicker: "Votre résultat",
    toolTitle: (company: string) => (company ? `L’outil IA de ${company}` : "Votre outil IA"),
    connected: "Branché sur",
    modulesTitle: "Ce qu’il prend en charge",
    validate: "Vous validez depuis votre tableau de bord.",
    gainsTitle: "Ce qu’il vous ferait gagner",
    perWeek: "par semaine",
    perMonth: "par mois",
    note: (share: number) => `Estimation indicative, calculée à partir de vos réponses : on suppose que l’outil prend en charge ${Math.round(share * 100)} % du temps passé sur ces tâches, 5 jours par semaine.`,
    callbackTitle: "Voir la maquette de votre outil",
    callbackText: "Robin vous montre à quoi ressemblerait concrètement cet outil, sur votre cas. Gratuit, sans engagement.",
    callback: "Être rappelé par Robin",
    callbackDone: "C’est noté. Robin vous rappelle sous 24 h.",
    restart: "Refaire le mini-audit",
    sendError: "L’envoi de vos coordonnées n’a pas abouti. Vous pouvez réessayer.",
    retry: "Réessayer",
  },
};

export type AuditAnswers = Partial<Record<AuditQuestion["key"], string[]>>;

const MODULES: Record<string, { title: string; text: (channels: string) => string }> = {
  "Répondre aux demandes clients": { title: "Un agent IA qui répond", text: (c) => `Il répond à vos clients${c ? ` sur ${c}` : ""} avec vos informations, à toute heure, et vous transmet le reste.` },
  "Préparer les devis": { title: "Des devis préparés", text: () => "Les informations utiles sont collectées et le devis est prérempli. Vous validez avant l’envoi." },
  "Relancer les clients": { title: "Des relances au bon moment", text: () => "Devis sans réponse, clients à recontacter : la relance part au bon moment, avec vos mots." },
  "Gérer les rendez-vous": { title: "La prise de rendez-vous", text: () => "Le client choisit un créneau libre, votre agenda se met à jour et le rappel part tout seul." },
  "Saisie et administratif": { title: "Fini la ressaisie", text: () => "Les informations passent d’un outil à l’autre, sans copier-coller." },
  "Suivre les clients": { title: "Une fiche client à jour", text: () => "Chaque échange complète la fiche client, sans que vous ayez à y penser." },
};

function list(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;
}

/** Valeur numérique d’une réponse à choix unique (temps, coût horaire). */
function valueOf(key: "time" | "cost", answers: AuditAnswers): number {
  const q = miniAudit.questions.find((x) => x.key === key)!;
  const label = answers[key]?.[0];
  return q.options.find((o) => o.label === label)?.value ?? 0;
}

/** Montant en euros avec espace insécable entre les milliers : 1 200. */
export function formatEuros(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
}

/** Noms de canaux dans une phrase : « WhatsApp et email », pas « WhatsApp et Email ». */
const IN_SENTENCE: Record<string, string> = { Email: "email", Téléphone: "téléphone", "Site web": "votre site", "Instagram ou Facebook": "Instagram et Facebook" };

export function buildResult(answers: AuditAnswers) {
  const channels = answers.channels ?? [];
  const tools = (answers.tools ?? []).filter((t) => t !== "Aucun en particulier");
  const tasks = answers.tasks?.length ? answers.tasks : ["Répondre aux demandes clients", "Relancer les clients"];
  const modules = tasks.map((t) => MODULES[t]).filter(Boolean).map((m) => ({ title: m.title, text: m.text(list(channels.map((c) => IN_SENTENCE[c] ?? c))) }));

  const hoursPerDay = valueOf("time", answers);
  const hourlyCost = valueOf("cost", answers);
  const hoursWeek = Math.max(1, Math.round(hoursPerDay * DAYS_PER_WEEK * AUTOMATION_SHARE));
  const euros = Math.round((hoursWeek * WEEKS_PER_MONTH * hourlyCost) / 50) * 50;

  return {
    connected: [...channels, ...tools],
    modules,
    hoursWeek,
    eurosMonth: euros,
  };
}
