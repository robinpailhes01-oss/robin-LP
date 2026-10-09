/** Pictogrammes du QG, tracés au trait, décoratifs (aria-hidden). */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function ArrowRightIcon({ className = "size-4" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowDownIcon({ className = "size-4" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "size-4" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function LockIcon({ className = "size-4" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  );
}

export function ChatIcon({ className = "size-4" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 12a7.5 7.5 0 0 1-11.2 6.5L4 20l1.5-4.6A7.5 7.5 0 1 1 20 12Z" />
    </svg>
  );
}

export function DoorIcon({ className = "size-4" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20h16M6.5 20V5.5A1.5 1.5 0 0 1 8 4h8a1.5 1.5 0 0 1 1.5 1.5V20" />
      <path d="M14 12.5h.01" strokeWidth={2.6} />
    </svg>
  );
}

export function InboxIcon({ className = "size-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 13.5 6.4 6a1.5 1.5 0 0 1 1.4-1h8.4a1.5 1.5 0 0 1 1.4 1L20 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18v-4.5Z" />
      <path d="M4 13.5h4.5l1.2 2h4.6l1.2-2H20" />
    </svg>
  );
}

export function AlertIcon({ className = "size-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4 21 19.5H3L12 4Z" />
      <path d="M12 10v4M12 17h.01" />
    </svg>
  );
}
