/** Petites icônes au trait du studio. Décoratives : toujours aria-hidden. */

type IconProps = { size?: number; className?: string };

function Svg({ size = 16, className = "", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`shrink-0 ${className}`}>
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

/** Petit chevron des schémas de flux (pointe vers la droite). */
export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg width="8" height="10" viewBox="0 0 8 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`shrink-0 ${className}`}>
      <path d="M2 1.5 5.5 5 2 8.5" />
    </svg>
  );
}
