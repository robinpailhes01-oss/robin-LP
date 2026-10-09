"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

/**
 * Scène d’un schéma de flux (Léo → Inès → Hugo → toi) : un seul rail continu, du centre du premier nœud
 * au centre du dernier, et une seule comète qui le parcourt en entier. Chaque nœud qu’elle atteint reçoit
 * un bref éclat de son anneau (halo : opacity et scale seulement).
 *
 * Les nœuds sont des éléments [data-flow-node] posés n’importe où dans les enfants (rendus côté serveur) ;
 * leur centre est mesuré dans la page (offsetLeft/offsetTop : les transforms des entrées n’y comptent pas),
 * donc le rail tombe juste en rangée (grand écran) comme en colonne (mobile), et suit les redimensionnements.
 * La comète ne tourne que quand le schéma est à l’écran. Mouvement réduit : le rail seul, immobile.
 * Décoratif : le sens du flux est porté par la liste ordonnée et le texte de chaque étape.
 */

/** Part du cycle pendant laquelle la comète voyage (le reste : elle s’éteint au bout du rail). Voir studio-flow-travel. */
const TRAVEL = 0.7;

type Props = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Couleur du rail et de la comète. */
  color: string;
  /** Durée du trajet entre deux nœuds voisins, en secondes. */
  segment?: number;
  /** Longueur de la traîne en px. */
  tail?: number;
  children: ReactNode;
};

/** Position du centre d’un élément dans le repère de root, sans les transforms (entrées en cours). */
function centerIn(el: HTMLElement, root: HTMLElement) {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    const parent = node.offsetParent as HTMLElement | null;
    // root doit être un ancêtre positionné ; sinon, repli sur les rectangles (transforms compris).
    if (parent && !root.contains(parent) && parent !== root) return null;
    node = parent;
  }
  return node === root ? { x, y } : null;
}

function rectCenterIn(el: HTMLElement, root: HTMLElement) {
  const r = el.getBoundingClientRect();
  const o = root.getBoundingClientRect();
  return { x: r.left - o.left + r.width / 2, y: r.top - o.top + r.height / 2 };
}

export function FlowStage({ color, segment = 1.1, tail, className = "", style, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    function measure() {
      if (!root) return;
      const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-flow-node]")).filter((n) => n.offsetWidth > 0);
      if (nodes.length < 2) {
        setReady(false);
        return;
      }
      const centers = nodes.map((n) => centerIn(n, root) ?? rectCenterIn(n, root));
      const first = centers[0];
      const last = centers[centers.length - 1];
      const horizontal = Math.abs(last.x - first.x) >= Math.abs(last.y - first.y);
      const length = horizontal ? last.x - first.x : last.y - first.y;
      if (length <= 1) {
        setReady(false);
        return;
      }
      const duration = segment * (nodes.length - 1) / TRAVEL;
      root.dataset.axis = horizontal ? "x" : "y";
      root.style.setProperty("--flow-x0", `${first.x.toFixed(1)}px`);
      root.style.setProperty("--flow-y0", `${first.y.toFixed(1)}px`);
      root.style.setProperty("--flow-dx", horizontal ? `${length.toFixed(1)}px` : "0px");
      root.style.setProperty("--flow-dy", horizontal ? "0px" : `${length.toFixed(1)}px`);
      root.style.setProperty("--flow-dur", `${duration.toFixed(2)}s`);
      // Chaque nœud s’éclaire au moment où la tête de la comète l’atteint (trajet linéaire).
      nodes.forEach((n, i) => {
        const c = centers[i];
        const d = Math.max(0, Math.min(1, (horizontal ? c.x - first.x : c.y - first.y) / length));
        n.style.setProperty("--flash-delay", `${(d * TRAVEL * duration).toFixed(3)}s`);
      });
      setReady(true);
    }

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(root);
    // Les polices changent la hauteur des textes (rail vertical) : on remesure une fois chargées.
    document.fonts?.ready.then(() => measure()).catch(() => {});
    return () => ro.disconnect();
  }, [segment]);

  const run = ready && inView && !reduce;
  const vars = { "--flow": color, ...(tail ? { "--flow-tail": `${tail}px` } : null), ...style } as CSSProperties;

  return (
    <div {...rest} ref={ref} className={`studio-flow ${className}`} style={vars} data-ready={ready ? "" : undefined} data-run={run ? "" : undefined}>
      {/* Le rail d’abord : tout ce qui suit (nœuds, textes) passe au-dessus. */}
      <span aria-hidden className="studio-flow-track">
        <span className="studio-flow-line" />
        <span className="studio-flow-comet" />
      </span>
      {children}
    </div>
  );
}

/**
 * Nœud du rail : enveloppe du portrait ou de l’icône, avec son éclat (halo + anneau) qui s’allume au passage de la comète.
 * Composant sans état, utilisable depuis un composant serveur.
 */
export function FlowNode({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span data-flow-node className={`studio-flow-node ${className}`}>
      <span aria-hidden className="studio-flow-flash" />
      {children}
    </span>
  );
}
