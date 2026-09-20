/** Document numérique dessiné en CSS : un bon de commande guidé, valide, avec des étiquettes flottantes. */
export function FormMock({ initials, name, title, chips, className = "" }: { initials: string; name: string; title: string; chips: string[]; className?: string }) {
  const rows = [
    { label: "Client", value: "M. Martin · 34 rue des Lilas", ok: true },
    { label: "Prestation", value: "Installation · 6 kWc", ok: true },
    { label: "Montant", value: "9 840,00 €", ok: true },
    { label: "Signature", value: "Signé sur tablette", ok: true },
  ];
  return (
    <div className={`absolute left-6 top-10 bottom-[-40px] w-[280px] ${className}`} aria-label={`Exemple de l’outil de ${name}`}>
      <div className="absolute inset-0 rounded-[18px] bg-white text-navy border border-line shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] rotate-[-3deg] origin-bottom overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-card">
          <div className="flex items-center gap-2">
            <span className="size-7 rounded-md bg-navy text-white inline-flex items-center justify-center text-[10px] font-bold" aria-hidden>
              {initials}
            </span>
            <p className="text-[11px] font-semibold">{title}</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e6f7ee] text-[#1d8a4e] px-2 h-5 text-[10px] font-semibold">
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Valide
          </span>
        </div>
        <ul className="px-4 py-3 flex flex-col gap-2.5">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2">
              <div>
                <p className="text-[9px] uppercase tracking-[0.12em] text-muted">{r.label}</p>
                <p className="text-[11px] font-medium">{r.value}</p>
              </div>
              <span className="inline-flex size-4 items-center justify-center rounded-full bg-violet text-white" aria-hidden>
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </li>
          ))}
        </ul>
        <div className="mx-4 mb-4 h-9 rounded-full bg-violet text-white text-[11px] font-semibold flex items-center justify-center">Envoyer au secrétariat</div>
      </div>
      <span className="absolute -top-4 -right-5 inline-flex size-11 items-center justify-center rounded-xl bg-navy text-white text-[13px] font-bold border border-white/20 shadow-lg rotate-[-3deg]" aria-hidden>
        {initials}
      </span>
      <ul className="absolute left-[200px] top-[150px] flex flex-col gap-2.5" aria-label="Ce que l’outil garantit">
        {chips.map((chip, i) => (
          <li
            key={chip}
            className="rounded-[10px] bg-white text-navy text-[12px] font-medium px-3 py-2 whitespace-nowrap shadow-[0_16px_30px_-16px_rgba(0,0,0,0.6)]"
            style={{ transform: `translateX(${i * 10}px)` }}
          >
            {chip}
          </li>
        ))}
      </ul>
    </div>
  );
}
