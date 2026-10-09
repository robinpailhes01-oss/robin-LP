/**
 * Noms des types de demandes du site, partagés par le QG (IncomingLeads) et la file de Nina (NinaQueue) :
 * une même demande porte le même nom partout. Les couleurs et icônes restent propres à chaque composant,
 * rangées sous les mêmes clés.
 *
 * `kind` vient du formulaire public (app/api/contact : "mini-audit", "rappel", "assistant", "audit" pour l’ancien formulaire) :
 * il n’est lu que via Object.hasOwn (aucune clé héritée comme « constructor ») et n’est jamais affiché brut.
 * Module sans état ni accès serveur, importable partout.
 */
export const LEAD_KINDS: Record<string, { label: string }> = {
  "mini-audit": { label: "Mini-audit" },
  rappel: { label: "Rappel demandé" },
  assistant: { label: "Message de l’assistant" },
  audit: { label: "Demande d’audit" },
};

/** Libellé d’un type de demande ; type inconnu ou invalide : « Autre demande ». */
export function leadKindLabel(kind: unknown): string {
  return typeof kind === "string" && Object.hasOwn(LEAD_KINDS, kind) ? LEAD_KINDS[kind].label : "Autre demande";
}

/** Contact sans nom (ni entreprise) renseigné. */
export const LEAD_NO_NAME = "Nom non renseigné";
