import Link from "next/link";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 min-h-11 text-[14px] font-medium text-muted hover:text-night transition-colors">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-200 group-hover:-translate-x-0.5">
        <path d="M13 8H3M7.5 3.5L3 8l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </Link>
  );
}
