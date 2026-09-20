/** Téléphone dessiné en CSS avec l’accueil d’un agent WhatsApp et des bulles flottantes. */
export function PhoneMock({
  initials,
  name,
  greeting,
  chips,
  className = "",
}: {
  initials: string;
  name: string;
  greeting: string;
  chips: string[];
  className?: string;
}) {
  return (
    <div className={`absolute left-8 top-10 bottom-[-70px] w-[250px] ${className}`} aria-label={`Exemple de l’agent WhatsApp ${name}`}>
      <div className="absolute inset-0 rounded-[38px] bg-[#0b0c17] border border-white/15 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] rotate-[4deg] origin-bottom">
        <div className="absolute inset-[6px] rounded-[32px] bg-[#f4f4f7] overflow-hidden">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 h-6 w-24 rounded-full bg-[#0b0c17]" aria-hidden />
          <div className="pt-12 px-3 flex flex-col gap-2 text-navy">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <span className="size-7 rounded-full bg-navy text-white inline-flex items-center justify-center text-[10px] font-bold" aria-hidden>
                {initials}
              </span>
              <p className="text-[11px] font-semibold">{name}</p>
            </div>
            <div className="self-start max-w-[92%] rounded-[14px] rounded-bl-[4px] bg-white border border-line px-3 py-2 text-[11px] leading-[1.35]">{greeting}</div>
          </div>
        </div>
      </div>
      <span className="absolute -top-4 -right-5 inline-flex size-11 items-center justify-center rounded-xl bg-navy text-white text-[13px] font-bold border border-white/20 shadow-lg rotate-[4deg]" aria-hidden>
        {initials}
      </span>
      <ul className="absolute left-[172px] top-[232px] flex flex-col gap-2.5" aria-label="Ce que l’agent prend en charge">
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
