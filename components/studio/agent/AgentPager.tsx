import Link from "next/link";
import type { CSSProperties } from "react";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { Stagger } from "@/components/studio/fx/FadeIn";
import { deptGlow } from "@/components/studio/fx/tokens";
import { agents, type Agent } from "@/lib/studio/agents";
import { ArrowLeft, ArrowRight } from "./icons";

/** Navigation agent précédent / suivant, en boucle sur toute l’équipe : deux cartes de verre avec portrait. */
export function AgentPager({ agent }: { agent: Agent }) {
  const i = agents.findIndex((a) => a.id === agent.id);
  if (i < 0 || agents.length < 2) return null;
  const prev = agents[(i - 1 + agents.length) % agents.length];
  const next = agents[(i + 1) % agents.length];

  return (
    <Stagger as="nav" trigger="inView" step={0.1} aria-label="Autres agents" className="mt-16 grid gap-4 sm:mt-24 sm:grid-cols-2">
      <PagerLink agent={prev} dir="prev" />
      {next.id !== prev.id && <PagerLink agent={next} dir="next" className="sm:col-start-2" />}
    </Stagger>
  );
}

function PagerLink({ agent, dir, className = "" }: { agent: Agent; dir: "prev" | "next"; className?: string }) {
  const ring = deptGlow(agent.department);
  const isNext = dir === "next";
  const Arrow = isNext ? ArrowRight : ArrowLeft;
  return (
    <Link
      href={`/studio/agents/${agent.id}`}
      rel={dir}
      className={`studio-glass studio-lift group relative flex min-h-11 items-center gap-4 overflow-hidden rounded-[24px] p-4 sm:p-5 ${isNext ? "flex-row-reverse text-right" : ""} ${className}`}
      style={{ "--accent": ring } as CSSProperties}
    >
      <span
        aria-hidden
        className={`studio-halo absolute -top-20 size-64 opacity-40 motion-safe:transition-opacity motion-safe:duration-500 group-hover:opacity-100 [--halo:var(--accent)] ${isNext ? "-right-16" : "-left-16"}`}
      />
      <Arrow
        size={18}
        className={`relative text-white/60 motion-safe:transition-transform motion-safe:duration-300 ${isNext ? "motion-safe:group-hover:translate-x-1" : "motion-safe:group-hover:-translate-x-1"}`}
      />
      <AgentAvatar agent={agent} size={64} ring={ring} decorative />
      <span className="relative min-w-0 flex-1">
        <span className="block text-[12px] font-semibold uppercase tracking-[0.16em] text-white/60">{isNext ? "Suivant" : "Précédent"}</span>
        <span className="mt-1.5 block font-display text-[28px] font-extrabold leading-none tracking-[-0.035em] text-white">{agent.name}</span>
        <span className="mt-1.5 block truncate text-[13px] text-white/65">{agent.role}</span>
      </span>
    </Link>
  );
}
