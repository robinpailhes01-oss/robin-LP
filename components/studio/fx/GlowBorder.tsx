import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

/**
 * Bordure en dégradé conique qui tourne lentement autour de l’élément clé d’un écran (la carte d’Alma au QG).
 * Une seule par écran. Composant serveur, zéro JavaScript.
 *
 * Fabrication : un anneau masqué (mask-composite: exclude) laisse voir 1 à 2 px d’un grand carré
 * en conic-gradient qui tourne (transform: rotate, donc composité). Un halo flou statique (dessiné une fois),
 * derrière, prolonge la lumière hors de la carte (desktop seulement). Mouvement réduit : le dégradé reste, immobile.
 *
 * Le contenu est posé dans un corps de verre presque opaque (surface="solid") pour que le halo ne transparaisse pas ;
 * surface={false} laisse le corps nu (à habiller avec innerClassName).
 */
type Tag = "div" | "section" | "article" | "aside";

export function GlowBorder({
  as: TagName = "div",
  children,
  className = "",
  innerClassName = "",
  colors = ["#4C8DFF", "#CADFED"],
  radius = 28,
  width = 1.5,
  speed = 8,
  start = 0,
  bloom = true,
  surface = "solid",
  style,
  ...rest
}: Omit<HTMLAttributes<HTMLElement>, "children"> & {
  as?: Tag;
  children: ReactNode;
  /** Classes du conteneur (placement, hauteur). */
  className?: string;
  /** Classes du corps (padding, mise en page interne). */
  innerClassName?: string;
  /** [couleur principale, reflet] du faisceau. */
  colors?: [string, string];
  radius?: number;
  /** Épaisseur de la bordure en px. */
  width?: number;
  /** Durée d’un tour en secondes. */
  speed?: number;
  /** Angle de départ en degrés (pour décaler deux bordures). */
  start?: number;
  bloom?: boolean;
  surface?: "solid" | "glass" | false;
}) {
  const vars = {
    "--gb-a": colors[0],
    "--gb-b": colors[1],
    "--gb-radius": `${radius}px`,
    "--gb-w": `${width}px`,
    "--gb-dur": `${speed}s`,
    "--gb-start": `${start}deg`,
    ...style,
  } as CSSProperties;
  const body = surface === "solid" ? "studio-glass studio-glass--solid" : surface === "glass" ? "studio-glass" : "";
  return (
    <TagName className={`studio-glowborder ${className}`} style={vars} {...rest}>
      {bloom && <span aria-hidden className="studio-glowborder-bloom" />}
      <div className={`studio-glowborder-body ${body} ${innerClassName}`}>{children}</div>
      <span aria-hidden className="studio-glowborder-ring">
        <span className="studio-glowborder-spin" />
      </span>
    </TagName>
  );
}
