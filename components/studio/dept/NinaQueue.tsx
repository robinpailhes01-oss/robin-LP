import Link from "next/link";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { Panel, PanelTitle, shortDate } from "@/components/studio/ui";
import type { Agent } from "@/lib/studio/agents";
import type { LeadRow, StudioStats } from "@/lib/studio/data";
import { de, tint } from "@/components/studio/agent/format";

/**
 * « La file de Nina » : les dernières demandes du site, lues dans Supabase côté serveur.
 * On n’affiche que le type, l’entreprise (ou le prénom), l’échéance et la date : ni email, ni téléphone.
 */

/** Libellés des types connus. `kind` vient du formulaire public : lu uniquement via Object.hasOwn, jamais affiché brut. */
const KIND: Record<string, string> = {
  "mini-audit": "Mini-audit",
  rappel: "Rappel demandé",
  assistant: "Message de l’assistant",
  audit: "Demande d’audit",
};

const URGENT = "Dès que possible";

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-6 rounded-[20px] border border-dashed border-line bg-paper px-5 py-8 text-center">
      <p className="font-display text-[16px] font-bold text-night">{title}</p>
      <p className="mx-auto mt-1.5 max-w-[30rem] text-[14px] leading-[1.5] text-muted">{text}</p>
    </div>
  );
}

function Row({ lead, accent }: { lead: LeadRow; accent: string }) {
  const urgent = lead.timing === URGENT;
  const callback = lead.kind === "rappel";
  const who = lead.company?.trim() || lead.name?.trim() || "Sans nom";
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2 py-4">
      <p className="min-w-0 truncate text-[15px] font-semibold text-night">{who}</p>
      <p className="text-right text-[13px] text-muted">
        <time dateTime={lead.created_at}>{shortDate(lead.created_at)}</time>
      </p>
      <div className="col-span-2 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ${callback ? "text-night" : "bg-mist text-ink"}`}
          style={callback ? { background: tint(accent, 14) } : undefined}
        >
          {Object.hasOwn(KIND, lead.kind) ? KIND[lead.kind] : "Autre demande"}
        </span>
        {urgent ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-night px-2.5 py-1 text-[12px] font-semibold text-white">
            <span aria-hidden className="size-1.5 rounded-full bg-white" />
            {URGENT}
          </span>
        ) : lead.timing ? (
          <span className="inline-flex items-center rounded-full border border-line px-2.5 py-1 text-[12px] font-medium text-ink">{lead.timing}</span>
        ) : (
          <span className="text-[12px] text-muted">Échéance non précisée</span>
        )}
      </div>
    </li>
  );
}

export function NinaQueue({ stats, owner, accent }: { stats: StudioStats; owner?: Agent; accent: string }) {
  const name = owner?.name ?? "Nina";
  const rows = stats.recent;
  const total = stats.leadsWeek;

  return (
    <Panel>
      <PanelTitle
        kicker="Demandes du site · 7 derniers jours"
        title={`La file ${de(name)}`}
        action={
          owner ? (
            <Link href={`/studio/agents/${owner.id}`} className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line py-1 pl-1 pr-4 text-[14px] font-semibold text-night hover:bg-mist motion-safe:transition-colors">
              <span aria-hidden className="flex">
                <AgentAvatar agent={owner} size={34} />
              </span>
              Fiche {de(name)}
            </Link>
          ) : null
        }
      />
      {owner && owner.status !== "actif" && (
        <p className="mt-2 max-w-[42rem] text-[14px] leading-[1.5] text-muted">
          Les demandes arrivent ici telles quelles. Les fiches d’appel viendront quand {name} aura fini son entraînement.
        </p>
      )}

      {!stats.connected ? (
        <Empty title="Supabase pas encore connecté" text="Les mini-audits et les demandes de rappel du site s’afficheront ici dès que la base sera branchée." />
      ) : stats.error ? (
        <Empty title="Lecture impossible pour l’instant" text="Supabase est configuré mais n’a pas répondu. Recharge la page dans un moment." />
      ) : rows.length === 0 ? (
        <Empty title="Aucune demande cette semaine" text="Rien n’est arrivé du site sur les 7 derniers jours." />
      ) : (
        <>
          <ul className="mt-4 divide-y divide-line">
            {rows.map((r) => (
              <Row key={r.id} lead={r} accent={accent} />
            ))}
          </ul>
          {total !== null && total > rows.length && (
            <p className="mt-2 border-t border-line pt-4 text-[13px] text-muted">
              Les {rows.length} plus récentes sur {total} reçues en 7&nbsp;jours.
            </p>
          )}
        </>
      )}
    </Panel>
  );
}
