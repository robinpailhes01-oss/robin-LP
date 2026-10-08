import Link from "next/link";
import { BadgeStatut } from "@/components/BadgeStatut";
import { Cadre, TitreSection } from "@/components/Cadre";
import { Entonnoir } from "@/components/Entonnoir";
import { Variantes } from "@/components/Variantes";
import { listerEnvois, listerLeads } from "@/lib/db";
import { fmtHeure, fmtJour, fmtNb, fmtPct, pluriel } from "@/lib/format";
import { SEGMENTS, SEUIL_PREUVE } from "@/lib/labels";
import { calculerStats, type Bloc } from "@/lib/stats";
import type { Segment } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function VueEnsemble() {
  const [leads, envois] = await Promise.all([listerLeads(), listerEnvois()]);
  const s = calculerStats(leads, envois);
  const t = s.total;

  return (
    <Cadre actif="apercu">
      <p className="repere">Mis à jour à {fmtHeure(new Date())}</p>

      {/* Le chiffre qui compte : les réponses (brief : métrique principale). */}
      <section className="mt-3 grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <h1 className="text-[14px] font-medium text-ink-2">Taux de réponse</h1>
          {t.contactes === 0 ? (
            <>
              <p className="mt-1 text-[64px] font-semibold leading-none tracking-[-0.045em] text-line-strong sm:text-[88px]">—</p>
              <p className="mt-3 max-w-[30ch] text-[15px] leading-6 text-ink-2">
                Aucun mail envoyé pour l&apos;instant. Le taux s&apos;affichera après le premier lot.
              </p>
            </>
          ) : (
            <>
              <p className="mt-1 text-[64px] font-semibold leading-none tracking-[-0.045em] text-ink sm:text-[88px]">
                {fmtPct(t.taux)}
              </p>
              <p className="mt-3 text-[15px] leading-6 text-ink-2">
                {pluriel(t.reponses, "réponse")} sur {pluriel(t.contactes, "lead contacté", "leads contactés")}
              </p>
              {(s.variantes["1"].contactes < SEUIL_PREUVE || s.variantes["2"].contactes < SEUIL_PREUVE) && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-[12px] text-ink-2 ring-1 ring-inset ring-line">
                  <span className="size-1.5 rounded-full bg-v2" aria-hidden />
                  Tendance : moins de {SEUIL_PREUVE} envois par variante
                </p>
              )}
            </>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:col-span-7 lg:grid-cols-4">
          <Kpi label="Leads" valeur={t.leads} />
          <Kpi label="Contactés" valeur={t.contactes} note={s.relances ? pluriel(s.relances, "relance") : undefined} />
          <Kpi label="Réponses" valeur={t.reponses} />
          <Kpi label="RDV" valeur={t.rdv} accent />
        </dl>
      </section>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <section className="lg:col-span-7">
          <TitreSection aside="tous segments">Du lead au rendez-vous</TitreSection>
          <div className="rounded-xl border border-line bg-surface px-4 sm:px-5">
            <Entonnoir bloc={t} />
          </div>
          {t.desinscrits > 0 && (
            <p className="mt-3 text-[13px] text-muted">
              {pluriel(t.desinscrits, "désinscrit")}, retiré{t.desinscrits > 1 ? "s" : ""} des envois (liste de suppression).
            </p>
          )}
        </section>

        <section className="lg:col-span-5">
          <TitreSection aside="test en cours · 50/50">Par variante</TitreSection>
          <Variantes variantes={s.variantes} />
        </section>

        <section className="lg:col-span-7">
          <TitreSection>Par segment</TitreSection>
          <div className="divide-y divide-line rounded-xl border border-line bg-surface">
            {(Object.keys(SEGMENTS) as Segment[]).map((seg) => (
              <LigneSegment key={seg} segment={seg} bloc={s.segments[seg]} />
            ))}
          </div>
        </section>

        <section className="lg:col-span-5">
          <TitreSection aside={<Link href="/leads?statut=repondu" className="hover:text-ink">Voir tout</Link>}>
            Réponses à traiter
          </TitreSection>
          {s.dernieresReponses.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line-strong px-4 py-6 text-[14px] leading-6 text-ink-2">
              Pas encore de réponse. Elles apparaîtront ici dès que tu marques un lead « Répondu ».
            </p>
          ) : (
            <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
              {s.dernieresReponses.map((l) => (
                <li key={l.id}>
                  <Link href={`/leads/${l.id}`} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium text-ink">{l.nom}</span>
                      <span className="block truncate text-[12px] text-muted">
                        {l.activite} · {l.zone}
                      </span>
                    </span>
                    <span className="flex flex-col items-end gap-1">
                      <BadgeStatut statut={l.statut} />
                      <span className="chiffres text-[11px] text-muted">{fmtJour(l.statut_le ?? l.maj_le)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Cadre>
  );
}

function Kpi({ label, valeur, note, accent = false }: { label: string; valeur: number; note?: string; accent?: boolean }) {
  return (
    <div className="bg-surface px-4 py-4 sm:px-5">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className={`mt-1 text-[28px] font-semibold leading-none tracking-[-0.03em] ${accent ? "text-accent" : "text-ink"}`}>
        {fmtNb(valeur)}
      </dd>
      {note && <dd className="mt-1.5 text-[12px] text-muted">{note}</dd>}
    </div>
  );
}

function LigneSegment({ segment, bloc }: { segment: Segment; bloc: Bloc }) {
  const enAttente = segment === "pme" && bloc.contactes === 0;
  return (
    <div className="px-4 py-4 sm:px-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[14px] font-medium text-ink">{SEGMENTS[segment].court}</p>
        <p className="text-[12px] text-muted">{enAttente ? "Collecte seule, envoi sur ton go" : fmtPct(bloc.taux) + " de réponse"}</p>
      </div>
      <dl className="chiffres mt-3 grid grid-cols-4 gap-2">
        {[
          ["Leads", bloc.leads],
          ["Contactés", bloc.contactes],
          ["Réponses", bloc.reponses],
          ["RDV", bloc.rdv],
        ].map(([label, v]) => (
          <div key={label}>
            <dt className="text-[11px] text-muted">{label}</dt>
            <dd className="text-[17px] font-semibold text-ink">{fmtNb(v as number)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
