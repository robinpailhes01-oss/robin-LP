import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { Beam } from "@/components/studio/fx/Beam";
import { FadeIn, Stagger } from "@/components/studio/fx/FadeIn";
import { FlowNode, FlowStage } from "@/components/studio/fx/FlowStage";
import { GlassCard } from "@/components/studio/fx/GlassCard";
import { POWDER, deptGlow } from "@/components/studio/fx/tokens";
import { agents, agentsOf, departments, type Agent, type Department } from "@/lib/studio/agents";
import { de, glow, listFr, noDot, plural, typo } from "@/components/studio/agent/format";
import { SectionHeading } from "@/components/studio/agent/kit";
import { ArrowRight, Calendar, Clock, Globe, Phone } from "@/components/studio/agent/icons";

/**
 * « Comment l’équipe travaille » : schémas de flux d’un département ouvert.
 * Chaque couloir est un seul rail continu, à la hauteur des portraits, du centre du premier nœud au centre du dernier ;
 * une seule comète le parcourt en entier et chaque nœud qu’elle atteint s’éclaire brièvement (FlowStage).
 * Les nœuds (vrais portraits, ou une icône pour le site et pour toi) sont posés sur le rail, leur texte dessous :
 * pas de boîte dans la boîte. Le schéma décrit le circuit prévu ; la note le dit : il ne prétend pas que les agents tournent déjà.
 *
 * Mise en page : en colonne (rail vertical qui passe par le centre des portraits, colonne de gauche) jusqu’à 1280 px,
 * en rangée au-delà (rail horizontal à la hauteur des portraits).
 * Le rail est décoratif : l’ordre est porté par la liste numérotée et le texte de chaque étape.
 */

type Step = { key: string; node: ReactNode; title: string; detail: string; when: string };

const PLAN_NOTE = "Le circuit prévu. Il démarrera quand chaque agent aura fini son entraînement avec toi.";

/** Colonnes en mode rangée (classes écrites en entier pour Tailwind). */
const COLS: Record<number, string> = { 2: "xl:grid-cols-2", 3: "xl:grid-cols-3", 4: "xl:grid-cols-4", 5: "xl:grid-cols-5" };

function byId(id: string) {
  return agents.find((a) => a.id === id);
}

/** Masque qui efface la trame de points vers le bas d’un panneau. */
const FADE_DOWN: CSSProperties = {
  maskImage: "linear-gradient(180deg, #000, transparent 75%)",
  WebkitMaskImage: "linear-gradient(180deg, #000, transparent 75%)",
};

/* ---------- Nœuds ---------- */

/** Nœud agent : son portrait, lien vers sa fiche (56 px, cible confortable). */
function AgentNode({ agent, accent }: { agent: Agent; accent: string }) {
  return (
    <Link
      href={`/studio/agents/${agent.id}`}
      aria-label={`Fiche ${de(agent.name)}`}
      className="flex rounded-full motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-0.5"
    >
      <AgentAvatar agent={agent} size={56} ring={accent} decorative />
    </Link>
  );
}

/**
 * Nœud hors agent : le site (verre, liseré du département), ou toi (même anneau lumineux qu’un portrait, en bleu poudré :
 * l’arrivée du circuit, sans disque blanc qui jurerait avec les portraits).
 */
function IconNode({ children, tone, accent }: { children: ReactNode; tone: "site" | "robin"; accent: string }) {
  const robin = tone === "robin";
  return (
    <span
      aria-hidden
      className="relative flex size-14 items-center justify-center rounded-full"
      style={{
        color: robin ? "#FFFFFF" : "rgb(226 234 245 / 0.85)",
        background: robin
          ? `radial-gradient(circle at 50% 28%, ${glow(POWDER, 26)}, rgb(10 19 36 / 0.96) 72%)`
          : "radial-gradient(circle at 50% 30%, rgb(202 223 237 / 0.1), rgb(10 19 36 / 0.94) 72%)",
        boxShadow: robin
          ? `0 0 0 2px rgb(6 11 22 / 0.92), 0 0 0 3px ${glow(POWDER, 80)}, 0 0 26px -2px ${glow(POWDER, 55)}, inset 0 1px 0 rgb(255 255 255 / 0.16)`
          : `0 0 0 2px rgb(6 11 22 / 0.92), 0 0 0 3px ${glow(accent, 45)}, inset 0 1px 0 rgb(255 255 255 / 0.1)`,
      }}
    >
      {children}
    </span>
  );
}

