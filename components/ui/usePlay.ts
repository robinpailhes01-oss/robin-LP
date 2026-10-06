"use client";

import { useEffect, useRef } from "react";

/**
 * Ajoute la classe « is-in » tant que l’élément est visible : les animations CSS des schémas
 * (classes .play) ne tournent qu’à ce moment-là.
 */
export function usePlay<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-in", e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}
