import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { statusLabel, type Agent } from "@/lib/studio/agents";
import { SpotlightCard, SpotlightLayer } from "@/components/studio/fx/SpotlightCard";
import { LiveDot } from "@/components/studio/fx/LiveDot";

/**
 * Carte « sélection de personnage », partagée par le QG et les pages départements.
 * En haut, le portrait 3D recadré en vertical, éclairé par la couleur du département et fondu vers la carte ;
 * dessous, le prénom en très grand, le rôle, le statut, puis deux zones libres au choix de la page :
 * `details` (juste sous le statut, à 20 px fixes) et `footer` (poussé en bas de la carte).
 *
 * Entrée (mouvement signature, à l’arrivée dans l’écran) : la carte apparaît, le portrait se pose dans sa scène
 * (scale 1,08 et 16 px plus bas → 1 et 0), puis un seul balayage de lumière ; en cascade avec --ci (rang posé par la grille parente).
 * Survol (souris seulement) : halo qui suit le curseur, inclinaison 3D, et sous-couches en parallaxe :
 * le portrait glisse à l’opposé de l’inclinaison (6 px) et s’approche (1,06), le prénom suit le curseur (3 px),
 * le liseré du haut s’avive. Tactile ou mouvement réduit : carte immobile.
 *
 * subgrid : la carte occupe 4 rangées de la grille parente (portrait, identité, détails, pied), pour que
 * les filets et intitulés s’alignent d’une carte à l’autre (à partir de 640 px ; le parent pose les rangées).
 *
 * Toute la carte mène à la fiche (un lien couvre la carte, contour de focus sur toute la carte) ;
 * href={null} : carte sans lien. Les liens et boutons placés dans details/footer restent cliquables au-dessus.
 * Composant serveur : seuls SpotlightCard et SpotlightLayer sont clients, l’agent n’est pas envoyé au navigateur.
 */
type CardAgent = Pick<Agent, "id" | "name" | "role" | "status" | "avatar">;
export type CharacterCardSize = "lg" | "md" | "sm";

const STAGE: Record<CharacterCardSize, string> = {
  lg: "aspect-[4/5]",
  md: "aspect-[5/6]",
  sm: "aspect-square",
};
const LIFT: Record<CharacterCardSize, string> = { lg: "-mt-24", md: "-mt-16", sm: "-mt-10" };
const PAD_X: Record<CharacterCardSize, string> = { lg: "px-6 sm:px-7", md: "px-5 sm:px-6", sm: "px-4" };
const PAD_B: Record<CharacterCardSize, string> = { lg: "pb-6 sm:pb-7", md: "pb-5 sm:pb-6", sm: "pb-4" };
const GAP: Record<CharacterCardSize, string> = { lg: "pt-5", md: "pt-5", sm: "pt-3" };
const NAME: Record<CharacterCardSize, string> = {
  lg: "text-[clamp(2.75rem,2.1rem+2.2vw,3.75rem)] tracking-[-0.05em]",
  md: "text-[36px] tracking-[-0.045em] sm:text-[40px]",
  sm: "text-[24px] tracking-[-0.035em] sm:text-[26px]",
};
const ROLE: Record<CharacterCardSize, string> = {
  lg: "mt-2 text-[16px]",
  md: "mt-1.5 text-[15px]",
  sm: "mt-1 text-[13px] leading-[1.35]",
};
const SIZES: Record<CharacterCardSize, string> = {
  lg: "(min-width: 1024px) 440px, (min-width: 640px) 50vw, 100vw",
  md: "(min-width: 1280px) 340px, (min-width: 640px) 34vw, 100vw",
  sm: "(min-width: 1024px) 240px, (min-width: 640px) 25vw, 50vw",
};
/** Rayons de l’échelle concentrique : carte seule 26, carte dans une pièce 20, petite carte 16. */
const RADIUS: Record<CharacterCardSize, string> = { lg: "26px", md: "20px", sm: "16px" };
/** Liens et boutons de details/footer au-dessus du lien qui couvre la carte. */
const ABOVE = "[&_a]:relative [&_a]:z-[5] [&_button]:relative [&_button]:z-[5]";

