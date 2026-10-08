import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeStatut } from "@/components/BadgeStatut";
import { Cadre, TitreSection } from "@/components/Cadre";
import { ChoixStatut, Notes } from "@/components/Formulaires";
import { lireLead, modeDemo } from "@/lib/db";
import { fmtJourHeure, fmtNb } from "@/lib/format";
import { SEGMENTS } from "@/lib/labels";
import type { Evenement, Lead, Message } from "@/lib/types";
import { actionNotes, actionStatut } from "./actions";

export const dynamic = "force-dynamic";

export default async function FicheLead({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fiche = await lireLead(decodeURIComponent(id));
  if (!fiche) notFound();
  const { lead: l, messages, evenements } = fiche;

  return (
    <Cadre actif="leads">
      <Link href="/leads" className="inline-flex h-9 items-center gap-1.5 text-[14px] text-muted hover:text-ink">
        <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
          <path d="M7.5 2.5 4 6l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Leads
      </Link>

      <header className="mt-2 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[34px]">{l.nom}</h1>
          <p className="mt-1 text-[14px] text-ink-2">
            {l.activite} · {l.zone} · {SEGMENTS[l.segment].court}
            {l.variante && <span className="text-muted"> · variante {l.variante}</span>}
          </p>
        </div>
        <BadgeStatut statut={l.statut} />
      </header>


      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-10 lg:col-span-7">
          <section>
            <TitreSection aside={modeDemo ? "démo : non enregistré" : undefined}>Statut</TitreSection>
            <ChoixStatut id={l.id} statut={l.statut} action={actionStatut} />
            {l.statut !== "desinscrit" && (
              <p className="mt-2 text-[12px] leading-5 text-muted">
                « Désinscrit » ajoute ses adresses à la liste de suppression : plus aucun mail ne partira vers elles.
              </p>
            )}
          </section>

          <section className="lg:hidden">
            <TitreSection>Contact</TitreSection>
            <Contact lead={l} />
          </section>

          <section>
            <TitreSection>Notes</TitreSection>
            <Notes id={l.id} notes={l.notes} action={actionNotes} />
          </section>

          <section>
            <TitreSection aside={pluralise(messages.length + evenements.length + 1)}>Historique</TitreSection>
            <Historique messages={messages} evenements={evenements} collecte={l.collecte_le} source={l.source} />
          </section>
        </div>

        <aside className="flex flex-col gap-10 lg:col-span-5">
          <section className="hidden lg:block">
            <TitreSection>Contact</TitreSection>
            <Contact lead={l} />
          </section>

          <section>
            <TitreSection aside="lead-scout">Score</TitreSection>
            <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
              <p className="font-mono text-[15px] text-ink-2">
                <span className="text-[34px] font-semibold tracking-[-0.03em] text-ink">{l.score ?? "—"}</span>/10
              </p>
              {l.score_justification && <p className="mt-2 text-[14px] leading-6 text-ink-2">{l.score_justification}</p>}
            </div>
          </section>
        </aside>
      </div>
    </Cadre>
  );
}

function Contact({ lead: l }: { lead: Lead }) {
  return (
    <dl className="divide-y divide-line rounded-xl border border-line bg-surface text-[14px]">
      <Champ label={l.emails.length > 1 ? "Emails" : "Email"}>
        {l.emails.length ? (
          <ul className="flex flex-col gap-1">
            {l.emails.map((e) => (
              <li key={e}>
                <a href={`mailto:${e}`} className="break-all text-accent hover:text-accent-strong">
                  {e}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-muted">Aucun email trouvé</span>
        )}
      </Champ>
      <Champ label="Téléphone">
        {l.telephone ? (
          <a href={`tel:${l.telephone.replace(/\s+/g, "")}`} className="chiffres text-accent hover:text-accent-strong">
            {l.telephone}
          </a>
        ) : (
          <span className="text-muted">—</span>
        )}
      </Champ>
      <Champ label="Site web">
        {l.site_web ? (
          <a href={l.site_web} target="_blank" rel="noopener noreferrer" className="break-all text-accent hover:text-accent-strong">
            {l.site_web.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        ) : (
          <span className="text-muted">—</span>
        )}
      </Champ>
      <Champ label="Adresse">{l.adresse ?? <span className="text-muted">—</span>}</Champ>
      <Champ label="Google">
        {l.nb_avis !== null ? (
          <span className="chiffres">
            {l.note_google !== null && <>{String(l.note_google).replace(".", ",")} ★ · </>}
            {fmtNb(l.nb_avis)} avis
          </span>
        ) : (
          <span className="text-muted">—</span>
        )}
      </Champ>
    </dl>
  );
}

function Champ({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5 px-4 py-3 sm:grid-cols-[6.5rem_1fr] sm:gap-3 sm:px-5">
      <dt className="text-[12px] text-muted sm:text-[14px]">{label}</dt>
      <dd className="min-w-0 text-[15px] text-ink sm:text-[14px]">{children}</dd>
    </div>
  );
}

const pluralise = (n: number) => `${n} entrée${n > 1 ? "s" : ""}`;

type Entree = { date: string; titre: string; detail?: string; corps?: string; marque: "mail" | "statut" | "note" | "collecte" };

function Historique({ messages, evenements, collecte, source }: { messages: Message[]; evenements: Evenement[]; collecte: string; source: string }) {
  const entrees: Entree[] = [
    ...messages.map((m): Entree => ({
      date: m.envoye_le ?? m.cree_le,
      titre: `${m.type === "premier" ? "Premier mail" : "Relance"} ${
        m.statut === "envoye" ? "envoyé" : m.statut === "erreur" ? "en erreur" : "préparé, pas envoyé"
      } · variante ${m.variante}`,
      detail: m.objet,
      corps: m.corps,
      marque: "mail",
    })),
    ...evenements.map((e): Entree => ({
      date: e.cree_le,
      titre: e.type === "statut" ? `Statut : ${e.detail}` : e.detail,
      marque: e.type,
    })),
    { date: collecte, titre: `Lead collecté (${source})`, marque: "collecte" } satisfies Entree,
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ol className="relative border-l border-line pl-5">
      {entrees.map((e, i) => (
        <li key={`${e.date}-${i}`} className="relative pb-5 last:pb-0">
          <span
            className={`absolute -left-[25px] top-1.5 size-2 rounded-full ring-4 ring-surface-2 ${
              e.marque === "mail" ? "bg-accent" : e.marque === "statut" ? "bg-ink" : "bg-line-strong"
            }`}
            aria-hidden
          />
          <p className="repere chiffres !tracking-[0.04em]">{fmtJourHeure(e.date)}</p>
          <p className="mt-0.5 text-[14px] font-medium text-ink">{e.titre}</p>
          {e.detail && <p className="mt-0.5 text-[13px] text-ink-2">« {e.detail} »</p>}
          {e.corps && (
            <details className="mt-1.5 text-[13px]">
              <summary className="cursor-pointer text-muted hover:text-ink">Voir le mail</summary>
              <p className="mt-2 whitespace-pre-line rounded-lg bg-surface p-3 leading-6 text-ink-2 ring-1 ring-inset ring-line">{e.corps}</p>
            </details>
          )}
        </li>
      ))}
    </ol>
  );
}
