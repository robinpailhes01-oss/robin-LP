"use client";

import { useEffect, useState } from "react";

/** Vrai quand la requête média correspond, faux au rendu serveur (évite les écarts d’hydratation). */
export function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}
