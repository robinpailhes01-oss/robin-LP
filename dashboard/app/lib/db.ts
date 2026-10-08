// Accès aux données, uniquement côté serveur.
// Sans SUPABASE_URL et SUPABASE_SECRET_KEY, le dashboard tourne sur les données de démo et n'enregistre rien.

import { demoEvenements, demoLeads, demoMessages } from "./demo";
import { STATUT_LABEL } from "./labels";
import type { Envoi, Evenement, Lead, Message, Statut } from "./types";

const URL_SUPABASE = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const CLE = process.env.SUPABASE_SECRET_KEY;

export const modeDemo = !URL_SUPABASE || !CLE;

export class ErreurDemo extends Error {
  constructor() {
    super("Mode démo : rien n'est enregistré tant que Supabase n'est pas branché.");
  }
}

const TABLE = {
  leads: "prospection_leads",
  messages: "prospection_messages",
  suppressions: "prospection_suppressions",
  evenements: "prospection_evenements",
} as const;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function supabase<T>(chemin: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("apikey", CLE!);
  // Les anciennes clés « service_role » sont des JWT ; les nouvelles « sb_secret_… » passent seulement par apikey.
  if (!CLE!.startsWith("sb_")) headers.set("Authorization", `Bearer ${CLE}`);
  headers.set("Content-Type", "application/json");
  const res = await fetch(`${URL_SUPABASE}/rest/v1/${chemin}`, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Supabase ${res.status} sur ${chemin.split("?")[0]} : ${await res.text()}`);
  }
  const texte = await res.text();
  return (texte ? JSON.parse(texte) : undefined) as T;
}

export async function listerLeads(): Promise<Lead[]> {
  if (modeDemo) return demoLeads;
  return supabase<Lead[]>(`${TABLE.leads}?select=*&order=score.desc.nullslast,nom.asc`);
}

export async function listerEnvois(): Promise<Envoi[]> {
  if (modeDemo) return demoMessages.filter((m) => m.statut === "envoye");
  return supabase<Envoi[]>(
    `${TABLE.messages}?select=lead_id,type,variante,objet,envoye_le&statut=eq.envoye&order=envoye_le.asc`,
  );
}

export type FicheLead = { lead: Lead; messages: Message[]; evenements: Evenement[] };

export async function lireLead(id: string): Promise<FicheLead | null> {
  if (modeDemo) {
    const lead = demoLeads.find((l) => l.id === id);
    if (!lead) return null;
    return {
      lead,
      messages: demoMessages.filter((m) => m.lead_id === id),
      evenements: demoEvenements.filter((e) => e.lead_id === id),
    };
  }
  if (!UUID.test(id)) return null;
  const [leads, messages, evenements] = await Promise.all([
    supabase<Lead[]>(`${TABLE.leads}?select=*&id=eq.${id}`),
    supabase<Message[]>(`${TABLE.messages}?select=*&lead_id=eq.${id}&order=cree_le.desc`),
    supabase<Evenement[]>(`${TABLE.evenements}?select=*&lead_id=eq.${id}&order=cree_le.desc`),
  ]);
  return leads[0] ? { lead: leads[0], messages, evenements } : null;
}

export async function changerStatut(id: string, statut: Statut) {
  if (modeDemo) throw new ErreurDemo();
  if (!UUID.test(id)) throw new Error("Identifiant de lead invalide");

  // Un désinscrit part d'abord dans la liste de suppression : c'est la règle qui ne doit jamais sauter.
  if (statut === "desinscrit") {
    const [lead] = await supabase<Pick<Lead, "emails">[]>(`${TABLE.leads}?select=emails&id=eq.${id}`);
    const emails = [...new Set((lead?.emails ?? []).map((e) => e.trim().toLowerCase()).filter(Boolean))];
    if (emails.length) {
      await supabase(`${TABLE.suppressions}?on_conflict=email`, {
        method: "POST",
        headers: { Prefer: "resolution=ignore-duplicates" },
        body: JSON.stringify(emails.map((email) => ({ email, raison: "desinscription" }))),
      });
    }
  }

  await supabase(`${TABLE.leads}?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify({ statut, maj_le: new Date().toISOString() }),
  });
  await supabase(TABLE.evenements, {
    method: "POST",
    body: JSON.stringify({ lead_id: id, type: "statut", detail: STATUT_LABEL[statut] }),
  });
}

export async function enregistrerNotes(id: string, notes: string) {
  if (modeDemo) throw new ErreurDemo();
  if (!UUID.test(id)) throw new Error("Identifiant de lead invalide");
  await supabase(`${TABLE.leads}?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify({ notes, maj_le: new Date().toISOString() }),
  });
  await supabase(TABLE.evenements, {
    method: "POST",
    body: JSON.stringify({ lead_id: id, type: "note", detail: "Notes modifiées" }),
  });
}
