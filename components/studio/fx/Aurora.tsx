/**
 * Fond du studio : nuit profonde, halos flous qui dérivent lentement (bleu électrique de la prospection,
 * bleu glacier de la direction, touche de bleu poudré Luma), fine grille qui s’efface vers le bas, grain léger.
 * Fixe derrière tout le contenu (z-index -1 dans le conteneur .studio, qui isole son empilement). Décoratif.
 *
 * Composant serveur, zéro JavaScript : la dérive est une animation CSS de transform seulement,
 * coupée sur mobile (halos immobiles) et en mouvement réduit. Voir la section 5 de app/studio/studio.css.
 */
export function Aurora({ variant = "default", grid = true }: { variant?: "default" | "focus"; grid?: boolean }) {
  return (
    <div aria-hidden className="studio-aurora" data-variant={variant}>
      <div className="studio-aurora-blob studio-aurora-blob--a" />
      <div className="studio-aurora-blob studio-aurora-blob--b" />
      <div className="studio-aurora-blob studio-aurora-blob--c" />
      <div className="studio-aurora-blob studio-aurora-blob--d" />
      {grid && <div className="studio-aurora-grid" />}
      <div className="studio-aurora-grain" />
      <div className="studio-aurora-vignette" />
    </div>
  );
}
