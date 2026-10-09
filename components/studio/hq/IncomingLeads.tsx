import type { CSSProperties, ReactNode } from "react";
import type { LeadRow, StudioStats } from "@/lib/studio/data";
import { shortDate } from "@/components/studio/ui";
import { Stagger } from "@/components/studio/fx/FadeIn";
import { LiveDot } from "@/components/studio/fx/LiveDot";
import { OrbitRing } from "@/components/studio/fx/OrbitRing";
import { DEPT_GLOW, GLACIER, POWDER } from "@/components/studio/fx/tokens";
import { LEAD_NO_NAME, leadKindLabel } from "@/components/studio/leadKinds";
import { InboxIcon } from "./icons";
import { count, typo } from "./format";

/**
 * « Demandes entrantes » : les 5 dernières demandes du site (7 derniers jours), en liste de verre.
 * Composant serveur : seuls le nom, l’entreprise, le type, l’échéance, l’estimation et la date
 * sont rendus. L’email et le téléphone ne sont jamais lus ni envoyés au navigateur.
 */
const SHOWN = 5;
const URGENT = "Dès que possible";
const NBSP = " ";

/**
 * Couleur de chaque type connu (les noms viennent de leadKinds.ts, communs au QG et à la file de Nina).
 * `kind` vient du formulaire public : lu uniquement via Object.hasOwn (pas de clé héritée comme « constructor »).
 */
const KIND_COLOR: Record<string, string> = {
  "mini-audit": DEPT_GLOW.prospection,
  rappel: "#F5C27A",
  assistant: GLACIER,
  audit: DEPT_GLOW.prospection,
};

function kindOf(kind: string) {
  const color = typeof kind === "string" && Object.hasOwn(KIND_COLOR, kind) ? KIND_COLOR[kind] : POWDER;
  return { label: leadKindLabel(kind), color };
}

function KindPill({ kind }: { kind: string }) {
  const k = kindOf(kind);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[12px] font-semibold leading-[1.2] text-white/85">
      <span aria-hidden className="size-1.5 rounded-full" style={{ background: k.color, boxShadow: `0 0 8px ${k.color}` }} />
      {k.label}
    </span>
  );
}

/** « Dès que possible » : pastille ambrée lumineuse, point qui pulse et reflet qui la balaie de temps en temps. */
function UrgentPill() {
  return (
    <span
      className="studio-shimmer inline-flex items-center gap-2 rounded-full border border-[#F5C27A]/35 bg-[#F5C27A]/[0.1] px-2.5 py-1 text-[12px] font-semibold leading-[1.2] text-[#FBDDAE] shadow-[0_0_22px_-6px_rgb(245_194_122/0.7)] [--shimmer-delay:2s] [--shimmer-dur:5.5s]"
    >
      <LiveDot tone="warn" size={6} />
      {URGENT}
    </span>
  );
}

/** Initiale du contact dans un disque teinté par le type de demande. Décoratif. */
function Monogram({ lead }: { lead: LeadRow }) {
  const k = kindOf(lead.kind);
  const initial = Array.from(lead.name?.trim() || lead.company?.trim() || "?")[0]?.toUpperCase() ?? "?";
  return (
    <span
      aria-hidden
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full font-display text-[15px] font-bold text-white sm:size-11"
      style={
        {
          background: `radial-gradient(circle at 30% 25%, color-mix(in srgb, ${k.color} 45%, #0A1324), #0A1324 75%)`,
          boxShadow: `0 0 0 1px color-mix(in srgb, ${k.color} 40%, transparent), 0 8px 24px -10px ${k.color}`,
        } as CSSProperties
      }
    >
      {initial}
    </span>
  );
}

function EmptyState({ icon, title, tone, children }: { icon: ReactNode; title: string; tone: string; children: ReactNode }) {
  return (
    <div className="relative flex flex-col items-center overflow-hidden px-6 py-12 text-center sm:py-16">
      <span aria-hidden className="studio-halo absolute left-1/2 top-2 size-64 -translate-x-1/2 opacity-45" style={{ "--halo": tone } as CSSProperties} />
      <span className="relative inline-flex">
        <span
          aria-hidden
          className="relative inline-flex size-14 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]"
          style={{ color: tone }}
        >
          {icon}
        </span>
        <OrbitRing color={tone} rings={1} inset="-34%" speed={1.4} />
      </span>
      <p className="relative mt-9 font-display text-[19px] font-bold tracking-[-0.02em] text-white">{title}</p>
      <p className="relative mt-2 max-w-[46ch] text-[14px] leading-[1.6] text-white/65 text-pretty">{children}</p>
    </div>
  );
}

