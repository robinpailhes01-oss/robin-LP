import Link from "next/link";
import { statusLabel, type Agent } from "@/lib/studio/agents";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { StatusPill } from "@/components/studio/ui";

type WorkstationAgent = Pick<Agent, "id" | "name" | "role" | "status" | "avatar">;

const NBSP = "\u00a0";

/**
 * Un poste de travail : le plateau du bureau (un petit écran) dans la couleur du département,
 * l’agent assis devant (son anneau blanc passe au-dessus du plateau), son prénom, son rôle et son statut.
 * Lien vers sa fiche. Placé au-dessus du lien de la pièce (z-10).
 */
export function Workstation({ agent, accent, size = 64 }: { agent: WorkstationAgent; accent: string; size?: number }) {
  return (
    <Link
      href={`/studio/agents/${agent.id}`}
      aria-label={`${agent.name}, ${agent.role}, ${statusLabel[agent.status].toLowerCase()}${NBSP}: ouvrir sa fiche`}
      className="relative z-10 flex h-full flex-col items-center rounded-[22px] border border-line bg-white px-3 pb-4 pt-3 text-center shadow-[0_1px_2px_rgba(23,38,61,0.05)] transition-[transform,box-shadow,border-color] duration-200 ease-luma hover:-translate-y-0.5 hover:border-powder hover:shadow-[0_16px_32px_-20px_rgba(23,38,61,0.4)] focus-visible:rounded-[22px]! motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span aria-hidden className="relative block h-9 w-full rounded-[14px]" style={{ background: `color-mix(in srgb, ${accent} 9%, white)` }}>
        <span className="absolute left-1/2 top-2 h-4 w-10 -translate-x-1/2 rounded-[4px]" style={{ background: `color-mix(in srgb, ${accent} 35%, white)` }} />
      </span>
      <span aria-hidden className="relative z-[1] -mt-5 rounded-full bg-white p-1">
        <AgentAvatar agent={{ name: agent.name, avatar: agent.avatar }} size={size} animated />
      </span>
      <span className="mt-2 font-display text-[17px] font-bold leading-tight tracking-[-0.01em] text-night">{agent.name}</span>
      <span className="mt-1 text-[13px] leading-[1.35] text-muted text-balance">{agent.role}</span>
      <span className="mt-auto pt-3">
        <StatusPill status={agent.status} />
      </span>
    </Link>
  );
}
