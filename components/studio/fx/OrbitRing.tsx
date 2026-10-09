import type { CSSProperties } from "react";
import { GLACIER } from "./tokens";

/**
 * Anneaux décoratifs qui tournent lentement autour d’un portrait (38 s, 64 s en sens inverse, 90 s),
 * avec un petit satellite lumineux. Composant serveur, zéro JavaScript, aria-hidden.
 * À poser dans un parent en position relative (le portrait). Mouvement réduit : anneaux immobiles.
 */
export function OrbitRing({
  color = GLACIER,
  rings = 2,
  inset = "-14%",
  speed = 1,
  className = "",
}: {
  color?: string;
  rings?: 1 | 2 | 3;
  /** Débord des anneaux autour du parent (valeur CSS de inset). */
  inset?: string;
  /** Multiplicateur de durée : 2 = deux fois plus lent. */
  speed?: number;
  className?: string;
}) {
  const style = { "--orbit": color, "--orbit-inset": inset, "--orbit-speed": speed } as CSSProperties;
  return (
    <span aria-hidden className={`studio-orbit ${className}`} style={style}>
      {Array.from({ length: rings }, (_, i) => (
        <span key={i} className="studio-orbit-ring">
          <i />
        </span>
      ))}
    </span>
  );
}
