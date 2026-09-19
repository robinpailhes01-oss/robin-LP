export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-start gap-0.5 font-bold tracking-[-0.04em] leading-none ${light ? "text-white" : "text-navy"} ${className}`}>
      Luma
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-violet -mt-0.5" aria-hidden>
        <path d="M8 0c.6 4.6 3.4 7.4 8 8-4.6.6-7.4 3.4-8 8-.6-4.6-3.4-7.4-8-8 4.6-.6 7.4-3.4 8-8z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Pill({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex w-fit self-start items-center gap-2 rounded-full px-3 h-7 text-[11px] font-semibold uppercase tracking-[0.14em] ${
        dark ? "bg-white/10 text-white" : "bg-violet-tint text-violet"
      }`}
    >
      <span className={`size-1.5 rounded-full ${dark ? "bg-white" : "bg-violet"}`} aria-hidden />
      {children}
    </span>
  );
}
