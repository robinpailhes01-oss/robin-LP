"use client";

import { motion, motionValue, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { createContext, useContext, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { useFinePointer, useReveal } from "./useReveal";

/**
 * Carte qui réagit au curseur : un halo radial suit la souris (sur la surface et sur le liseré),
 * la carte s’incline doucement en 3D (ressorts motion), et ses sous-couches (SpotlightLayer) glissent en parallaxe :
 * le portrait part à l’opposé de l’inclinaison et s’approche, le prénom suit légèrement le curseur.
 * Seuls transform et opacity bougent. Désactivé sur écran tactile (pointeur grossier) et en mouvement réduit :
 * la carte reste une carte simple.
 *
 * Les enfants restent des composants serveur (passés en children). Le halo passe au-dessus du contenu
 * (pointer-events: none) : les liens et boutons de la carte restent cliquables.
 *
 * reveal : la carte reçoit data-inview (useReveal) pour jouer une entrée à l’arrivée dans l’écran, dessinée en CSS
 * (CharacterCard : le portrait se pose dans sa scène, puis un balayage de lumière ; voir studio.css, section 12 ter).
 */

type Spot = {
  /** Position du curseur dans la carte, de -1 (gauche, haut) à 1 (droite, bas), lissée par un ressort. */
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  /** 0 au repos, 1 au survol (ressort). */
  hover: MotionValue<number>;
};

/** Hors d’une carte (ou sur écran tactile) : valeurs immobiles, les couches ne bougent pas. */
const STILL: Spot = { nx: motionValue(0), ny: motionValue(0), hover: motionValue(0) };
const SpotContext = createContext<Spot>(STILL);

export function SpotlightCard({
  children,
  className = "",
  style,
  color,
  rim,
  tilt = 5,
  size = 420,
  reveal = false,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Couleur du halo sur la surface (avec transparence), ex. "rgb(76 141 255 / 0.14)". */
  color?: string;
  /** Couleur du halo sur le liseré, ex. "rgb(202 223 237 / 0.7)". */
  rim?: string;
  /** Inclinaison maximale en degrés (0 = pas d’inclinaison). */
  tilt?: number;
  /** Diamètre du halo en pixels. */
  size?: number;
  /** Entrée à l’arrivée dans l’écran (data-inview). */
  reveal?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const phase = useReveal(ref, { enabled: reveal, amount: 0.25 });
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const on = fine && !reduce;

  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const spring = { stiffness: 160, damping: 18, mass: 0.6 };
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const nx = useSpring(0, spring);
  const ny = useSpring(0, spring);
  const hover = useSpring(0, { stiffness: 200, damping: 26 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!on || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return;
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    x.set(px);
    y.set(py);
    const fx = (px / r.width - 0.5) * 2;
    const fy = (py / r.height - 0.5) * 2;
    nx.set(fx);
    ny.set(fy);
    hover.set(1);
    if (tilt > 0) {
      rotateY.set(fx * tilt);
      rotateX.set(-fy * tilt);
    }
  }

  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
    nx.set(0);
    ny.set(0);
    hover.set(0);
  }

  const vars = {
    ...(color ? { "--spot": color } : null),
    ...(rim ? { "--spot-rim": rim } : null),
    "--spot-size": `${size}px`,
    ...style,
  } as CSSProperties;

  return (
    <SpotContext.Provider value={on ? { nx, ny, hover } : STILL}>
      <motion.div
        ref={ref}
        data-spot={on ? "" : undefined}
        data-inview={reveal ? phase : undefined}
        onPointerMove={on ? onMove : undefined}
        onPointerLeave={on ? onLeave : undefined}
        className={`studio-spot ${className}`}
        style={on && tilt > 0 ? { ...vars, rotateX, rotateY, transformPerspective: 900 } : vars}
      >
        {children}
        {on && (
          <>
            <span aria-hidden className="studio-spot-light">
              <motion.span className="studio-spot-blob" style={{ x, y }} />
            </span>
            <span aria-hidden className="studio-spot-rim">
              <motion.span className="studio-spot-blob" style={{ x, y }} />
            </span>
          </>
        )}
      </motion.div>
    </SpotContext.Provider>
  );
}

/**
 * Sous-couche d’une SpotlightCard qui glisse en parallaxe au survol.
 * depth : décalage maximal en px (négatif = à l’opposé du curseur, donc de l’inclinaison) ; zoom : agrandissement au survol (0,06 = 1,06).
 * Hors survol, sur écran tactile ou en mouvement réduit : immobile (aucun transform).
 */
export function SpotlightLayer({
  depth = 0,
  zoom = 0,
  className = "",
  style,
  children,
}: {
  depth?: number;
  zoom?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const { nx, ny, hover } = useContext(SpotContext);
  const x = useTransform(nx, (v) => v * depth);
  const y = useTransform(ny, (v) => v * depth);
  const scale = useTransform(hover, (h) => 1 + h * zoom);
  return (
    <motion.div className={className} style={{ ...style, x, y, scale }}>
      {children}
    </motion.div>
  );
}