const ROW_GRID = "lg:grid-cols-[2.75rem_minmax(0,1.5fr)_minmax(0,1.3fr)_minmax(0,1.3fr)_7.5rem]";

function LeadItem({ lead, now }: { lead: LeadRow; now: number }) {
  const urgent = lead.timing === URGENT;
  const estimate = Array.isArray(lead.estimate) ? lead.estimate.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];

  return (
    <li
      className={`relative grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3.5 gap-y-2.5 rounded-[14px] border px-3.5 py-3.5 sm:px-4 lg:items-center lg:gap-x-6 ${ROW_GRID} ${
        urgent ? "border-[#F5C27A]/20 bg-[#F5C27A]/[0.035]" : "border-white/[0.06] bg-[rgb(202_223_237/0.025)]"
      }`}
    >
      <span className="[grid-area:1/1/3/2] lg:[grid-area:1/1]">
        <Monogram lead={lead} />
      </span>

      <div className="min-w-0 self-center [grid-area:1/2]">
        <p className="font-semibold leading-[1.35] text-white [overflow-wrap:anywhere]">{lead.name?.trim() || LEAD_NO_NAME}</p>
        {lead.company?.trim() && <p className="mt-0.5 text-[13px] leading-[1.4] text-white/62 [overflow-wrap:anywhere]">{lead.company}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2 [grid-area:2/2/3/-1] lg:[grid-area:1/3]">
        <KindPill kind={lead.kind} />
        {urgent ? (
          <UrgentPill />
        ) : lead.timing ? (
          <span className="text-[13px] text-white/62">
            <span className="sr-only">Échéance{NBSP}: </span>
            {lead.timing}
          </span>
        ) : null}
      </div>

      {estimate.length > 0 ? (
        <p className="text-[13px] leading-[1.45] text-white/75 [grid-area:3/2/4/-1] lg:[grid-area:1/4]">
          <span className="text-white/62 lg:sr-only">Estimation{NBSP}: </span>
          {typo(estimate.join(" · "))}
        </p>
      ) : (
        <p className="hidden text-[13px] text-white/62 lg:block lg:[grid-area:1/4]">Sans estimation</p>
      )}

      <p className="studio-num self-start whitespace-nowrap pt-0.5 text-right text-[13px] text-white/62 [grid-area:1/3] lg:self-center lg:pt-0 lg:[grid-area:1/5]">
        <time dateTime={lead.created_at}>{shortDate(lead.created_at, now)}</time>
      </p>
    </li>
  );
}

export function IncomingLeads({ stats, now }: { stats: StudioStats; now: number }) {
  // Affiché seulement avec une lecture réussie (sinon : module « Branchement », HqWiring).
  if (!stats.connected || stats.error) return null;
  const leads = stats.recent.slice(0, SHOWN);
  const total = stats.leadsWeek ?? 0;
  const more = total - leads.length;

  return (
    <section id="demandes" aria-labelledby="demandes-titre" className="studio-glass scroll-mt-32 overflow-hidden rounded-[28px] sm:scroll-mt-24">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.07] px-5 py-5 sm:px-7 sm:py-6">
        <div className="min-w-0">
          <p className="studio-kicker">Accueil</p>
          <h3 id="demandes-titre" className="mt-2 font-display text-[24px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-[26px]">
            Demandes entrantes
          </h3>
        </div>
        {total > 0 && (
          <p className="studio-chip">
            <LiveDot tone="live" size={6} />
            {count(total, "demande")} sur 7{NBSP}jours
          </p>
        )}
      </header>

      {leads.length === 0 ? (
        <EmptyState icon={<InboxIcon />} title={`Aucune demande sur 7${NBSP}jours`} tone={DEPT_GLOW.prospection}>
          Les mini-audits, demandes de rappel et messages de l’assistant s’afficheront ici dès leur arrivée.
        </EmptyState>
      ) : (
        <div className="p-3 sm:p-4">
          <div
            aria-hidden
            className={`hidden px-4 pb-3 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/62 lg:grid lg:gap-x-6 ${ROW_GRID}`}
          >
            <span />
            <span>Contact</span>
            <span>Type et échéance</span>
            <span>Estimation</span>
            <span className="text-right">Reçue</span>
          </div>
          <Stagger as="ul" trigger="inView" step={0.07} y={12} className="grid gap-2">
            {leads.map((lead) => (
              <LeadItem key={lead.id} lead={lead} now={now} />
            ))}
          </Stagger>
          {more > 0 && (
            <p className="mt-3 px-2 pb-1 pt-2 text-[13px] text-white/62">
              Et {count(more, "autre demande", "autres demandes")} sur les 7{NBSP}derniers jours.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
