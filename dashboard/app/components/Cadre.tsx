import Link from "next/link";
import { modeDemo } from "@/lib/db";

type Onglet = "apercu" | "leads";

const ONGLETS: { id: Onglet; href: string; label: string }[] = [
  { id: "apercu", href: "/", label: "Vue d'ensemble" },
  { id: "leads", href: "/leads", label: "Leads" },
];

export function Logo() {
  return (
    <span className="inline-flex items-start gap-0.5 text-[18px] font-bold leading-none tracking-[-0.04em] text-ink">
      Luma
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" className="-mt-0.5 text-accent" aria-hidden>
        <path d="M8 0c.6 4.6 3.4 7.4 8 8-4.6.6-7.4 3.4-8 8-.6-4.6-3.4-7.4-8-8 4.6-.6 7.4-3.4 8-8z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Cadre({ actif, children }: { actif: Onglet; children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[72rem] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Luma prospection, vue d'ensemble">
            <Logo />
            <span className="hidden h-4 w-px bg-line-strong sm:block" aria-hidden />
            <span className="hidden text-[13px] text-muted sm:block">Prospection</span>
          </Link>
          <nav aria-label="Sections" className="flex h-full gap-6">
            {ONGLETS.map((o) => {
              const courant = o.id === actif;
              return (
                <Link
                  key={o.id}
                  href={o.href}
                  aria-current={courant ? "page" : undefined}
                  className={`relative flex h-full items-center text-[14px] transition-colors ${
                    courant
                      ? "font-medium text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-accent"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {o.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {modeDemo && (
        <div className="border-b border-accent-track bg-accent-tint">
          <p className="mx-auto max-w-[72rem] px-4 py-2 text-[13px] leading-5 text-ink-2 sm:px-6">
            <span className="repere mr-2 !text-accent">Démo</span>
            Données fictives : Supabase n&apos;est pas encore branché, rien n&apos;est enregistré.
          </p>
        </div>
      )}

      <main className="mx-auto max-w-[72rem] px-4 pb-24 pt-6 sm:px-6 sm:pt-10">{children}</main>
    </>
  );
}

export function TitreSection({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{children}</h2>
      {aside && <p className="repere text-right">{aside}</p>}
    </div>
  );
}
