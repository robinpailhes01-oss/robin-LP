"use client";

import { usePathname } from "next/navigation";

/**
 * Transition de page du studio : fondu et légère montée (plus courte sur mobile).
 * CSS seulement (classe .studio-page, app/studio/studio.css section 6) : elle joue aussi au premier affichage,
 * sans attendre le JavaScript, et « backwards » ne laisse aucun transform une fois finie.
 * Une seule animation pour toutes les largeurs (montée et durée en variables) : franchir 768 px, en tournant un téléphone
 * ou en redimensionnant la fenêtre, ne la rejoue pas.
 * Coupée en mouvement réduit.
 *
 * Un template ne se remonte que quand le segment juste sous lui change (QG → agents) ; la clé sur le chemin
 * rejoue aussi l’entrée d’une fiche à l’autre (Alma → Léo).
 */
export default function StudioTemplate({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div key={path} className="studio-page">
      {children}
    </div>
  );
}
