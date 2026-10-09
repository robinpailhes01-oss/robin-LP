"use client";

import { useEffect } from "react";

/**
 * Pendant que le studio est affiché, le document (html, body) prend le fond nuit et le schéma de couleurs sombre :
 * pas de bande blanche au rebond du défilement (Safari), barre de défilement sombre.
 * Tout est rétabli au démontage : le site public ne change pas. Aucune règle CSS globale n’est ajoutée.
 */
export function DocumentTone({ color = "#060B16" }: { color?: string }) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = { htmlBg: html.style.backgroundColor, scheme: html.style.colorScheme, bodyBg: body.style.backgroundColor };
    html.style.backgroundColor = color;
    html.style.colorScheme = "dark";
    body.style.backgroundColor = color;
    return () => {
      html.style.backgroundColor = prev.htmlBg;
      html.style.colorScheme = prev.scheme;
      body.style.backgroundColor = prev.bodyBg;
    };
  }, [color]);
  return null;
}
