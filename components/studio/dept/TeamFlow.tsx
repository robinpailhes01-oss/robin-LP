import Link from "next/link";
import type { ReactNode } from "react";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { Panel, PanelTitle } from "@/components/studio/ui";
import { agents, agentsOf, departments, type Agent, type Department } from "@/lib/studio/agents";
import { de, listFr, plural, tint, typo } from "@/components/studio/agent/format";
import { ArrowRight, Calendar, Chevron, Clock, Globe, Phone } from "@/components/studio/agent/icons";

/**
 * « Comment l’équipe travaille » : schémas de flux d’un département ouvert.
 * Le schéma décrit le circuit prévu ; il ne prétend pas que les agents tournent déjà.
 */

type Step = { key: string; node: ReactNode; title: string; detail: string; when: string };

const COLS: Record<number, string> = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };

function byId(id: string) {
  return agents.find((a) => a.id === id);
}

/** Pastille d’étape : l’avatar de l’agent (lien vers sa fiche), entouré d’un liseré à l’accent du département. */
function AgentNode({ agent, accent }: { agent: Agent; accent: string }) {
  return (
    <Link
      href={`/studio/agents/${agent.id}`}
      aria-label={`Fiche ${de(agent.name)}`}
      className="flex rounded-full motion-safe:transition-transform motion-safe:duration-200 hover:-translate-y-0.5"
      style={{ boxShadow: `0 0 0 4px #fff, 0 0 0 5px ${tint(accent, 40)}` }}
    >
      <AgentAvatar agent={agent} size={56} />
    </Link>
  );
}

/** Pastille d’étape hors agent : le site, ou toi. */
function IconNode({ children, tone }: { children: ReactNode; tone: "site" | "robin" }) {
  return (
    <span
      aria-hidden
      className={`flex size-14 items-center justify-center rounded-full ${tone === "robin" ? "bg-night text-white" : "border border-line bg-mist text-night"}`}
      style={{ boxShadow: "0 0 0 4px #fff" }}
    >
      {children}
    </span>
  );
}

/** Ligne fine + chevron entre deux étapes : verticale sur mobile, horizontale à partir de lg. */
function Connector({ accent }: { accent: string }) {
  return (
    <span
      aria-hidden
      className="absolute bottom-2 left-[27.5px] top-[68px] flex -translate-x-1/2 flex-col items-center lg:bottom-auto lg:left-[calc(50%_+_40px)] lg:right-[calc(-50%_+_24px)] lg:top-[28px] lg:translate-x-0 lg:-translate-y-1/2 lg:flex-row"
      style={{ color: tint(accent, 55) }}
    >
      <span className="w-px flex-1 lg:h-px lg:w-auto" style={{ background: "currentColor" }} />
      <Chevron className="-mt-1 rotate-90 lg:-ml-1 lg:mt-0 lg:rotate-0" />
    </span>
  );
}

