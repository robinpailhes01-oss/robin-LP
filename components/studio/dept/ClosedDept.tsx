import Link from "next/link";
import type { CSSProperties } from "react";
import { PlannedAvatar } from "@/components/studio/AgentAvatar";
import { FadeIn, Stagger } from "@/components/studio/fx/FadeIn";
import { OrbitRing } from "@/components/studio/fx/OrbitRing";
import { GLACIER } from "@/components/studio/fx/tokens";
import type { Department } from "@/lib/studio/agents";
import { glow } from "@/components/studio/agent/format";
import { ArrowRight, Lock } from "@/components/studio/agent/icons";

/**
 * Département pas encore ouvert : une pièce sobre, en verre très dépoli teinté bleu froid, avec un cadenas lumineux,
 * la phrase qui dit quand il ouvrira et les postes prévus (chaises vides). Aucun bouton factice.
 * Le verre reste immobile ; seul son contenu entre en cascade (le flou ne « saute » pas en fin d’animation).
 */
export function ClosedDept({ department }: { department: Department }) {
  // Lumière froide (bleu glacier, très douce) : la teinte sourde du futur département ferait une tache grise et boueuse.
  const accent = GLACIER;
  const roles = department.plannedRoles ?? [];

  return (
    <section aria-labelledby="ferme-titre" className="mt-14 sm:mt-20" style={{ "--accent": accent } as CSSProperties}>
      {/* Verre assombri (comme les pièces à ouvrir du QG) : le verre courant, sur ce grand aplat sans contenu coloré, virait au gris ardoise. */}
      <div className="studio-glass relative overflow-hidden rounded-[28px] bg-[rgb(5_12_26/0.6)] px-5 py-12 backdrop-blur-2xl sm:rounded-[32px] sm:px-10 sm:py-16">
        {/* Décor : trame de points qui s’efface en cercle, lumière froide très douce. */}
        <span
          aria-hidden
          className="studio-dots absolute inset-0 opacity-70"
          style={{
            maskImage: "radial-gradient(ellipse 60% 70% at 50% 30%, #000 10%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 30%, #000 10%, transparent 75%)",
          }}
        />
        {/* Bleu électrique à 20 % : un halo glacier plus fort, sous le verre, délavait le panneau en gris ardoise. */}
        <span aria-hidden className="studio-halo absolute -top-40 left-1/2 aspect-square w-[min(40rem,120%)] -translate-x-1/2 opacity-[0.22] [--halo:#4C8DFF]" />

        <FadeIn delay={0.3} className="relative mx-auto max-w-[40rem] text-center">
          {/* Cadenas lumineux, avec deux anneaux qui tournent très lentement. */}
          <div aria-hidden className="relative mx-auto flex size-20 items-center justify-center">
            <span className="studio-halo absolute -inset-16 opacity-[0.35] [--halo:var(--accent)]" />
            <span
              className="relative flex size-20 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]"
              style={{
                color: accent,
                boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.14), 0 0 0 6px rgb(255 255 255 / 0.02), 0 0 44px -6px ${glow(accent, 70)}`,
              }}
            >
              <Lock size={30} style={{ filter: `drop-shadow(0 0 8px ${glow(accent, 80)})` }} />
            </span>
            <OrbitRing color={accent} rings={1} inset="-28%" speed={1.4} />
          </div>

          <h2 id="ferme-titre" className="studio-h2 mt-12">
            Département pas encore ouvert
          </h2>
          <p className="studio-lead mt-4">On l’ouvrira quand la prospection tournera.</p>
        </FadeIn>

        {roles.length > 0 && (
          <div className="relative mx-auto mt-12 max-w-[44rem]">
            <FadeIn delay={0.42}>
              <p className="studio-kicker text-center">Postes prévus</p>
            </FadeIn>
            <Stagger as="ul" delay={0.5} step={0.1} className="mt-5 grid gap-3 sm:grid-cols-2">
              {roles.map((r) => (
                <li key={r} className="studio-glass studio-glass--dashed flex items-center gap-4 rounded-[20px] p-4">
                  <PlannedAvatar size={52} />
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-[1.3] text-white">{r}</p>
                    <p className="mt-0.5 text-[13px] text-white/60">Pas encore pourvu</p>
                  </div>
                </li>
              ))}
            </Stagger>
          </div>
        )}

        <FadeIn delay={0.65} className="relative mt-10 flex justify-center">
          <Link href="/studio/departements/prospection" className="studio-btn studio-btn--ghost group">
            Voir la prospection
            <ArrowRight size={16} className="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
