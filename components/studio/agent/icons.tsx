import type { CSSProperties, ReactNode } from "react";

/** Petites icônes au trait du studio. Décoratives : toujours aria-hidden. */

type IconProps = { size?: number; className?: string; style?: CSSProperties };

function Svg({ size = 16, className = "", style, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={`shrink-0 ${className}`}
      style={style}
    >
      {children}
    </svg>
  );
}

export function ArrowRight(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </Svg>
  );
}

export function ArrowLeft(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M16 10H4M9 5l-5 5 5 5" />
    </Svg>
  );
}

export function Lock(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4.5" y="9" width="11" height="8" rx="2" />
      <path d="M7 9V6.5a3 3 0 0 1 6 0V9" />
    </Svg>
  );
}

export function Globe(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="10" cy="10" r="7" />
      <path d="M3 10h14M10 3c2 2.2 2.8 4.5 2.8 7s-.8 4.8-2.8 7c-2-2.2-2.8-4.5-2.8-7S8 5.2 10 3Z" />
    </Svg>
  );
}

export function Phone(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6.2 3.5 4.5 4.3c-.8.4-1.2 1.3-1 2.2 1.2 4.6 4.4 7.8 9 9 .9.2 1.8-.2 2.2-1l.8-1.7a1 1 0 0 0-.4-1.3l-2.2-1.3a1 1 0 0 0-1.3.2l-.8 1c-1.6-.7-2.9-2-3.6-3.6l1-.8a1 1 0 0 0 .2-1.3L7.5 3.9a1 1 0 0 0-1.3-.4Z" />
    </Svg>
  );
}

export function Calendar(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="4.5" width="13" height="12" rx="2.5" />
      <path d="M3.5 8.5h13M7 3v3M13 3v3" />
    </Svg>
  );
}

export function Clock(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6.5V10l2.5 1.5" />
    </Svg>
  );
}

export function Send(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 10h9M9 5.5 13.5 10 9 14.5" />
    </Svg>
  );
}

/** Cible : la mission. */
export function Target(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="3.6" />
      <circle cx="10" cy="10" r="0.6" fill="currentColor" />
    </Svg>
  );
}

/** Colis : le livrable. */
export function Package(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M10 2.8 16.5 6v8L10 17.2 3.5 14V6L10 2.8Z" />
      <path d="M3.5 6 10 9.2 16.5 6M10 9.2v8" />
    </Svg>
  );
}

/** Clé : les outils. */
export function Wrench(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12.6 3.4a3.6 3.6 0 0 0-4.4 4.6L3.6 12.6a1.6 1.6 0 0 0 2.3 2.3L10.5 10.3a3.6 3.6 0 0 0 4.6-4.4l-2.1 2.1-1.9-.5-.5-1.9 2-2.2Z" />
    </Svg>
  );
}

/** Jauge : l’indicateur. */
export function Gauge(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3.5 13.5a6.5 6.5 0 1 1 13 0" />
      <path d="M10 13.5 13 8.8" />
      <circle cx="10" cy="13.5" r="1" fill="currentColor" />
    </Svg>
  );
}

/** Carnet : consignes et journal. */
export function Book(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4.5 4.5A1.5 1.5 0 0 1 6 3h9.5v12H6a1.5 1.5 0 0 0-1.5 1.5v-12Z" />
      <path d="M4.5 16.5A1.5 1.5 0 0 0 6 18h9.5M8 6.5h4.5" />
    </Svg>
  );
}

/** Étincelle : ce qu’il reste à apprendre. */
export function Sparkle(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M10 3.5c.5 3.2 2.3 5 5.5 5.5-3.2.5-5 2.3-5.5 5.5-.5-3.2-2.3-5-5.5-5.5 3.2-.5 5-2.3 5.5-5.5Z" />
      <path d="M15.5 13.5v3M14 15h3" />
    </Svg>
  );
}

/** Boîte de réception : demandes du site. */
export function Inbox(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3.5 11 5.6 4.9A1.5 1.5 0 0 1 7 4h6a1.5 1.5 0 0 1 1.4.9l2.1 6.1V15a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 15v-4Z" />
      <path d="M3.5 11h3.8l1 2h3.4l1-2h3.8" />
    </Svg>
  );
}

/** Alerte : lecture impossible. */
export function Alert(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M10 3.2 17.3 16H2.7L10 3.2Z" />
      <path d="M10 8.2v3.6M10 13.9v.1" />
    </Svg>
  );
}

/** Base de données : Supabase pas encore branché. */
export function Database(p: IconProps) {
  return (
    <Svg {...p}>
      <ellipse cx="10" cy="5" rx="6" ry="2.2" />
      <path d="M4 5v10c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2V5M4 10c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2" />
    </Svg>
  );
}

/** Prise débranchée : indicateur pas encore relié à sa source. */
export function Plug(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7.5 2.5v3M12.5 2.5v3M5.5 5.5h9v3a4.5 4.5 0 0 1-9 0v-3ZM10 13v4.5" />
    </Svg>
  );
}

/** Petit chevron des fils d’Ariane (pointe vers la droite). */
export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg width="8" height="10" viewBox="0 0 8 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false" className={`shrink-0 ${className}`}>
      <path d="M2 1.5 5.5 5 2 8.5" />
    </svg>
  );
}