/* ---------- Couloir de flux ---------- */

function FlowLane({ kicker, title, steps, accent }: { kicker: string; title: string; steps: Step[]; accent: string }) {
  return (
    <GlassCard variant="raised" pad="none" radius="xl" className="overflow-hidden">
      <span aria-hidden className="studio-dots absolute inset-0 opacity-60" style={FADE_DOWN} />
      <span aria-hidden className="studio-halo absolute -left-24 -top-32 size-80 opacity-70" style={{ "--halo": accent } as CSSProperties} />

      <div className="relative p-5 sm:p-8 xl:p-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="studio-kicker">{kicker}</p>
            <h3 className="studio-h3 mt-1.5">{title}</h3>
          </div>
          <span className="studio-chip studio-num">{plural(steps.length, "étape", "étapes")}</span>
        </div>

        <FlowStage color={accent} segment={1.15} className="mt-8 xl:mt-10">
          <Stagger as="ol" trigger="inView" step={0.12} className={`grid gap-y-8 xl:gap-x-10 xl:gap-y-0 ${COLS[steps.length] ?? "xl:grid-cols-4"}`}>
            {steps.map((s, i) => (
              <li key={s.key} className="relative grid min-w-0 grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-x-4 xl:flex xl:flex-col xl:items-center xl:text-center">
                <FlowNode>{s.node}</FlowNode>
                <div className="min-w-0 pt-0.5 xl:mt-5 xl:pt-0">
                  <p aria-hidden className="studio-kicker studio-num text-[11px]">
                    Étape {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1.5 font-display text-[17px] font-bold leading-[1.22] tracking-[-0.015em] text-white">{s.title}</p>
                  <p className="mt-1.5 text-[14px] leading-[1.55] text-white/70 text-pretty">{typo(s.detail)}</p>
                  {/* Moment de l’étape : texte simple avec icône (jamais une pastille coupée en deux lignes). */}
                  <p className="mt-2.5 flex items-start gap-1.5 text-[13px] font-medium leading-[1.4] text-white/65 xl:justify-center">
                    <Clock size={13} className="mt-[3px] opacity-80" />
                    <span className="text-balance">{typo(s.when)}</span>
                  </p>
                </div>
              </li>
            ))}
          </Stagger>
        </FlowStage>
      </div>
    </GlassCard>
  );
}

function FlowSection({ accent, children }: { accent: string; children: ReactNode }) {
  return (
    <section aria-labelledby="organisation-titre">
      <FadeIn trigger="inView">
        <SectionHeading id="organisation-titre" kicker="Organisation" title="Comment l’équipe travaille" accent={accent}>
          {PLAN_NOTE}
        </SectionHeading>
      </FadeIn>
      {children}
    </section>
  );
}

/* ---------- Prospection ---------- */

/** Prospection : le flux sortant (on va chercher les PME) et le flux entrant (les demandes du site). */
export function ProspectionFlow({ department }: { department: Department }) {
  const a = deptGlow(department.id);
  const leo = byId("leo");
  const ines = byId("ines");
  const hugo = byId("hugo");
  const nina = byId("nina");

  const outbound = [
    leo && { key: "leo", node: <AgentNode agent={leo} accent={a} />, title: `${leo.name} trouve 10 PME`, detail: "Secteur, contact, et le signal qui prouve le besoin.", when: noDot(leo.routine) },
    ines && {
      key: "ines",
      node: <AgentNode agent={ines} accent={a} />,
      title: `${ines.name} écrit les emails`,
      detail: "Un premier email court par PME, en brouillon dans Gmail. Tu valides avant l’envoi.",
      when: noDot(ines.routine),
    },
    hugo && { key: "hugo", node: <AgentNode agent={hugo} accent={a} />, title: `${hugo.name} relance`, detail: "À J+3 puis J+7, et propose deux créneaux dès qu’on lui répond oui.", when: noDot(hugo.routine) },
    {
      key: "rdv",
      node: (
        <IconNode tone="robin" accent={a}>
          <Calendar size={22} />
        </IconNode>
      ),
      title: "Rendez-vous avec toi",
      detail: "Un appel découverte avec une PME intéressée.",
      when: "Dans ton agenda",
    },
  ].filter(Boolean) as Step[];

  const inbound = [
    {
      key: "site",
      node: (
        <IconNode tone="site" accent={a}>
          <Globe size={22} />
        </IconNode>
      ),
      title: "Le site reçoit une demande",
      detail: "Un mini-audit rempli ou une demande de rappel.",
      when: "À tout moment",
    },
    nina && {
      key: "nina",
      node: <AgentNode agent={nina} accent={a} />,
      title: `${nina.name} prépare la fiche d’appel`,
      detail: "Besoin, outils, gains estimés, échéance, et la première question à poser.",
      when: noDot(nina.routine),
    },
    {
      key: "appel",
      node: (
        <IconNode tone="robin" accent={a}>
          <Phone size={22} />
        </IconNode>
      ),
      title: "Tu appelles",
      detail: "Les « Dès que possible » et les rappels en premier.",
      when: "Fiche en main",
    },
  ].filter(Boolean) as Step[];

  return (
    <FlowSection accent={a}>
      {/* Deux couloirs côte à côte entre 1024 et 1280 px (chacun en colonne), l’un sous l’autre au-delà (chacun en rangée). */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-1">
        <FlowLane kicker="Flux sortant" title="On va chercher les clients" steps={outbound} accent={a} />
        <FlowLane kicker="Flux entrant" title="Les clients viennent à toi" steps={inbound} accent={a} />
      </div>
    </FlowSection>
  );
}

/* ---------- Direction ---------- */

/** Direction : les rituels de la manager et son lien avec chaque département (lumière vers les départements ouverts). */
export function DirectionFlow({ department, manager }: { department: Department; manager: Agent }) {
  const a = deptGlow(department.id);
  const others = departments.filter((d) => d.id !== department.id);
  const rituals = [
    { key: "jour", time: "8 h", title: "Point du jour", when: "Chaque matin", detail: "Une seule priorité, de vente sauf exception justifiée, à partir des chiffres réels." },
    { key: "vendredi", time: "Ven.", title: "Bilan du vendredi", when: "Chaque vendredi", detail: "Envois, réponses, rendez-vous, euros encaissés, puis la direction de la semaine suivante." },
  ];

  return (
    <FlowSection accent={a}>
      {/* items-start : chaque carte garde sa hauteur (les rituels ne s’étirent pas à la hauteur de la coordination). */}
      <Stagger trigger="inView" step={0.12} className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-start">
        {/* Rituels : deux rendez-vous reliés par un faisceau. */}
        <GlassCard variant="raised" pad="none" radius="xl" className="overflow-hidden">
          <span aria-hidden className="studio-dots absolute inset-0 opacity-50" style={FADE_DOWN} />
          <div className="relative p-5 sm:p-8 xl:p-10">
            <p className="studio-kicker">Rituels</p>
            <h3 className="studio-h3 mt-1.5">Les rendez-vous {de(manager.name)}</h3>
            <ol className="mt-8 grid gap-y-8">
              {rituals.map((r, i) => (
                <li key={r.key} className="relative flex gap-4 sm:gap-5">
                  <span
                    aria-hidden
                    className="studio-num relative flex size-16 shrink-0 items-center justify-center rounded-[18px] border font-display text-[19px] font-extrabold tracking-[-0.03em] text-white"
                    style={{
                      borderColor: glow(a, 40),
                      background: `linear-gradient(180deg, ${glow(a, 20)}, ${glow(a, 6)})`,
                      boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.12), 0 0 34px -10px ${a}`,
                    }}
                  >
                    {r.time}
                  </span>
                  <div className="min-w-0 pt-1">
                    <p className="font-display text-[18px] font-bold leading-[1.2] tracking-[-0.015em] text-white">{r.title}</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-medium text-white/65">
                      <Clock size={13} className="opacity-80" />
                      {r.when}
                    </p>
                    <p className="mt-2.5 text-[14px] leading-[1.55] text-white/75 text-pretty">{r.detail}</p>
                  </div>
                  {i < rituals.length - 1 && (
                    <span aria-hidden className="absolute -bottom-8 left-8 top-16 w-px" style={{ background: `linear-gradient(180deg, ${glow(a, 55)}, ${glow(a, 25)})` }} />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </GlassCard>

        {/* Coordination : un tronc qui part d’Alma, une branche par département. La lumière ne va que vers les départements ouverts. */}
        <GlassCard variant="raised" pad="none" radius="xl" className="overflow-hidden">
          <span aria-hidden className="studio-halo absolute -right-20 -top-28 size-80 opacity-60" style={{ "--halo": a } as CSSProperties} />
          <div className="relative p-5 sm:p-8 xl:p-10">
            <p className="studio-kicker">Coordination</p>
            <h3 className="studio-h3 mt-1.5">Son lien avec chaque département</h3>

            <div className="mt-8 flex items-center gap-4">
              <Link href={`/studio/agents/${manager.id}`} aria-label={`Fiche ${de(manager.name)}`} className="block shrink-0 rounded-full">
                <AgentAvatar agent={manager} size={64} ring={a} decorative />
              </Link>
              <div className="min-w-0">
                <p className="font-display text-[20px] font-extrabold leading-[1.1] tracking-[-0.025em] text-white">{manager.name}</p>
                <p className="mt-0.5 text-[13px] text-white/65">{manager.role}</p>
              </div>
            </div>

            <ul className="ml-8">
              {others.map((d, i) => {
                const team = agentsOf(d.id);
                const color = deptGlow(d.id);
                const last = i === others.length - 1;
                const sub = d.open
                  ? team.length > 0
                    ? `Lit les résultats ${de(listFr(team.map((t) => t.name)))} et fixe la priorité.`
                    : "Ouvert, sans agent pour l’instant."
                  : `Pas encore ouvert · ${plural(d.plannedRoles?.length ?? 0, "poste prévu", "postes prévus")}`;
                return (
                  <li key={d.id} className="relative flex items-center pt-3">
                    {/* Tronc : chaque rangée en dessine un tronçon ; le dernier s’arrête au milieu de sa branche. */}
                    <span aria-hidden className={`absolute left-0 top-0 w-px ${last ? "bottom-[calc(50%-6px)]" : "bottom-0"}`} style={{ background: glow(a, 38) }} />
                    <Beam orientation="horizontal" color={color} active={d.open} caps={d.open} delay={0.3 + i * 0.3} className="w-6 flex-none sm:w-10" />
                    <Link
                      href={`/studio/departements/${d.id}`}
                      className={`group flex min-h-16 min-w-0 flex-1 items-center gap-3 rounded-[14px] border px-4 py-3 motion-safe:transition-colors motion-safe:duration-300 ${
                        d.open
                          ? "border-white/[0.12] bg-[rgb(202_223_237/0.05)] hover:border-white/20 hover:bg-[rgb(202_223_237/0.08)]"
                          : "border-dashed border-white/[0.14] bg-[rgb(202_223_237/0.015)] hover:bg-[rgb(202_223_237/0.04)]"
                      }`}
                    >
                      <span
                        aria-hidden
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ background: d.open ? color : glow(color, 50), boxShadow: d.open ? `0 0 10px ${color}` : undefined }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[15px] font-semibold leading-[1.3] ${d.open ? "text-white" : "text-white/85"}`}>{d.name}</span>
                        <span className="mt-0.5 block text-[13px] leading-[1.45] text-white/60">{sub}</span>
                      </span>
                      {d.open && team.length > 0 && (
                        <span aria-hidden className="hidden shrink-0 -space-x-2 sm:flex">
                          {team.map((t) => (
                            <AgentAvatar key={t.id} agent={t} size={28} ring={color} decorative />
                          ))}
                        </span>
                      )}
                      <ArrowRight size={16} className="text-white/55 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </GlassCard>
      </Stagger>
    </FlowSection>
  );
}

/* ---------- Autres départements ouverts ---------- */

/** Département ouvert sans schéma dédié : l’équipe dans l’ordre, avec sa routine. */
export function GenericFlow({ department, team }: { department: Department; team: Agent[] }) {
  if (team.length === 0) return null;
  const a = deptGlow(department.id);
  const steps: Step[] = team.map((t) => ({
    key: t.id,
    node: <AgentNode agent={t} accent={a} />,
    title: `${t.name}, ${t.role.toLowerCase()}`,
    detail: t.deliverable,
    when: noDot(t.routine),
  }));
  return (
    <FlowSection accent={a}>
      <div className="mt-8">
        <FlowLane kicker="Circuit" title={department.name} steps={steps} accent={a} />
      </div>
    </FlowSection>
  );
}
