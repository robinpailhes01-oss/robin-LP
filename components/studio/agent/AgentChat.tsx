import { AgentAvatar } from "@/components/studio/AgentAvatar";
import type { Agent } from "@/lib/studio/agents";
import { typo } from "./format";
import { Lock, Send } from "./icons";

/**
 * Discussion verrouillée (étape 1). Le seul message affiché est la présentation de l’agent (sa tagline).
 * Pas de faux échange : le champ est désactivé jusqu’au branchement à Claude.
 */
export function AgentChat({ agent }: { agent: Agent }) {
  const noteId = `discussion-note-${agent.id}`;
  return (
    <section id="discussion" aria-labelledby="discussion-titre" className="scroll-mt-32 overflow-hidden sm:scroll-mt-24 rounded-[24px] border border-line bg-white">
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="flex">
            <AgentAvatar agent={agent} size={40} />
          </span>
          <div className="min-w-0">
            <h2 id="discussion-titre" className="font-display text-[17px] font-bold tracking-[-0.01em] text-night">
              Discussion avec {agent.name}
            </h2>
            <p className="truncate text-[13px] text-muted">{agent.role}</p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-[12px] font-semibold text-muted">
          <Lock size={13} />
          Verrouillée
        </span>
      </header>

      <div className="bg-paper px-5 py-6 sm:px-6 sm:py-8">
        <p className="text-center text-[12px] font-medium uppercase tracking-[0.12em] text-muted">Présentation</p>
        <div className="mt-5 flex items-end gap-3">
          <span aria-hidden className="flex">
            <AgentAvatar agent={agent} size={32} />
          </span>
          <div className="min-w-0 max-w-[34rem]">
            <p className="mb-1 pl-1 text-[12px] font-semibold text-muted">{agent.name}</p>
            <p className="rounded-[20px] rounded-bl-md border border-line bg-white px-4 py-3 text-[15px] leading-[1.5] text-night">{typo(agent.tagline)}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-line px-5 py-4 sm:px-6">
        <label htmlFor={`message-${agent.id}`} className="sr-only">
          Message pour {agent.name}
        </label>
        <div className="flex items-center gap-2 rounded-full border border-line bg-paper py-1 pl-4 pr-1.5">
          <input
            id={`message-${agent.id}`}
            type="text"
            disabled
            aria-describedby={noteId}
            placeholder={`Écris à ${agent.name}…`}
            className="min-h-11 min-w-0 flex-1 bg-transparent text-[16px] text-night outline-none placeholder:text-muted disabled:cursor-not-allowed"
          />
          <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-powder text-white">
            <Send size={18} />
          </span>
        </div>
        <p id={noteId} className="mt-3 flex items-start gap-2 text-[13px] leading-[1.45] text-muted">
          <Lock size={14} className="mt-px" />
          La discussion arrive à l’étape 2 (branchement à Claude).
        </p>
      </div>
    </section>
  );
}
