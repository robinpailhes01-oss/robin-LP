import Link from "next/link";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { PhoneMock } from "@/components/ui/PhoneMock";
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

function CaseBand({ c }: { c: CaseStudy }) {
  return (
    <article className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(100deg,#13152a_0%,#191736_55%,#1f1a4e_100%)] text-white">
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_80%_60%,rgba(99,80,255,0.35),transparent_70%)]" />

      <div className="relative grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 px-7 pt-9 pb-8 md:px-12 md:pt-12 md:pb-10 flex flex-col">
          <Pill dark>{caseStudies.pill}</Pill>
          <h2 className="mt-5 text-[clamp(1.75rem,1.2rem+2vw,2.5rem)] font-bold tracking-[-0.03em] leading-[1.1] max-w-[520px]">{c.headline}</h2>
          <p className="mt-4 text-[15px] md:text-[16px] leading-[1.55] text-white/75 max-w-[480px]">{c.description}</p>

          <div className="mt-7 flex items-center gap-3">
            <ButtonLink href={`/cas-clients/${c.slug}`} variant="white" className="h-11 text-[14px]">
              <span className="hidden sm:inline">{caseStudies.cta}</span>
              <span className="sm:hidden">{caseStudies.ctaShort}</span>
              <Arrow />
            </ButtonLink>
            <span className="sm:hidden inline-flex size-11 items-center justify-center rounded-xl bg-white text-navy text-[13px] font-bold" aria-hidden>
              {c.initials}
            </span>
          </div>

          <ul className="mt-9 md:mt-auto md:pt-10 flex flex-col sm:flex-row sm:divide-x divide-white/15 gap-4 sm:gap-0">
            {c.stats.map((st) => (
              <li key={st.label} className="sm:px-8 first:pl-0 flex sm:flex-col items-baseline sm:items-start gap-3 sm:gap-1">
                <span className="text-[36px] md:text-[40px] font-bold tracking-[-0.04em] leading-none text-[#8f7dff] whitespace-nowrap">{st.value}</span>
                <span className="text-[13px] text-white/65 leading-[1.3]">{st.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden lg:block lg:col-span-5 relative min-h-[420px]">
          <PhoneMock initials={c.initials} name={c.client} greeting={c.greeting} chips={c.chips} />
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

/** Carte compacte d’un cas client, utilisée sur la page /cas-clients. */
export function CaseCard({ c }: { c: CaseStudy }) {
  return (
    <Link
      href={`/cas-clients/${c.slug}`}
      className="group h-full flex flex-col rounded-2xl bg-card border border-line p-6 md:p-7 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-luma)] hover:-translate-y-1 hover:border-violet/25 hover:shadow-[0_24px_40px_-30px_rgba(18,16,43,0.35)]"
    >
      <div className="flex items-center justify-between">
        <p className="t-kicker text-muted">{c.sector}</p>
        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-navy text-white text-[12px] font-bold" aria-hidden>
          {c.initials}
        </span>
      </div>
      <h3 className="mt-3 text-[24px] font-bold tracking-[-0.03em] leading-[1.1]">{c.client}</h3>
      <p className="t-body mt-3 text-[15px] flex-1">{c.summary}</p>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {c.stats.map((st) => (
          <div key={st.label}>
            <p className="text-[32px] font-bold tracking-[-0.04em] leading-none text-violet whitespace-nowrap">{st.value}</p>
            <p className="text-[12px] text-body mt-1">{st.label}</p>
          </div>
        ))}
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-violet">
        {caseStudies.ctaShort}
        <span className="transition-transform duration-300 ease-[var(--ease-luma)] group-hover:translate-x-1">
          <Arrow />
        </span>
      </span>
    </Link>
  );
}
