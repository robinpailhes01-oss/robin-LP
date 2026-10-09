import type { CSSProperties } from "react";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { FadeIn } from "@/components/studio/fx/FadeIn";
import { LiveDot } from "@/components/studio/fx/LiveDot";
import { TypeText } from "@/components/studio/fx/TypeText";
import { deptGlow } from "@/components/studio/fx/tokens";
import { statusLabel, type Agent } from "@/lib/studio/agents";
import { glow, typo } from "./format";
import { Lock, Send } from "./icons";

/**
 * Discussion verrouillée (étape 1). Le seul message affiché est la présentation de l’agent (sa tagline),
 * qui s’écrit à l’entrée dans l’écran. Pas de faux échange : le champ est désactivé jusqu’au branchement à Claude.
 */
export function AgentChat({ agent }: { agent: Agent }) {
  const accent = deptGlow(agent.department);
  const noteId = `discussion-note-${agent.id}`;
  const dotsMask = "radial-gradient(ellipse 70% 80% at 30% 60%, #000 10%, transparent 75%)";

  return (
    <FadeIn
      as="section"
      trigger="inView"
      id="discussion"
      aria-labelledby="discussion-titre"
      className="flex scroll-mt-32 flex-col sm:scroll-mt-24"
      style={{ "--accent": accent } as CSSProperties}
    >
      <div className="studio-glass studio-glass--solid relative flex flex-1 flex-col overflow-hidden rounded-[28px]">
        <header className="relative flex items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <AgentAvatar agent={agent} size={44} ring={accent} decorative />
            <div className="min-w-0">
              <h2 id="discussion-titre" className="font-display text-[18px] font-bold leading-[1.2] tracking-[-0.015em] text-white">
                Discussion avec {agent.name}
              </h2>
              <p className="text-[13px] text-white/65 text-pretty">{agent.role}</p>
              {/* Statut écrit en toutes lettres (pas de pastille de présence sur l’avatar : l’agent ne tourne pas encore). */}
              <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-white/70">
                <LiveDot status={agent.status} size={6} />
                {statusLabel[agent.status]}
              </p>
            </div>
          </div>
          <span className="studio-chip shrink-0">
            <Lock size={13} className="opacity-80" />
            Verrouillée
          </span>
        </header>

        {/* La seule bulle, posée contre le champ comme dans une vraie discussion, avec son sur-titre aligné sur elle (pas centré au-dessus). */}
        <div className="relative flex flex-1 flex-col justify-end px-5 py-6 sm:px-6 sm:py-7">
          <span aria-hidden className="studio-dots absolute inset-0 opacity-70" style={{ maskImage: dotsMask, WebkitMaskImage: dotsMask }} />
          <span aria-hidden className="studio-halo absolute -left-20 bottom-[-40%] size-80 opacity-60 [--halo:var(--accent)]" />
          <p className="studio-kicker relative pl-[48px]">Présentation</p>
          <div className="relative mt-4 flex items-end gap-3">
            <AgentAvatar agent={agent} size={36} ring={accent} decorative className="mb-0.5" />
            <div className="min-w-0 max-w-[34rem]">
              <p className="mb-1.5 pl-1 text-[12px] font-semibold text-white/65">{agent.name}</p>
              <div
                className="rounded-[22px] rounded-bl-md border px-4 py-3"
                style={{
                  borderColor: glow(accent, 32),
                  background: `linear-gradient(180deg, ${glow(accent, 18)}, ${glow(accent, 7)})`,
                  boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.08), 0 14px 40px -22px ${glow(accent, 70)}`,
                }}
              >
                <TypeText as="p" text={typo(agent.tagline)} caret={accent} speed={22} delay={0.35} className="text-[15px] leading-[1.55] text-white/90" />
              </div>
            </div>
          </div>
        </div>

        {/* Champ désactivé, et qui en a l’air : atténué, bordure en pointillés, cadenas dans le champ. */}
        <div className="relative border-t border-white/[0.08] px-5 py-4 sm:px-6">
          <label htmlFor={`message-${agent.id}`} className="sr-only">
            Message pour {agent.name}
          </label>
          <div className="flex items-center gap-2.5 rounded-full border border-dashed border-white/20 py-1 pl-4 pr-1.5 opacity-60">
            <Lock size={16} className="text-white/70" />
            <input
              id={`message-${agent.id}`}
              type="text"
              disabled
              aria-describedby={noteId}
              placeholder="Disponible à l’étape 2"
              className="min-h-11 min-w-0 flex-1 cursor-not-allowed bg-transparent text-[16px] text-white outline-none placeholder:text-white/60"
            />
            <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full border border-dashed border-white/15 text-white/45">
              <Send size={18} />
            </span>
          </div>
          <p id={noteId} className="mt-3 flex items-start gap-2 text-[13px] leading-[1.45] text-white/65">
            <Lock size={14} className="mt-px" />
            La discussion arrive à l’étape&nbsp;2 (branchement à Claude).
          </p>
        </div>
      </div>
    </FadeIn>
  );
}
