import type { Agent } from "@/lib/studio/agents";
import type { StudioStats } from "@/lib/studio/data";

/** Utilitaires d’affichage partagés par les fiches agents et les pages départements. Aucun accès serveur ici. */

const NB = " ";

/**
 * Typographie française pour les textes venus des données (lib/studio/agents.ts) :
 * espace insécable avant « : ; ? ! % » », après « « », et dans les heures (« 7 h 30 »).
 */
export function typo(text: string) {
  return text
    .replace(/ ([:;?!%»])/g, `${NB}$1`)
    .replace(/« /g, `«${NB}`)
    .replace(/(\d) h\b/g, `$1${NB}h`)
    .replace(/(\d h) (\d{2})\b/g, `$1${NB}$2`);
}

/** Teinte très claire dérivée d’un accent (mélange avec du blanc). Gardé pour compatibilité. */
export function tint(accent: string, percent: number) {
  return `color-mix(in srgb, ${accent} ${percent}%, white)`;
}

/** Lueur sur fond nuit : la couleur mélangée à du transparent (pourcentage de couleur). */
export function glow(color: string, percent: number) {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

/** « Chaque matin à 7 h 30. » → « Chaque matin à 7 h 30 » (pour une pastille ou un sous-titre). */
export function noDot(text: string) {
  return text.replace(/\.$/, "");
}

/**
 * « de Léo », « d’Inès », « d’Alma » : élision devant une voyelle.
 * Pas d’élision devant « h » (h aspiré possible) : « de Hugo » reste correct.
 */
export function de(name: string) {
  return /^[aeiouyàâäéèêëîïôöùûüœ]/i.test(name) ? `d’${name}` : `de ${name}`;
}

/** « Léo, Inès, Hugo et Nina ». */
export function listFr(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;
}

export function plural(n: number, one: string, many: string) {
  return `${n}${NB}${n > 1 ? many : one}`;
}

export type KpiView = { label: string; value: number | null; hint: string };

/**
 * Indicateur d’un agent. Une valeur n’est affichée que si elle vient vraiment de Supabase
 * (source branchée ET base connectée ET lecture réussie). Sinon « — » et la raison.
 */
export function agentKpi(agent: Pick<Agent, "name" | "kpi">, stats: StudioStats | null): KpiView {
  const { label, source } = agent.kpi;
  if (!source) return { label, value: null, hint: `Compteur branché quand ${agent.name} aura fini son entraînement.` };
  if (!stats || !stats.connected) return { label, value: null, hint: "Compteur branché dès que Supabase sera connecté." };
  if (stats.error) return { label, value: null, hint: `Compteur indisponible${NB}: lecture Supabase impossible pour l’instant.` };
  const value = source === "leads-week" ? stats.leadsWeek : source === "audits-week" ? stats.auditsWeek : stats.rappelsWeek;
  if (value === null) return { label, value: null, hint: "Compteur branché dès que Supabase sera connecté." };
  return { label, value, hint: "Lu en direct dans Supabase, sur les 7 derniers jours." };
}
