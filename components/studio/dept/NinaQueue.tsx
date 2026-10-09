import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { shortDate } from "@/components/studio/ui";
import { CountUp } from "@/components/studio/fx/CountUp";
import { FadeIn, Stagger } from "@/components/studio/fx/FadeIn";
import { GlassCard } from "@/components/studio/fx/GlassCard";
import { LiveDot } from "@/components/studio/fx/LiveDot";
import { TONE_COLOR } from "@/components/studio/fx/tokens";
import type { Agent } from "@/lib/studio/agents";
import type { LeadRow, StudioStats } from "@/lib/studio/data";
import { de, glow } from "@/components/studio/agent/format";
import { EmptyState, SectionHeading } from "@/components/studio/agent/kit";
import { Alert, ArrowRight, Database, Globe, Inbox, Phone, Sparkle } from "@/components/studio/agent/icons";

/**
 * « La file de Nina » : les dernières demandes du site, lues dans Supabase côté serveur (composant serveur).
 * On n’affiche que le type, l’entreprise (ou le prénom), l’échéance et la date : ni email, ni téléphone.
 * Aucune donnée de demande n’est passée en props à un composant client : les rangées sont rendues ici.
 */

/** Libellés des types connus. `kind` vient du formulaire public : lu uniquement via Object.hasOwn, jamais affiché brut. */
const KIND: Record<string, string> = {
  "mini-audit": "Mini-audit",
  rappel: "Rappel demandé",
  assistant: "Message de l’assistant",
  audit: "Demande d’audit",
};

const URGENT = "Dès que possible";
const AMBER = TONE_COLOR.warn;

function kindIcon(kind: string): ReactNode {
  if (kind === "rappel") return <Phone size={16} />;
  if (kind === "mini-audit" || kind === "audit") return <Sparkle size={16} />;
  if (kind === "assistant") return <Globe size={16} />;
  return <Inbox size={16} />;
}

function Row({ lead, accent }: { lead: LeadRow; accent: string }) {
  const urgent = lead.timing === URGENT;
  const callback = lead.kind === "rappel";
  const who = lead.company?.trim() || lead.name?.trim() || "Sans nom";
  return (
    <li className="studio-glass studio-glass--subtle grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-2 rounded-[14px] px-3.5 py-3.5 sm:px-4">
      <span
        aria-hidden
        className="row-span-2 flex size-10 items-center justify-center self-center rounded-[12px] border"
        style={{
          color: callback ? accent : "rgb(226 234 245 / 0.8)",
          borderColor: callback ? glow(accent, 40) : "rgb(255 255 255 / 0.1)",
          background: callback ? glow(accent, 12) : "rgb(255 255 255 / 0.04)",
        }}
      >
        {kindIcon(lead.kind)}
      </span>
      <p className="min-w-0 truncate text-[15px] font-semibold text-white">{who}</p>
      <p className="studio-num text-right text-[13px] text-white/60">
        <time dateTime={lead.created_at}>{shortDate(lead.created_at)}</time>
      </p>
      <div className="col-span-2 col-start-2 flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-semibold leading-[1.3]"
          style={
            callback
              ? { borderColor: glow(accent, 45), background: glow(accent, 14), color: "#DCE8FF" }
              : { borderColor: "rgb(255 255 255 / 0.1)", background: "rgb(255 255 255 / 0.04)", color: "rgb(226 234 245 / 0.8)" }
          }
        >
          {Object.hasOwn(KIND, lead.kind) ? KIND[lead.kind] : "Autre demande"}
        </span>
        {urgent ? (
          <span
            className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[12px] font-semibold leading-[1.3]"
            style={{ borderColor: glow(AMBER, 45), background: glow(AMBER, 12), color: "#F8DDB3" } as CSSProperties}
          >
            <LiveDot tone="warn" size={6} />
            {URGENT}
          </span>
        ) : lead.timing ? (
          <span className="inline-flex items-center rounded-full border border-white/10 px-2.5 py-1 text-[12px] font-medium leading-[1.3] text-white/75">{lead.timing}</span>
        ) : (
          <span className="text-[12px] text-white/60">Échéance non précisée</span>
        )}
      </div>
    </li>
  );
}

