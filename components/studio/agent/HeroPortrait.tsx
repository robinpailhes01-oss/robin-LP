import Image from "next/image";
import type { CSSProperties } from "react";
import type { Agent } from "@/lib/studio/agents";

/**
 * Portrait de l’écran de sélection de personnage (fiche agent).
 * Mobile : pleine largeur en haut de la carte, carré, fondu vers le bas (le prénom remonte sur ce fondu).
 * Dès 768 px : tout le bord gauche de la carte, en vertical (32 rem de large et 560 px de haut au moins en grand écran),
 * recadré par le haut et fondu vers la droite et le bas pour se fondre dans la carte (fond #101C2E proche).
 * Lumière du département en anneau autour de la tête (mode « screen », le visage reste net), liseré lumineux à gauche,
 * flottement très léger du portrait seul (le seul flottement de l’écran ; coupé en mouvement réduit).
 * Image prioritaire : c’est le portrait principal, au-dessus de la ligne de flottaison. Décoratif : le prénom est le titre juste à côté.
 */
export function HeroPortrait({ agent, accent }: { agent: Pick<Agent, "name" | "avatar">; accent: string }) {
  const src = typeof agent.avatar?.portrait === "string" ? agent.avatar.portrait : "";
  return (
    <div aria-hidden className="relative aspect-square w-full md:aspect-auto md:h-full md:min-h-[27.5rem] lg:min-h-[35rem]" style={{ "--accent": accent } as CSSProperties}>
      <div className="studio-cut studio-cut--hero">
        <div
          className="studio-cut-layer studio-float"
          style={{ "--float-y": "-6px", "--float-dur": "9s", "--float-delay": "-2.4s" } as CSSProperties}
        >
          {src && (
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 1024px) 620px, (min-width: 768px) 440px, 100vw"
              className="object-cover object-top"
              loading="eager"
              fetchPriority="high"
            />
          )}
        </div>
        <span className="studio-cut-glow" />
      </div>
      {/* Liseré lumineux : à gauche dès 768 px, en haut sur mobile. */}
      <span className="studio-edge-v hidden md:block" />
      <span
        className="absolute inset-x-[12%] top-0 h-px md:hidden"
        style={{ background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent} 90%, white), transparent)`, boxShadow: `0 0 14px ${accent}` }}
      />
    </div>
  );
}
