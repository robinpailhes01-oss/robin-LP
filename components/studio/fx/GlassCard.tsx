import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

/**
 * Surface de verre dépoli du studio. Composant serveur.
 *
 * Variantes :
 *  - "default" : verre courant (fond bleu poudré 4,5 %, flou 18 px, bordure 9 %, reflet en haut, lueur glacier très faible) ;
 *  - "raised"  : plus lumineux, ombre plus profonde, pour l’élément principal d’une section ;
 *  - "solid"   : verre presque opaque (lisible par-dessus un halo ou une bordure animée) ;
 *  - "subtle"  : à peine marqué, sans flou (listes, rangées dans un panneau) ;
 *  - "dashed"  : contour pointillé, pour ce qui n’existe pas encore (département fermé, poste prévu).
 * glow : couleur d’une lueur douce sous la carte (accent du département).
 * interactive : légère montée au survol (souris seulement, coupée en mouvement réduit).
 */
export type GlassVariant = "default" | "raised" | "solid" | "subtle" | "dashed";
type GlassTag = "div" | "section" | "article" | "aside" | "li" | "header" | "footer" | "figure";

const VARIANT: Record<GlassVariant, string> = {
  default: "studio-glass",
  raised: "studio-glass studio-glass--raised",
  solid: "studio-glass studio-glass--solid",
  subtle: "studio-glass studio-glass--subtle",
  dashed: "studio-glass studio-glass--dashed",
};

const PAD = { none: "", sm: "p-4", md: "p-5 sm:p-6", lg: "p-6 sm:p-8 lg:p-10" } as const;
const RADIUS = { md: "rounded-[20px]", lg: "rounded-[24px]", xl: "rounded-[28px]" } as const;

export type GlassCardProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  as?: GlassTag;
  variant?: GlassVariant;
  pad?: keyof typeof PAD;
  radius?: keyof typeof RADIUS;
  glow?: string;
  interactive?: boolean;
  children?: ReactNode;
};

export function GlassCard({
  as: Tag = "div",
  variant = "default",
  pad = "md",
  radius = "lg",
  glow,
  interactive = false,
  className = "",
  style,
  children,
  ...rest
}: GlassCardProps) {
  const cls = [VARIANT[variant], glow ? "studio-glass--glow" : "", interactive ? "studio-lift" : "", RADIUS[radius], PAD[pad], className]
    .filter(Boolean)
    .join(" ");
  const css = glow ? ({ ...style, "--glow": glow } as CSSProperties) : style;
  return (
    <Tag className={cls} style={css} {...rest}>
      {children}
    </Tag>
  );
}