export function CharacterCard({
  agent,
  accent,
  href,
  details,
  footer,
  subgrid = false,
  roleLines = 1,
  size = "md",
  as: Heading = "h3",
  priority = false,
  sizes,
  className = "",
}: {
  agent: CardAgent;
  /** Couleur du département (voir DEPT_GLOW dans components/studio/fx/tokens.ts). */
  accent: string;
  /** Lien de la carte ; par défaut la fiche de l’agent ; null = pas de lien. */
  href?: string | null;
  /** Sous le statut, à distance fixe (phrase, routine, livrable). */
  details?: ReactNode;
  /** Pied de carte, poussé en bas (indicateur, « Ouvrir la fiche »). */
  footer?: ReactNode;
  /** Carte sur 4 rangées de la grille parente (alignement ligne à ligne, dès 640 px). */
  subgrid?: boolean;
  /** Réserve deux lignes au rôle : les statuts d’une rangée de cartes tombent à la même hauteur. */
  roleLines?: 1 | 2;
  size?: CharacterCardSize;
  /** Niveau du titre (prénom). */
  as?: "h2" | "h3" | "h4";
  /** Portrait principal au-dessus de la ligne de flottaison : chargement immédiat. */
  priority?: boolean;
  /** Attribut sizes du portrait, si la grille de la page diffère des valeurs par défaut. */
  sizes?: string;
  className?: string;
}) {
  const link = href === undefined ? `/studio/agents/${agent.id}` : href;
  const status = statusLabel[agent.status];
  const portrait = typeof agent.avatar?.portrait === "string" ? agent.avatar.portrait : "";
  const last = footer ? "footer" : details ? "details" : "identity";

  return (
    <SpotlightCard
      className={`studio-character ${subgrid ? "sm:row-span-4 sm:grid sm:grid-rows-subgrid sm:gap-y-0" : ""} ${className}`}
      style={{ "--accent": accent, "--card-r": RADIUS[size] } as CSSProperties}
      color={`color-mix(in srgb, ${accent} 16%, transparent)`}
      rim={`color-mix(in srgb, ${accent} 75%, white)`}
      tilt={size === "sm" ? 4 : 6}
      reveal
    >
      <span aria-hidden className="studio-character-glow" />
      <span aria-hidden className="studio-character-edge" />

      {/* Scène : le portrait, éclairé par la couleur du département, qui se fond dans la carte.
          Entrée : le portrait se pose (zoom 1,08 → 1, 16 px → 0), puis un seul balayage de lumière (studio-shimmer--once). */}
      <div aria-hidden className={`studio-character-stage studio-shimmer studio-shimmer--once ${STAGE[size]}`}>
        <SpotlightLayer depth={-6} zoom={0.06} className="studio-character-zoom">
          <span className="studio-character-portrait">
            {portrait && (
              <Image
                src={portrait}
                alt=""
                fill
                sizes={sizes ?? SIZES[size]}
                className="object-cover object-top"
                loading={priority ? "eager" : undefined}
                fetchPriority={priority ? "high" : undefined}
              />
            )}
          </span>
        </SpotlightLayer>
        <span className="studio-character-tint" />
      </div>

      {/* Identité : le prénom remonte sur le fondu du portrait et suit légèrement le curseur. */}
      <SpotlightLayer depth={3} className={`relative ${LIFT[size]} ${PAD_X[size]} ${last === "identity" ? PAD_B[size] : ""}`}>
        <Heading className={`font-display font-extrabold leading-[0.95] text-white [text-shadow:0_2px_24px_rgb(6_11_22/0.7)] ${NAME[size]}`}>{agent.name}</Heading>
        <p className={`text-pretty text-white/70 ${ROLE[size]} ${roleLines === 2 ? "min-h-[3em]" : ""}`}>{agent.role}</p>
        <p className={`flex items-center gap-2 font-semibold text-white/80 ${size === "sm" ? "mt-2.5 text-[12px]" : "mt-3.5 text-[13px]"}`}>
          <LiveDot status={agent.status} size={size === "sm" ? 6 : 7} />
          {status}
        </p>
      </SpotlightLayer>

      {details && <div className={`relative ${PAD_X[size]} ${GAP[size]} ${last === "details" ? PAD_B[size] : ""} ${ABOVE}`}>{details}</div>}
      {footer && <div className={`relative mt-auto flex flex-col ${subgrid ? "sm:mt-0" : ""} ${PAD_X[size]} ${GAP[size]} ${PAD_B[size]} ${ABOVE}`}>{footer}</div>}

      {/* Toute la carte est cliquable : un lien posé sur l’ensemble, nommé pour les lecteurs d’écran. */}
      {link && <Link href={link} aria-label={`${agent.name}, ${agent.role}, ${status.toLowerCase()} : ouvrir sa fiche`} className="studio-character-hit" />}
    </SpotlightCard>
  );
}
