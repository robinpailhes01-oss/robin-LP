import Link from "next/link";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { CaseVisual } from "@/components/ui/CaseVisual";
import { ClientMark, caseVars } from "@/components/ui/ClientMark";
import { caseStudies, type CaseStudy } from "@/lib/content";

/** Bandeau sombre par étude de cas, d’après la maquette : titre, chiffres, téléphone avec l’agent WhatsApp. */
export function CaseStudies() {
  return (
    <section id="cas-clients" className="py-10 md:py-14 scroll-mt-20">
      <div className="mx-auto max-w-luma px-6 flex flex-col gap-6">
        {caseStudies.items.map((c) => (
          <Reveal key={c.slug}>
            <CaseBand c={c} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function CaseBand({ c, headingLevel = "h2" }: { c: CaseStudy; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article style={caseVars(c)} className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(100deg,#13152a_0%,#191736_55%,#1f1a4e_100%)] text-white">
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_80%_60%,color-mix(in_srgb,var(--case-accent)_38%,transparent),transparent_70%)]" />

      <div className="relative grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 px-7 pt-9 pb-8 md:px-12 md:pt-12 md:pb-10 flex flex-col">
          <div className="flex items-center gap-3">
            <ClientMark c={c} size="md" />
            <Pill dark>{caseStudies.pill}</Pill>
          </div>
          <Heading className="mt-5 text-[clamp(1.75rem,1.2rem+2vw,2.5rem)] font-bold tracking-[-0.03em] leading-[1.1] max-w-[520px]">{c.headline}</Heading>
          <p className="mt-4 text-[15px] md:text-[16px] leading-[1.55] text-white/75 max-w-[480px]">{c.description}</p>

          <div className="mt-7 flex items-center gap-3">
            <ButtonLink href={`/cas-clients/${c.slug}`} variant="white" className="h-11 text-[14px]">
              <span className="hidden sm:inline">{caseStudies.cta}</span>
              <span className="sm:hidden">{caseStudies.ctaShort}</span>
              <Arrow />
            </ButtonLink>

          </div>

          <ul className="mt-9 md:mt-auto md:pt-10 flex flex-col sm:flex-row sm:divide-x divide-white/15 gap-4 sm:gap-0">
            {c.stats.map((st) => (
              <li key={st.label} className="sm:px-8 first:pl-0 flex sm:flex-col items-baseline sm:items-start gap-3 sm:gap-1">
                <span className="text-[36px] md:text-[40px] font-bold tracking-[-0.04em] leading-none text-[var(--case-accent)] whitespace-nowrap">{st.value}</span>
                <span className="text-[13px] text-white/65 leading-[1.3]">{st.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden lg:block lg:col-span-5 relative min-h-[420px]">
          <CaseVisual c={c} />
          <p
            className="absolute right-6 bottom-8 text-[26px] leading-[1.05] text-[#b9adff] rotate-[-6deg] whitespace-nowrap"
            style={{ fontFamily: "var(--font-hand)" }}
            aria-hidden
          >
            {caseStudies.annotation}
            <svg className="absolute left-4 -top-12" width="34" height="48" viewBox="0 0 34 48" fill="none" aria-hidden>
              <path d="M26 44C28 30 22 16 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 12l-8-6-1 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </p>
        </div>
      </div>
    </article>
  );
}

/** Carte d’un cas client : visuel de conversation en tête, contenu, résultat. Utilisée sur /cas-clients. */
export function CaseCard({ c }: { c: CaseStudy }) {
  return (
    <Link
      href={`/cas-clients/${c.slug}`}
      style={caseVars(c)}
      className="group h-full flex flex-col overflow-hidden rounded-[22px] bg-white border border-line transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-luma)] hover:-translate-y-1 hover:border-violet/30 hover:shadow-[0_30px_60px_-36px_rgba(18,16,43,0.4)]"
    >
      <div className="relative h-[190px] bg-[linear-gradient(100deg,#13152a_0%,#191736_55%,#1f1a4e_100%)] overflow-hidden">
        <span aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_90%_at_85%_80%,color-mix(in_srgb,var(--case-accent)_45%,transparent),transparent_70%)]" />
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 h-7 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
            {c.sector}
          </span>
          <ClientMark c={c} size="sm" />
        </div>
        {c.visual === "chat" ? (
          <div className="absolute left-5 right-5 bottom-5 flex flex-col gap-2 transition-transform duration-500 ease-[var(--ease-luma)] group-hover:-translate-y-1" aria-hidden>
            <span className="self-start max-w-[85%] rounded-[14px] rounded-bl-[4px] bg-white text-navy px-3 py-2 text-[12px] leading-[1.35] shadow-lg">{c.greeting}</span>
            <span className="self-end inline-flex items-center gap-1.5 rounded-full bg-violet text-white px-2.5 h-6 text-[11px] font-medium">
              <span className="size-1.5 rounded-full bg-white" />
              {c.chips[0]}
            </span>
          </div>
        ) : c.visual === "calendar" ? (
          <div className="absolute left-5 right-5 bottom-5 rounded-xl bg-white text-navy p-3 shadow-lg transition-transform duration-500 ease-[var(--ease-luma)] group-hover:-translate-y-1" aria-hidden>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold">{c.greeting}</p>
              <span className="text-[10px] text-muted">Samedi</span>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              {[["09:00", "Coupe + barbe", false], ["11:15", "Réservé à l’instant", true]].map(([t, l, n]) => (
                <div key={String(t)} className={`flex items-center gap-2 rounded-md border px-2 py-1 text-[10px] ${n ? "border-violet bg-violet-tint" : "border-line bg-card"}`}>
                  <span className="text-muted tabular-nums">{t}</span>
                  <span className="font-medium">{l}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="absolute left-5 right-5 bottom-5 rounded-xl bg-white text-navy p-3 shadow-lg transition-transform duration-500 ease-[var(--ease-luma)] group-hover:-translate-y-1" aria-hidden>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold">{c.greeting}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e6f7ee] text-[#1d8a4e] px-2 h-5 text-[10px] font-semibold">Valide</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {["Client", "Montant", "Signature"].map((f) => (
                <span key={f} className="rounded-md border border-line px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-muted">{f}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col p-6 md:p-7">
        <h3 className="text-[24px] font-bold tracking-[-0.03em] leading-[1.1]">{c.client}</h3>
        <p className="t-body mt-3 text-[15px] flex-1">{c.summary}</p>
        <div className="mt-6 pt-5 border-t border-line flex items-end justify-between gap-4">
          <div className="flex gap-6">
            {c.stats.slice(0, 2).map((st) => (
              <div key={st.label}>
                <p className="text-[30px] font-bold tracking-[-0.04em] leading-none text-[var(--case-ink)] whitespace-nowrap">{st.value}</p>
                <p className="text-[12px] text-body mt-1 max-w-[140px]">{st.label}</p>
              </div>
            ))}
          </div>
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-card border border-line text-navy transition-[background-color,color,transform] duration-300 ease-[var(--ease-luma)] group-hover:bg-[var(--case-ink)] group-hover:text-white group-hover:translate-x-1">
            <Arrow />
          </span>
        </div>
      </div>
    </Link>
  );
}
