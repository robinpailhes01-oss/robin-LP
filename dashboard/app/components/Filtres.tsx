"use client";

import Link from "next/link";

type Option = { valeur: string; label: string };
type Champ = { nom: string; label: string; options: Option[]; valeur: string };

// Formulaire GET : les filtres vivent dans l'URL, donc un lien filtré se partage et survit au rafraîchissement.
export function Filtres({ champs, recherche, actifs }: { champs: Champ[]; recherche: string; actifs: boolean }) {
  return (
    <form method="get" action="/leads" className="grid grid-cols-2 gap-2 sm:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
      <label className="col-span-2 sm:col-span-1">
        <span className="sr-only">Rechercher un nom</span>
        <input
          type="search"
          name="q"
          defaultValue={recherche}
          placeholder="Rechercher un nom"
          enterKeyHint="search"
          className="h-11 w-full rounded-lg border border-line-strong bg-surface px-3 text-[15px] text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>
      {champs.map((c) => (
        <label key={c.nom} className="relative">
          <span className="sr-only">{c.label}</span>
          <select
            name={c.nom}
            defaultValue={c.valeur}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className={`h-11 w-full appearance-none truncate rounded-lg border bg-surface pl-3 pr-8 text-[14px] focus:border-accent focus:outline-none ${
              c.valeur ? "border-accent text-ink" : "border-line-strong text-ink-2"
            }`}
          >
            <option value="">{c.label}</option>
            {c.options.map((o) => (
              <option key={o.valeur} value={o.valeur}>
                {o.label}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-muted" viewBox="0 0 12 12" aria-hidden>
            <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </label>
      ))}
      <div className="col-span-2 flex items-center gap-4 sm:col-span-5">
        <button type="submit" className="sr-only focus:not-sr-only focus:text-[13px] focus:text-accent">
          Appliquer les filtres
        </button>
        {actifs && (
          <Link href="/leads" className="text-[13px] font-medium text-accent hover:text-accent-strong">
            Effacer les filtres
          </Link>
        )}
      </div>
    </form>
  );
}