function FlowLane({ kicker, title, steps, accent }: { kicker: string; title: string; steps: Step[]; accent: string }) {
  return (
    <div>
      <p className="t-kicker">{kicker}</p>
      <h3 className="mt-1 font-display text-[18px] font-bold tracking-[-0.015em] text-night">{title}</h3>
      <ol className={`mt-6 grid lg:gap-4 ${COLS[steps.length] ?? "lg:grid-cols-4"}`}>
        {steps.map((s, i) => (
          <li key={s.key} className="relative flex gap-4 pb-8 last:pb-0 lg:flex-col lg:items-center lg:pb-0 lg:text-center">
            {i < steps.length - 1 && <Connector accent={accent} />}
            <div className="relative shrink-0">{s.node}</div>
            <div className="min-w-0 pt-1 lg:max-w-[16rem] lg:pt-0">
              <p className="font-display text-[16px] font-bold leading-[1.25] tracking-[-0.01em] text-night">{s.title}</p>
              <p className="mt-1 text-[14px] leading-[1.5] text-ink">{typo(s.detail)}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted">
                <Clock size={13} />
                {typo(s.when)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function PlanNote() {
  return <p className="mt-2 max-w-[40rem] text-[14px] leading-[1.5] text-muted">Le circuit prévu. Il démarrera quand chaque agent aura fini son entraînement avec toi.</p>;
}

/** Prospection : le flux sortant (on va chercher les PME) et le flux entrant (les demandes du site). */
export function ProspectionFlow({ department }: { department: Department }) {
  const a = department.accent;
  const leo = byId("leo");
  const ines = byId("ines");
  const hugo = byId("hugo");
  const nina = byId("nina");

  const outbound: Step[] = [
    leo && { key: "leo", node: <AgentNode agent={leo} accent={a} />, title: `${leo.name} trouve 10 PME`, detail: "Secteur, contact, et le signal qui prouve le besoin.", when: leo.routine.replace(/\.$/, "") },
    ines && { key: "ines", node: <AgentNode agent={ines} accent={a} />, title: `${ines.name} écrit les emails`, detail: "Un premier email court par PME, en brouillon dans Gmail. Tu valides avant l’envoi.", when: ines.routine.replace(/\.$/, "") },
    hugo && { key: "hugo", node: <AgentNode agent={hugo} accent={a} />, title: `${hugo.name} relance`, detail: "À J+3 puis J+7, et propose deux créneaux dès qu’on lui répond oui.", when: hugo.routine.replace(/\.$/, "") },
    { key: "rdv", node: <IconNode tone="robin"><Calendar size={22} /></IconNode>, title: "Rendez-vous avec toi", detail: "Un appel découverte avec une PME intéressée.", when: "Dans ton agenda" },
  ].filter(Boolean) as Step[];

  const inbound: Step[] = [
    { key: "site", node: <IconNode tone="site"><Globe size={22} /></IconNode>, title: "Le site reçoit une demande", detail: "Un mini-audit rempli ou une demande de rappel.", when: "À tout moment" },
    nina && { key: "nina", node: <AgentNode agent={nina} accent={a} />, title: `${nina.name} prépare la fiche d’appel`, detail: "Besoin, outils, gains estimés, échéance, et la première question à poser.", when: nina.routine.replace(/\.$/, "") },
    { key: "appel", node: <IconNode tone="robin"><Phone size={22} /></IconNode>, title: "Tu appelles", detail: "Les « Dès que possible » et les rappels en premier.", when: "Fiche en main" },
  ].filter(Boolean) as Step[];

  return (
    <Panel>
      <PanelTitle kicker="Organisation" title="Comment l’équipe travaille" />
      <PlanNote />
      <div className="mt-8 grid gap-10">
        <FlowLane kicker="Flux sortant" title="On va chercher les clients" steps={outbound} accent={a} />
        <div className="border-t border-line pt-8">
          <FlowLane kicker="Flux entrant" title="Les clients viennent à toi" steps={inbound} accent={a} />
        </div>
      </div>
    </Panel>
  );
}

/** Direction : les rituels de la manager et son lien avec chaque département. */
export function DirectionFlow({ department, manager }: { department: Department; manager: Agent }) {
  const a = department.accent;
  const others = departments.filter((d) => d.id !== department.id);
  const rituals = [
    { key: "jour", time: "8 h", title: "Point du jour", when: "Chaque matin", detail: "Une seule priorité, de vente sauf exception justifiée, à partir des chiffres réels." },
    { key: "vendredi", time: "Ven.", title: "Bilan du vendredi", when: "Chaque vendredi", detail: "Envois, réponses, rendez-vous, euros encaissés, puis la direction de la semaine suivante." },
  ];

  return (
    <Panel>
      <PanelTitle kicker="Organisation" title="Comment l’équipe travaille" />
      <PlanNote />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12">
        <div>
          <p className="t-kicker">Rituels</p>
          <h3 className="mt-1 font-display text-[18px] font-bold tracking-[-0.015em] text-night">Les rendez-vous {de(manager.name)}</h3>
          <ol className="mt-6 grid gap-3">
            {rituals.map((r) => (
              <li key={r.key} className="flex gap-4 rounded-[20px] border border-line p-4 sm:p-5">
                <span
                  aria-hidden
                  className="flex size-14 shrink-0 items-center justify-center rounded-2xl font-display text-[17px] font-extrabold tracking-[-0.02em]"
                  style={{ background: tint(a, 8), color: a }}
                >
                  {r.time}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-[16px] font-bold text-night">{r.title}</p>
                  <p className="text-[13px] font-medium text-muted">{r.when}</p>
                  <p className="mt-2 text-[14px] leading-[1.5] text-ink">{r.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="t-kicker">Coordination</p>
          <h3 className="mt-1 font-display text-[18px] font-bold tracking-[-0.015em] text-night">Son lien avec chaque département</h3>
          <div className="mt-6 flex items-center gap-3">
            <Link
              href={`/studio/agents/${manager.id}`}
              aria-label={`Fiche ${de(manager.name)}`}
              className="flex rounded-full"
              style={{ boxShadow: `0 0 0 4px #fff, 0 0 0 5px ${tint(a, 30)}` }}
            >
              <AgentAvatar agent={manager} size={56} />
            </Link>
            <div className="min-w-0">
              <p className="font-display text-[16px] font-bold text-night">{manager.name}</p>
              <p className="text-[13px] text-muted">{manager.role}</p>
            </div>
          </div>
          <ul className="ml-7 mt-1">
            {others.map((d, i) => {
              const team = agentsOf(d.id);
              const last = i === others.length - 1;
              const sub = d.open
                ? team.length > 0
                  ? `Lit les résultats ${de(listFr(team.map((t) => t.name)))} et fixe la priorité.`
                  : "Ouvert, sans agent pour l’instant."
                : `Pas encore ouvert · ${plural(d.plannedRoles?.length ?? 0, "poste prévu", "postes prévus")}`;
              return (
                <li key={d.id} className="relative pl-8 pt-3">
                  <span aria-hidden className={`absolute left-0 top-0 w-px ${last ? "h-[calc(0.75rem_+_30px)]" : "h-full"}`} style={{ background: tint(a, 25) }} />
                  <span aria-hidden className="absolute left-0 top-[calc(0.75rem_+_30px)] h-px w-6" style={{ background: tint(a, 25) }} />
                  <Link
                    href={`/studio/departements/${d.id}`}
                    className={`group flex min-h-[60px] items-center gap-3 rounded-2xl border px-4 py-3 motion-safe:transition-colors ${d.open ? "border-line bg-white hover:border-powder hover:bg-paper" : "border-dashed border-line bg-paper/60 hover:bg-paper"}`}
                  >
                    <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: d.open ? d.accent : tint(d.accent, 45) }} />
                    <span className="min-w-0 flex-1">
                      <span className={`block text-[15px] font-semibold ${d.open ? "text-night" : "text-ink"}`}>{d.name}</span>
                      <span className="block text-[13px] leading-[1.45] text-muted">{sub}</span>
                    </span>
                    <ArrowRight size={16} className="text-muted motion-safe:transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Panel>
  );
}

/** Département ouvert sans schéma dédié : l’équipe dans l’ordre, avec sa routine. */
export function GenericFlow({ department, team }: { department: Department; team: Agent[] }) {
  if (team.length === 0) return null;
  const steps: Step[] = team.map((t) => ({ key: t.id, node: <AgentNode agent={t} accent={department.accent} />, title: `${t.name}, ${t.role.toLowerCase()}`, detail: t.deliverable, when: t.routine.replace(/\.$/, "") }));
  return (
    <Panel>
      <PanelTitle kicker="Organisation" title="Comment l’équipe travaille" />
      <PlanNote />
      <div className="mt-8">
        <FlowLane kicker="Circuit" title={department.name} steps={steps} accent={department.accent} />
      </div>
    </Panel>
  );
}
