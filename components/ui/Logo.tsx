/** Logotype Luma : mot-symbole en Inter Tight et étoile, en bleu nuit. */
export function Logo({ className = "", light = false, byline = false }: { className?: string; light?: boolean; byline?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className={`inline-flex items-start gap-0.5 font-display font-extrabold tracking-[-0.045em] leading-none text-[26px] ${light ? "text-white" : "text-night"}`}>
        Luma
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={`-mt-0.5 ${light ? "text-powder" : "text-slate"}`} aria-hidden>
          <path d="M8 0c.6 4.6 3.4 7.4 8 8-4.6.6-7.4 3.4-8 8-.6-4.6-3.4-7.4-8-8 4.6-.6 7.4-3.4 8-8z" fill="currentColor" />
        </svg>
      </span>
      {byline && (
        <span className={`hidden sm:inline border-l pl-3 text-[12px] leading-tight font-medium ${light ? "border-white/25 text-white/75" : "border-line text-muted"}`}>
          par Robin Pailhes
        </span>
      )}
    </span>
  );
}

/** Petite étiquette de section, sans fond coloré. */
export function Kicker({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`t-kicker inline-flex items-center gap-2.5 ${className}`}>
      <span className="h-px w-6 bg-slate" aria-hidden />
      {children}
    </p>
  );
}

/** Étiquette « Exemple » : signale qu’un visuel est illustratif. */
export function ExampleTag({ children = "Exemple illustratif" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-powder bg-white px-2.5 h-7 text-[12px] font-semibold text-night">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M6 5.4v3M6 3.6v.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {children}
    </span>
  );
}
