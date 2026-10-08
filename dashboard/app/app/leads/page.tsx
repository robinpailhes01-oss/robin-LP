import Link from "next/link";
import { BadgeStatut } from "@/components/BadgeStatut";
import { Cadre } from "@/components/Cadre";
import { Filtres } from "@/components/Filtres";
import { Crans } from "@/components/Reglette";
import { listerEnvois, listerLeads } from "@/lib/db";
import { fmtJour, fmtNb, pluriel } from "@/lib/format";
import { SEGMENTS, STATUTS, STATUT_LABEL } from "@/lib/labels";
import type { Lead, Segment, Statut } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { q?: string; segment?: string; activite?: string; zone?: string; statut?: string };

const sansAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const uniques = (valeurs: string[]) => [...new Set(valeurs)].sort((a, b) => a.localeCompare(b, "fr"));
const premier = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function PageLeads({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const brut = await searchParams;
  const p: Params = {
    q: premier(brut.q).trim(),
    segment: premier(brut.segment),
    activite: premier(brut.activite),
    zone: premier(brut.zone),
    statut: premier(brut.statut),
  };

  const [leads, envois] = await Promise.all([listerLeads(), listerEnvois()]);
  const dernierEnvoi = new Map<string, string>();
  for (const e of envois) if (e.envoye_le) dernierEnvoi.set(e.lead_id, e.envoye_le);

  const q = sansAccents(p.q ?? "");
  const resultats = leads.filter(
    (l) =>
      (!q || sansAccents(l.nom).includes(q)) &&
      (!p.segment || l.segment === p.segment) &&
      (!p.activite || l.activite === p.activite) &&
      (!p.zone || l.zone === p.zone) &&
      (!p.statut || l.statut === p.statut),
  );
  const actifs = Boolean(p.q || p.segment || p.activite || p.zone || p.statut);

  const champs = [
    {
      nom: "segment",
      label: "Segment",
      valeur: p.segment ?? "",
      options: (Object.keys(SEGMENTS) as Segment[]).map((s) => ({ valeur: s, label: SEGMENTS[s].court })),
    },
    { nom: "activite", label: "Activité", valeur: p.activite ?? "", options: uniques(leads.map((l) => l.activite)).map((a) => ({ valeur: a, label: a })) },
    { nom: "zone", label: "Zone", valeur: p.zone ?? "", options: uniques(leads.map((l) => l.zone)).map((z) => ({ valeur: z, label: z })) },
    { nom: "statut", label: "Statut", valeur: p.statut ?? "", options: STATUTS.map((s) => ({ valeur: s, label: STATUT_LABEL[s] })) },
  ];

  return (
    <Cadre actif="leads">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-ink sm:text-[34px]">Leads</h1>
        <p className="chiffres text-[13px] text-muted">
          {actifs ? `${fmtNb(resultats.length)} sur ${fmtNb(leads.length)}` : pluriel(leads.length, "lead")}
        </p>
      </div>

      <div className="mt-5">
        <Filtres champs={champs} recherche={p.q ?? ""} actifs={actifs} />
      </div>

      {leads.length === 0 ? (
        <Vide>Pas encore de leads. L&apos;agent lead-scout les ajoutera ici après sa première recherche.</Vide>
      ) : resultats.length === 0 ? (
        <Vide>
          Aucun lead ne correspond à ces filtres.{" "}
          <Link href="/leads" className="font-medium text-accent">
            Tout afficher
          </Link>
        </Vide>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface">
          <div className="repere hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_6rem_6.5rem_6.5rem] gap-4 border-b border-line bg-surface-2 px-5 py-2.5 md:grid">
            <span>Nom</span>
            <span>Activité</span>
            <span>Zone</span>
            <span>Score</span>
            <span>Dernier envoi</span>
            <span>Statut</span>
          </div>
          <ul className="divide-y divide-line">
            {resultats.map((l) => (
              <LigneLead key={l.id} lead={l} contacte={dernierEnvoi.get(l.id)} />
            ))}
          </ul>
        </div>
      )}
    </Cadre>
  );
}

function LigneLead({ lead: l, contacte }: { lead: Lead; contacte?: string }) {
  return (
    <li>
      <Link href={`/leads/${l.id}`} className="block px-4 py-3.5 transition-colors hover:bg-surface-2 md:px-5">
        {/* Mobile : deux lignes, le statut à droite. */}
        <span className="flex items-start gap-3 md:hidden">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-medium text-ink">{l.nom}</span>
            <span className="mt-0.5 block truncate text-[13px] text-muted">
              {l.activite} · {l.zone}
            </span>
          </span>
          <span className="flex flex-col items-end gap-1">
            <BadgeStatut statut={l.statut} />
            <Crans score={l.score} />
          </span>
        </span>
        {/* Bureau : tableau. */}
        <span className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_6rem_6.5rem_6.5rem] items-center gap-4 md:grid">
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-medium text-ink">{l.nom}</span>
            <span className="block text-[12px] text-muted">{SEGMENTS[l.segment].court}</span>
          </span>
          <span className="truncate text-[14px] text-ink-2">{l.activite}</span>
          <span className="truncate text-[14px] text-ink-2">{l.zone}</span>
          <span>
            <Crans score={l.score} />
          </span>
          <span className="chiffres text-[13px] text-muted">{contacte ? fmtJour(contacte) : "—"}</span>
          <span>
            <BadgeStatut statut={l.statut as Statut} />
          </span>
        </span>
      </Link>
    </li>
  );
}

function Vide({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 rounded-xl border border-dashed border-line-strong px-4 py-8 text-center text-[14px] leading-6 text-ink-2">{children}</p>;
}
