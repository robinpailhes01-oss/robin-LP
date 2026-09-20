/** Agenda de réservation dessiné en CSS : créneaux du jour, réservation confirmée, email envoyé. */
export function CalendarMock({ initials, name, title, chips, className = "" }: { initials: string; name: string; title: string; chips: string[]; className?: string }) {
  const slots = [
    { time: "09:00", label: "Coupe + barbe", state: "booked" },
    { time: "09:45", label: "Disponible", state: "free" },
    { time: "10:30", label: "Coupe", state: "booked" },
    { time: "11:15", label: "Réservé à l’instant", state: "new" },
    { time: "12:00", label: "Disponible", state: "free" },
  ] as const;
  return (
    <div className={`absolute left-6 top-10 bottom-[-40px] w-[280px] ${className}`} aria-label={`Exemple de l’agenda de ${name}`}>
      <div className="absolute inset-0 rounded-[18px] bg-white text-navy border border-line shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] rotate-[-3deg] origin-bottom overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-card">
          <div className="flex items-center gap-2">
            <span className="size-7 rounded-md bg-navy text-white inline-flex items-center justify-center text-[10px] font-bold" aria-hidden>
              {initials}
            </span>
            <p className="text-[11px] font-semibold">{title}</p>
          </div>
          <span className="text-[10px] font-medium text-muted">Samedi</span>
        </div>
        <ul className="px-4 py-3 flex flex-col gap-2">
          {slots.map((sl) => (
            <li
              key={sl.time}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
                sl.state === "new" ? "border-violet bg-violet-tint" : sl.state === "booked" ? "border-line bg-card" : "border-dashed border-line"
              }`}
            >
              <span className="text-[10px] font-semibold tabular-nums text-muted w-9">{sl.time}</span>
              <span className={`text-[11px] font-medium ${sl.state === "free" ? "text-muted" : ""}`}>{sl.label}</span>
              {sl.state === "new" && <span className="ml-auto size-2 rounded-full bg-violet" aria-hidden />}
            </li>
          ))}
        </ul>
        <div className="mx-4 mb-4 flex items-center gap-2 rounded-lg bg-[#e6f7ee] text-[#1d8a4e] px-3 py-2 text-[10px] font-semibold">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Confirmation envoyée par email
        </div>
      </div>
      <span className="absolute -top-4 -right-5 inline-flex size-11 items-center justify-center rounded-xl bg-navy text-white text-[13px] font-bold border border-white/20 shadow-lg rotate-[-3deg]" aria-hidden>
        {initials}
      </span>
      <ul className="absolute left-[200px] top-[150px] flex flex-col gap-2.5" aria-label="Ce que l’outil prend en charge">
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
