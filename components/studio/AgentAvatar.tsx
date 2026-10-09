import type { Agent } from "@/lib/studio/agents";

/** Provisoire : remplacé par le personnage dessiné (étape avatars). Même interface. */
export function AgentAvatar({ agent, size = 56, animated = false, className = "" }: { agent: Pick<Agent, "name" | "avatar">; size?: number; animated?: boolean; className?: string }) {
  void animated;
  return (
    <span role="img" aria-label={agent.name} className={`inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white ${className}`} style={{ width: size, height: size, background: agent.avatar.outfit, fontSize: size * 0.38 }}>
      {agent.name[0]}
    </span>
  );
}

/** Poste prévu, pas encore pourvu : silhouette en pointillés. */
export function PlannedAvatar({ size = 56, className = "" }: { size?: number; className?: string }) {
  return <span aria-hidden className={`inline-flex shrink-0 rounded-full border-2 border-dashed border-powder ${className}`} style={{ width: size, height: size }} />;
}
