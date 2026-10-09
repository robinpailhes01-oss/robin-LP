/** Petits formats du QG : accords et dates en heure de Paris. */

const NBSP = " ";

/** Accord en français : 0 et 1 au singulier. « 1 audit reçu », « 3 audits reçus ». */
export function plural(n: number, singular: string, pluralForm = `${singular}s`) {
  return n > 1 ? pluralForm : singular;
}

/** « 3 demandes », avec une espace insécable entre le nombre et le mot. */
export function count(n: number, singular: string, pluralForm?: string) {
  return `${n}${NBSP}${plural(n, singular, pluralForm)}`;
}

/** « Vendredi 9 octobre 2026 », en heure de Paris. */
export function parisLongDate(date: Date) {
  const s = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** « 2026-10-09 », pour l’attribut dateTime. */
export function parisIsoDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/** Espaces insécables de la typographie française : une seule version pour tout le studio (agent/format.ts). */
export { typo } from "@/components/studio/agent/format";
