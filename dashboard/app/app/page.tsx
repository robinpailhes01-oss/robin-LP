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
      {/* Le chiffre qui compte : les réponses (brief : métrique principale), sur le bandeau sombre du site. */}
      <section className="relative isolate overflow-hidden rounded-2xl bg-band text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_100%_at_90%_0%,rgba(99,80,255,0.55),transparent_65%),radial-gradient(50%_80%_at_0%_100%,rgba(31,27,73,0.9),transparent_70%)]"
        />
        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-12 lg:items-end lg:gap-10 lg:p-10">
          <div className="lg:col-span-5">
            <p className="repere !text-white/55">Mis à jour à {fmtHeure(new Date())}</p>
            <h1 className="mt-5 text-[14px] font-medium text-white/75">Taux de réponse</h1>
            {t.contactes === 0 || t.taux === null ? (
              <>
                <p className="mt-1 text-[80px] font-semibold leading-[0.9] tracking-[-0.05em] text-white/25 sm:text-[112px]">—</p>
                <p className="mt-4 max-w-[30ch] text-[15px] leading-6 text-white/75">
                  Aucun mail envoyé pour l&apos;instant. Le taux s&apos;affichera après le premier lot.
                </p>
              </>
            ) : (
              <>
                <p className="mt-1 flex items-start text-[80px] font-semibold leading-[0.9] tracking-[-0.05em] sm:text-[112px]">
                  {Math.round(t.taux * 100)}
                  <span className="ml-2 mt-[0.12em] text-[0.42em] font-medium tracking-[-0.02em] text-accent-clair">%</span>
                </p>
                <p className="mt-4 text-[15px] leading-6 text-white/75">
                  {pluriel(t.reponses, "réponse")} sur {pluriel(t.contactes, "lead contacté", "leads contactés")}
                </p>
                {(s.variantes["1"].contactes < SEUIL_PREUVE || s.variantes["2"].contactes < SEUIL_PREUVE) && (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-1 text-[12px] text-white/80 ring-1 ring-inset ring-white/15">
                    <span className="size-1.5 rounded-full bg-v2" aria-hidden />
                    Tendance : moins de {SEUIL_PREUVE} envois par variante
                  </p>
                )}
              </>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 ring-1 ring-inset ring-white/10 lg:col-span-7 lg:grid-cols-4">
            <Kpi label="Leads" valeur={t.leads} />
            <Kpi label="Contactés" valeur={t.contactes} note={s.relances ? pluriel(s.relances, "relance") : undefined} />
            <Kpi label="Réponses" valeur={t.reponses} />
            <Kpi label="RDV" valeur={t.rdv} accent />
          </dl>
        </div>
      </section>

      <div className="mt-10 grid gap-12 sm:mt-14 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-14">
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
          <div className="divide-y divide-line border-y border-line">
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
    <div className="bg-band/80 px-4 py-4 backdrop-blur-sm sm:px-5 sm:py-5">
      <dt className="text-[13px] text-white/60">{label}</dt>
      <dd className={`mt-1.5 text-[30px] font-semibold leading-none tracking-[-0.03em] ${accent ? "text-accent-clair" : "text-white"}`}>
        {fmtNb(valeur)}
      </dd>
      {note && <dd className="mt-1.5 text-[12px] text-white/55">{note}</dd>}
    </div>
  );
}

function LigneSegment({ segment, bloc }: { segment: Segment; bloc: Bloc }) {
  const enAttente = segment === "pme" && bloc.contactes === 0;
  return (
    <div className="py-4">
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
