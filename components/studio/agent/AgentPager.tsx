import Link from "next/link";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { agents, type Agent } from "@/lib/studio/agents";
import { ArrowLeft, ArrowRight } from "./icons";

/** Navigation agent précédent / suivant, en boucle sur toute l’équipe. */
export function AgentPager({ agent }: { agent: Agent }) {
  const i = agents.findIndex((a) => a.id === agent.id);
  if (i < 0 || agents.length < 2) return null;
  const prev = agents[(i - 1 + agents.length) % agents.length];
  const next = agents[(i + 1) % agents.length];
  const card =
    "group flex min-h-11 items-center gap-3 rounded-[20px] border border-line bg-white p-4 hover:border-powder hover:bg-paper motion-safe:transition-colors sm:gap-4";

  return (
    <nav aria-label="Autres agents" className="mt-10 grid gap-3 sm:grid-cols-2">
      <Link href={`/studio/agents/${prev.id}`} className={card} rel="prev">
        <ArrowLeft size={18} className="text-muted motion-safe:transition-transform group-hover:-translate-x-0.5" />
        <Who agent={prev} label="Précédent" />
      </Link>
      {next.id !== prev.id && (
        <Link href={`/studio/agents/${next.id}`} className={`${card} flex-row-reverse text-right sm:col-start-2`} rel="next">
          <ArrowRight size={18} className="text-muted motion-safe:transition-transform group-hover:translate-x-0.5" />
          <Who agent={next} label="Suivant" reverse />
        </Link>
      )}
    </nav>
  );
}

function Who({ agent, label, reverse = false }: { agent: Agent; label: string; reverse?: boolean }) {
  return (
    <span className={`flex min-w-0 flex-1 items-center gap-3 ${reverse ? "flex-row-reverse" : ""}`}>
      <span aria-hidden className="flex">
        <AgentAvatar agent={agent} size={44} />
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
        <span className="block text-[15px] font-semibold text-night">{agent.name}</span>
        <span className="block truncate text-[13px] text-muted">{agent.role}</span>
      </span>
    </span>
  );
}