export function NinaQueue({ stats, owner, accent }: { stats: StudioStats; owner?: Agent; accent: string }) {
  const name = owner?.name ?? "Nina";
  const rows = stats.recent;
  const total = stats.connected && !stats.error ? stats.leadsWeek : null;

  return (
    <section aria-labelledby="file-titre">
      <FadeIn trigger="inView">
        <SectionHeading
          id="file-titre"
          kicker="Demandes du site · 7 derniers jours"
          title={`La file ${de(name)}`}
          accent={accent}
          action={
            owner ? (
              <Link
                href={`/studio/agents/${owner.id}`}
                className="studio-btn studio-btn--ghost min-h-12 gap-2.5 py-1 pl-1.5 pr-4 text-[14px]"
              >
                <AgentAvatar agent={owner} size={36} ring={accent} decorative />
                Fiche {de(name)}
                <ArrowRight size={15} className="opacity-70" />
              </Link>
            ) : null
          }
        >
          {owner && owner.status !== "actif"
            ? `Les demandes arrivent ici telles quelles. Les fiches d’appel viendront quand ${name} aura fini son entraînement.`
            : undefined}
        </SectionHeading>
      </FadeIn>

      <GlassCard variant="raised" pad="none" radius="xl" className="mt-8 overflow-hidden">
        <span aria-hidden className="studio-halo absolute -right-24 -top-32 size-96 opacity-60" style={{ "--halo": accent } as CSSProperties} />
        <div className="relative p-4 sm:p-6 lg:p-8">
          {/* En-tête du panneau : le total réel de la semaine, seulement s’il a vraiment été lu. */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-1 pb-5 sm:pb-6">
            <p className="flex items-center gap-2.5 text-[14px] font-medium text-white/75">
              <LiveDot tone={total !== null ? "ok" : stats.error ? "error" : "idle"} pulse={total !== null} size={7} />
              {total !== null ? "Lu en direct dans Supabase" : stats.error ? "Lecture impossible" : "Pas encore branché"}
            </p>
            {total !== null && (
              <p className="flex items-baseline gap-2 text-[14px] text-white/70">
                <span className="font-display text-[32px] font-extrabold leading-none tracking-[-0.03em] text-white">
                  <CountUp value={total} />
                </span>
                {total > 1 ? "demandes en 7 jours" : "demande en 7 jours"}
              </p>
            )}
          </div>
          <span aria-hidden className="studio-rule block" />

          <div className="pt-5 sm:pt-6">
            {!stats.connected ? (
              <EmptyState icon={<Database size={20} />} title="Supabase pas encore connecté">
                Les mini-audits et les demandes de rappel du site s’afficheront ici dès que la base sera branchée.
              </EmptyState>
            ) : stats.error ? (
              <EmptyState icon={<Alert size={20} />} title="Lecture impossible pour l’instant">
                Supabase est configuré mais n’a pas répondu. Recharge la page dans un moment.
              </EmptyState>
            ) : rows.length === 0 ? (
              <EmptyState icon={<Inbox size={20} />} title="Aucune demande cette semaine">
                Rien n’est arrivé du site sur les 7 derniers jours.
              </EmptyState>
            ) : (
              <>
                <Stagger as="ul" trigger="inView" step={0.05} className="grid gap-2">
                  {rows.map((r) => (
                    <Row key={r.id} lead={r} accent={accent} />
                  ))}
                </Stagger>
                {total !== null && total > rows.length && (
                  <p className="mt-4 px-1 text-[13px] text-white/60">
                    Les {rows.length} plus récentes sur {total} reçues en 7&nbsp;jours.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
