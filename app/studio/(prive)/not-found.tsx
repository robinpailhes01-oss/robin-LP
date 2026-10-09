import type { Metadata } from "next";
import Link from "next/link";
import { agents } from "@/lib/studio/agents";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { GlassCard } from "@/components/studio/fx/GlassCard";
import { deptGlow } from "@/components/studio/fx/tokens";

export const metadata: Metadata = { title: "Fiche introuvable" };

/** Agent ou département inconnu (notFound() dans agents/[id] et departements/[id]) : message en français, dans le cadre du studio. */
export default function StudioNotFound() {
  return (
    <GlassCard as="section" variant="raised" radius="xl" pad="none" aria-labelledby="introuvable-titre" className="mx-auto max-w-[36rem] overflow-hidden p-6 text-center sm:mt-6 sm:p-10">
      <span aria-hidden className="studio-halo absolute left-1/2 top-0 size-64 -translate-x-1/2 -translate-y-1/2 opacity-60" />
      {/* L’équipe au complet, en petit : la fiche cherchée n’en fait pas partie. Décoratif. */}
      <ul aria-hidden className="relative flex justify-center">
        {agents.map((a, i) => (
          <li key={a.id} className={i === 0 ? "relative" : "relative -ml-2.5"} style={{ zIndex: agents.length - i }}>
            <AgentAvatar agent={a} size={40} ring={deptGlow(a.department)} decorative />
          </li>
        ))}
      </ul>
      <p className="studio-kicker relative mt-6">Introuvable</p>
      <h1 id="introuvable-titre" className="relative mt-2 font-display text-[28px] font-extrabold leading-[1.08] tracking-[-0.035em] text-white text-balance sm:text-[32px]">
        Cette fiche n’existe pas.
      </h1>
      <p className="relative mx-auto mt-3 max-w-[28rem] text-[15px] leading-[1.6] text-white/70 text-pretty">
        Le lien est peut-être ancien ou mal tapé. Tous tes agents et départements sont au QG.
      </p>
      <Link href="/studio" className="studio-btn studio-btn--primary relative mt-8 px-6">
        Retour au QG
      </Link>
    </GlassCard>
  );
}
