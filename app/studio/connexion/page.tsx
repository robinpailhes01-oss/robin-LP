import type { Metadata } from "next";
import { safeNext, STUDIO_MIN_PASSWORD, studioPasswordState } from "@/lib/studio/auth";
import { agents } from "@/lib/studio/agents";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { GlassCard } from "@/components/studio/fx/GlassCard";
import { FadeIn, Stagger } from "@/components/studio/fx/FadeIn";
import { deptGlow } from "@/components/studio/fx/tokens";

export const metadata: Metadata = { title: "Connexion" };

/** Connexion au studio : un seul mot de passe, défini dans STUDIO_PASSWORD. */
export default async function StudioLogin({ searchParams }: { searchParams: Promise<{ erreur?: string; next?: string }> }) {
  const { erreur, next } = await searchParams;
  const state = studioPasswordState();
  return (
    <main id="contenu" className="relative flex min-h-[100dvh] items-center justify-center overflow-x-clip px-4 py-12">
      {/* Halo resserré derrière la carte : la lumière vient de l’équipe. */}
      <span aria-hidden className="studio-halo absolute left-1/2 top-[38%] size-[34rem] -translate-x-1/2 -translate-y-1/2 opacity-70" />

      <FadeIn className="relative w-full max-w-[25rem]" y={18} duration={0.8}>
        <GlassCard variant="raised" radius="xl" pad="none" className="p-7 sm:p-8">
          <p className="flex items-center gap-2.5">
            <span className="font-display text-[22px] font-extrabold tracking-[-0.04em] text-white">Luma</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-2 py-[3px] text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#CADFED]">
              <span aria-hidden className="size-1.5 rounded-full bg-[#9CC3FF] shadow-[0_0_8px_#9CC3FF]" />
              Studio
            </span>
          </p>

          {/* L’équipe, qui se chevauche au-dessus du titre. Décoratif : le titre dit où l’on entre. */}
          <Stagger as="ul" aria-hidden delay={0.25} step={0.06} y={10} className="mt-7 flex items-center pl-1.5">
            {agents.map((a, i) => (
              <li key={a.id} className={i === 0 ? "relative" : "relative -ml-3"} style={{ zIndex: agents.length - i }}>
                <AgentAvatar agent={a} size={48} ring={deptGlow(a.department)} decorative />
              </li>
            ))}
          </Stagger>

          <h1 className="mt-6 font-display text-[30px] font-extrabold leading-[1.02] tracking-[-0.04em] text-white">Le QG de l’agence</h1>
          <p className="mt-2 text-[15px] leading-[1.5] text-white/70">Espace privé. Entre le mot de passe du studio.</p>

          {state === "ok" ? (
            <form action="/api/studio/login" method="post" className="mt-6 flex flex-col gap-4">
              <input type="hidden" name="next" value={safeNext(next)} />
              <label className="flex flex-col gap-2 text-[14px] font-semibold text-white">
                Mot de passe
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  autoFocus
                  aria-invalid={erreur === "1" || undefined}
                  className="studio-input font-normal"
                />
              </label>
              {erreur === "1" && (
                <p role="alert" className="flex items-center gap-2 text-[14px] font-medium text-[#FFB4B4]">
                  <span aria-hidden className="size-1.5 rounded-full bg-[#FF8F8F]" />
                  Mot de passe incorrect.
                </p>
              )}
              <button type="submit" className="studio-btn studio-btn--primary min-h-12 w-full">
                Entrer
              </button>
            </form>
          ) : state === "court" ? (
            <p role="alert" className="mt-6 rounded-2xl border border-[#F5C27A]/25 bg-[#F5C27A]/[0.07] p-4 text-[14px] leading-[1.55] text-white/85">
              Le mot de passe du studio est trop court ({STUDIO_MIN_PASSWORD}&nbsp;caractères minimum). Mets dans{" "}
              <code className="font-semibold text-white">STUDIO_PASSWORD</code> sur Vercel une phrase longue ou une suite aléatoire, puis redéploie.
            </p>
          ) : (
            <p role="alert" className="mt-6 rounded-2xl border border-[#F5C27A]/25 bg-[#F5C27A]/[0.07] p-4 text-[14px] leading-[1.55] text-white/85">
              Le studio n’a pas encore de mot de passe. Ajoute la variable <code className="font-semibold text-white">STUDIO_PASSWORD</code> dans Vercel, puis
              redéploie.
            </p>
          )}
        </GlassCard>
      </FadeIn>
    </main>
  );
}
