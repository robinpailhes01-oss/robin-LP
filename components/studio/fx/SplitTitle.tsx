import { Fragment, createElement, type CSSProperties } from "react";

/**
 * Grand titre qui monte mot à mot (mouvement signature du studio : « Bonjour Robin », noms de département).
 * Chaque mot vit dans un masque (overflow: hidden) et monte de translateY(100 %) à 0, en cascade de 60 ms.
 * Composant serveur, CSS seul (app/studio/studio.css, section 6 bis) : l’entrée joue dès l’affichage, sans attendre le JavaScript.
 *
 * Un seul titre (h1) : le texte complet en sr-only, les mots animés aria-hidden.
 * Les masques ont la même hauteur que la ligne (vertical-align: top, marges négatives) : la mise en page ne bouge pas,
 * et leurs marges intérieures gardent jambages (j, p, g) et accents dans la zone visible.
 * gradient : le dégradé blanc → poudré est posé sur chaque mot (un dégradé découpé dans le texte d’un parent ne suit pas
 * des enfants transformés). Les mots d’une lettre (« & », « à ») restent collés au mot suivant (espace insécable).
 * Mouvement réduit : aucune animation, le titre est là d’emblée.
 */
type Tag = "h1" | "h2" | "p";

function wordsOf(text: string) {
  const raw = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    if (Array.from(raw[i]).length === 1 && i < raw.length - 1) {
      out.push(`${raw[i]} ${raw[i + 1]}`);
      i += 1;
    } else out.push(raw[i]);
  }
  return out;
}

export function SplitTitle({
  text,
  as = "h1",
  id,
  className = "",
  gradient = false,
  delay = 0.08,
  step = 0.06,
}: {
  text: string;
  as?: Tag;
  id?: string;
  className?: string;
  gradient?: boolean;
  /** Attente avant le premier mot, en secondes. */
  delay?: number;
  /** Écart entre deux mots, en secondes. */
  step?: number;
}) {
  const words = wordsOf(text);
  const style = { "--word-delay": `${delay}s`, "--word-step": `${step}s` } as CSSProperties;
  return createElement(
    as,
    { id, className, style },
    <span className="sr-only">{text}</span>,
    <span aria-hidden>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="studio-word-mask">
            <span className={`studio-word ${gradient ? "studio-gradient-text" : ""}`} style={{ "--w": i } as CSSProperties}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>,
  );
}
