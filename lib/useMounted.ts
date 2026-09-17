"use client";

import { useEffect, useState } from "react";

/** Vrai après l’hydratation : évite les écarts serveur/client quand le rendu dépend d’une préférence du navigateur. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
