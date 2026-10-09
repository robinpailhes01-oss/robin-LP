"use client";

import { usePathname } from "next/navigation";

/**
 * Transition de page du studio : fondu, légère montée, flou qui se dissipe (desktop ; sans flou sur mobile).
 * CSS seulement (classe .studio-page, app/studio/studio.css section 6) : elle joue aussi au premier affichage,
 * sans attendre le JavaScript, et « backwards » ne laisse aucun transform ni filtre une fois finie.
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
