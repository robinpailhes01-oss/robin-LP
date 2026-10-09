import "server-only";

/**
 * Données réelles du studio, lues côté serveur dans Supabase (table `leads`, voir supabase/migrations).
 * Sans SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY : `connected: false`, et l’interface affiche « — ».
 * La clé service ne quitte jamais le serveur.
 * Les totaux sont des comptes exacts lus dans l’en-tête Content-Range de PostgREST, jamais la longueur d’une liste limitée.
 * Les coordonnées (email, téléphone) ne sont volontairement pas lues ici. Quand il en faudra (fiche client, étape 2),
 * ajouter une fonction serveur dédiée, par exemple `getLeadContact(id)`, appelée seulement là où elles s’affichent.
 */

export type LeadRow = {
  id: string;
  created_at: string;
  kind: string;
  name: string | null;
  company: string | null;
  timing: string | null;
  estimate: string[] | null;
  status: string;
};

export type StudioStats = {
  connected: boolean;
  /** true si Supabase est configuré mais la lecture a échoué. */
  error: boolean;
  leadsWeek: number | null;
  auditsWeek: number | null;
  rappelsWeek: number | null;
  recent: LeadRow[];
};

const EMPTY: StudioStats = { connected: false, error: false, leadsWeek: null, auditsWeek: null, rappelsWeek: null, recent: [] };

/** Nombre de demandes récentes renvoyées dans `recent`. */
const RECENT = 8;

/** Total exact d’une réponse PostgREST demandée avec `Prefer: count=exact` (« 0-7/342 » ou « *\/342 »). */
function parseCount(res: Response): number | null {
  const m = /\/(\d+)$/.exec(res.headers.get("content-range") ?? "");
  return m ? Number(m[1]) : null;
}

export async function getStudioStats(now = Date.now()): Promise<StudioStats> {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return EMPTY;

  const failed: StudioStats = { ...EMPTY, connected: true, error: true };
  const since = encodeURIComponent(new Date(now - 7 * 86400 * 1000).toISOString());
  const base = `${url}/rest/v1/leads`;
  const headers = { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" };

  try {
    const signal = AbortSignal.timeout(8000);
    const [list, audits, rappels] = await Promise.all([
      // La liste et le total de la semaine en une seule requête.
      fetch(`${base}?select=id,created_at,kind,name,company,timing,estimate,status&created_at=gte.${since}&order=created_at.desc&limit=${RECENT}`, {
        headers,
        cache: "no-store",
        signal,
      }),
      // Comptes seuls (HEAD, sans corps).
      fetch(`${base}?select=id&created_at=gte.${since}&kind=eq.mini-audit`, { method: "HEAD", headers, cache: "no-store", signal }),
      fetch(`${base}?select=id&created_at=gte.${since}&kind=eq.rappel`, { method: "HEAD", headers, cache: "no-store", signal }),
    ]);
    if (!list.ok || !audits.ok || !rappels.ok) return failed;

    const leadsWeek = parseCount(list);
    const auditsWeek = parseCount(audits);
    const rappelsWeek = parseCount(rappels);
    // Un compte illisible : pas de chiffre approximatif, on signale l’échec.
    if (leadsWeek === null || auditsWeek === null || rappelsWeek === null) return failed;

    const recent = (await list.json()) as unknown;
    if (!Array.isArray(recent)) return failed;

    return { connected: true, error: false, leadsWeek, auditsWeek, rappelsWeek, recent: recent as LeadRow[] };
  } catch {
    return failed;
  }
}
