import type { ReactNode } from "react";
import { agents, type Agent } from "@/lib/studio/agents";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { FlowNode, FlowStage } from "@/components/studio/fx/FlowStage";
import { POWDER } from "@/components/studio/fx/tokens";
import { CalendarIcon, GlobeIcon, PhoneIcon } from "./icons";

/**
 * Le circuit prévu de la prospection, en miniature, au pied de la pièce : flux sortant (Léo → Inès → Hugo → toi)
 * et flux entrant (le site → Nina → toi). Chaque couloir est un seul rail continu qu’une seule comète parcourt
 * (FlowStage) ; chaque nœud atteint s’éclaire brièvement. Décoratif : le sens du flux est écrit en texte.
 * Le circuit ne prétend pas tourner : la légende dit qu’il démarre après l’entraînement.
 */

function byId(id: string) {
  return agents.find((a) => a.id === id);
}

function Face({ agent, color }: { agent: Agent; color: string }) {
  return <AgentAvatar agent={{ name: agent.name, avatar: agent.avatar }} size={34} ring={color} decorative />;
}

/** Nœud hors agent : le site (verre, liseré du département) ou toi (liseré poudré lumineux, comme un portrait). */
function Glyph({ children, robin = false, color }: { children: ReactNode; robin?: boolean; color: string }) {
  return (
    <span
      className="inline-flex size-[34px] shrink-0 items-center justify-center rounded-full text-[#CADFED]"
      style={{
        background: robin ? "radial-gradient(circle at 50% 30%, rgb(202 223 237 / 0.2), rgb(10 19 36 / 0.95) 72%)" : "rgb(10 19 36 / 0.9)",
        color: robin ? "#FFFFFF" : POWDER,
        boxShadow: robin
          ? `0 0 0 2px rgb(6 11 22 / 0.92), 0 0 0 3px color-mix(in srgb, ${POWDER} 80%, transparent), 0 0 18px -2px color-mix(in srgb, ${POWDER} 60%, transparent)`
          : `0 0 0 2px rgb(6 11 22 / 0.92), 0 0 0 3px color-mix(in srgb, ${color} 45%, transparent)`,
      }}
    >
      {children}
    </span>
  );
}

function Lane({ kicker, sentence, nodes, color }: { kicker: string; sentence: string; nodes: ReactNode[]; color: string }) {
  return (
    <div className="min-w-0">
      <p className="studio-kicker text-[11px]">{kicker}</p>
      <p className="sr-only">{sentence}</p>
      <FlowStage aria-hidden color={color} segment={0.9} tail={80} className="mt-3 flex items-center justify-between">
        {nodes.map((node, i) => (
          <FlowNode key={i}>{node}</FlowNode>
        ))}
      </FlowStage>
    </div>
  );
}

export function ProspectionCircuit({ color }: { color: string }) {
  const leo = byId("leo");
  const ines = byId("ines");
  const hugo = byId("hugo");
  const nina = byId("nina");
  if (!leo || !ines || !hugo || !nina) return null;

  return (
    <div className="rounded-[20px] border border-white/[0.07] bg-[rgb(6_11_22/0.45)] p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
        <Lane
          kicker="Flux sortant"
          sentence={`${leo.name} trouve les PME, ${ines.name} écrit les emails, ${hugo.name} relance, puis rendez-vous avec toi.`}
          color={color}
          nodes={[
            <Face key="leo" agent={leo} color={color} />,
            <Face key="ines" agent={ines} color={color} />,
            <Face key="hugo" agent={hugo} color={color} />,
            <Glyph key="rdv" robin color={color}>
              <CalendarIcon className="size-4" />
            </Glyph>,
          ]}
        />
        <Lane
          kicker="Flux entrant"
          sentence={`Le site reçoit une demande, ${nina.name} prépare la fiche d’appel, puis tu appelles.`}
          color={color}
          nodes={[
            <Glyph key="site" color={color}>
              <GlobeIcon className="size-4" />
            </Glyph>,
            <Face key="nina" agent={nina} color={color} />,
            <Glyph key="appel" robin color={color}>
              <PhoneIcon className="size-4" />
            </Glyph>,
          ]}
        />
      </div>
      <p className="mt-4 text-[12.5px] leading-[1.5] text-white/62">Circuit prévu. Il démarrera quand chaque agent aura fini son entraînement avec toi.</p>
    </div>
  );
}
