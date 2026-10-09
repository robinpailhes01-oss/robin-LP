import type { ReactNode } from "react";
import type { LeadRow, StudioStats } from "@/lib/studio/data";
import { Panel, PanelTitle, shortDate } from "@/components/studio/ui";
import { AlertIcon, InboxIcon } from "./icons";
import { count } from "./format";

/**
 * « Demandes entrantes » : les 5 dernières demandes du site (7 derniers jours).
 * Composant serveur : seuls le nom, l’entreprise, le type, l’échéance, l’estimation et la date
 * sont rendus. L’email et le téléphone ne sont jamais envoyés au navigateur.
 */
const SHOWN = 5;
const URGENT = "Dès que possible";

const kinds: Record<string, { label: string; dot: string }> = {
  "mini-audit": { label: "Audit", dot: "#3B6E9E" },
  rappel: { label: "Rappel", dot: "#17263D" },
  assistant: { label: "Assistant", dot: "#71879A" },
};

function KindPill({ kind }: { kind: string }) {
  const k = kinds[kind] ?? { label: "Autre", dot: "#CADFED" };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[12px] font-semibold text-ink">
      <span aria-hidden className="size-1.5 rounded-full" style={{ background: k.dot }} />
      {k.label}
    </span>
  );
}

function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="mt-5 flex items-start gap-3.5 rounded-[18px] border border-dashed border-line bg-paper p-4 sm:p-5">
      <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-mist text-slate">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-night">{title}</p>
        <p className="mt-1 text-[14px] leading-[1.55] text-muted text-pretty">{children}</p>
      </div>
    </div>
  );
}

function LeadItem({ lead, now }: { lead: LeadRow; now: number }) {
  const urgent = lead.timing === URGENT;
  const estimate = Array.isArray(lead.estimate) ? lead.estimate.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2.5 py-4 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1.3fr)_7.5rem] lg:items-center lg:gap-x-6">
      <div className="min-w-0 [grid-area:1/1]">
        <p className="font-semibold leading-[1.35] text-night [overflow-wrap:anywhere]">{lead.name?.trim() || "Nom non renseigné"}</p>
        {lead.company?.trim() && <p className="mt-0.5 text-[13px] leading-[1.4] text-muted [overflow-wrap:anywhere]">{lead.company}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2 [grid-area:2/1/3/-1] lg:[grid-area:1/2]">
        <KindPill kind={lead.kind} />
        {urgent ? (
          <span className="inline-flex items-center rounded-full bg-night px-2.5 py-1 text-[12px] font-semibold text-white">{URGENT}</span>
        ) : lead.timing ? (
          <span className="text-[13px] text-muted">
            <span className="sr-only">Échéance&nbsp;: </span>
            {lead.timing}
          </span>
        ) : null}
      </div>

      {estimate.length > 0 ? (
        <p className="text-[13px] leading-[1.45] text-ink [grid-area:3/1/4/-1] lg:[grid-area:1/3]">
          <span className="text-muted lg:sr-only">Estimation&nbsp;: </span>
          {estimate.join(" · ")}
        </p>
      ) : (
        <p className="hidden text-[13px] text-muted lg:block lg:[grid-area:1/3]">Sans estimation</p>
      )}

      <p className="text-right text-[13px] text-muted [grid-area:1/2] lg:[grid-area:1/4]">
        <time dateTime={lead.created_at}>{shortDate(lead.created_at, now)}</time>
      </p>
    </li>
  );
}

export function IncomingLeads({ stats, now }: { stats: StudioStats; now: number }) {
  const live = stats.connected && !stats.error;
  const leads = live ? stats.recent.slice(0, SHOWN) : [];
  const total = live ? (stats.leadsWeek ?? 0) : 0;
  const more = total - leads.length;

  return (
    <div id="demandes" className="scroll-mt-24">
      <Panel>
        <PanelTitle
          kicker="Accueil"
          title="Demandes entrantes"
          action={live && total > 0 ? <p className="text-[13px] text-muted">{count(total, "demande")} sur 7&nbsp;jours</p> : undefined}
        />

        {!stats.connected ? (
          <EmptyState icon={<InboxIcon />} title="Pas encore branché">
            Les demandes du site apparaîtront ici dès que Supabase sera connecté.
          </EmptyState>
        ) : stats.error ? (
          <EmptyState icon={<AlertIcon />} title="Lecture impossible">
            Supabase est configuré, mais la lecture des demandes a échoué. Recharge la page dans un instant.
          </EmptyState>
        ) : leads.length === 0 ? (
          <EmptyState icon={<InboxIcon />} title={"Aucune demande sur 7\u00a0jours"}>
            Les mini-audits, demandes de rappel et messages de l’assistant s’afficheront ici dès leur arrivée.
          </EmptyState>
        ) : (
          <>
            <div
              aria-hidden
              className="mt-6 hidden border-b border-line pb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted lg:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1.3fr)_7.5rem] lg:gap-x-6"
            >
              <span>Contact</span>
              <span>Type et échéance</span>
              <span>Estimation</span>
              <span className="text-right">Reçue</span>
            </div>
            <ul className="mt-5 divide-y divide-line lg:mt-4">
              {leads.map((lead) => (
                <LeadItem key={lead.id} lead={lead} now={now} />
              ))}
            </ul>
            {more > 0 && (
              <p className="mt-5 border-t border-line pt-4 text-[13px] text-muted">
                Et {count(more, "autre demande", "autres demandes")} sur les 7&nbsp;derniers jours.
              </p>
            )}
          </>
        )}
      </Panel>
    </div>
  );
}
