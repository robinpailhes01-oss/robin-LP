/**
 * Données réelles du studio, lues côté serveur dans Supabase (table `leads`, voir supabase/migrations).
 * Sans SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY : `connected: false`, et l’interface affiche « — ».
 * La clé service ne quitte jamais le serveur.
 */

export type LeadRow = {
  id: string;
  created_at: string;
  kind: string;
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
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

export async function getStudioStats(now = Date.now()): Promise<StudioStats> {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return EMPTY;

  const since = new Date(now - 7 * 86400 * 1000).toISOString();
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  try {
    const res = await fetch(
      `${url}/rest/v1/leads?select=id,created_at,kind,name,company,email,phone,timing,estimate,status&created_at=gte.${encodeURIComponent(since)}&order=created_at.desc&limit=200`,
      { headers, cache: "no-store", signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return { ...EMPTY, connected: true, error: true };
    const rows = (await res.json()) as LeadRow[];
    return {
      connected: true,
      error: false,
      leadsWeek: rows.length,
      auditsWeek: rows.filter((r) => r.kind === "mini-audit").length,
      rappelsWeek: rows.filter((r) => r.kind === "rappel").length,
      recent: rows.slice(0, 8),
    };
  } catch {
    return { ...EMPTY, connected: true, error: true };
  }
}
