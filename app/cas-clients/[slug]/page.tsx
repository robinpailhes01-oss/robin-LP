import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OpenContactButton } from "@/components/contact/OpenContactButton";
import { BackLink } from "@/components/sections/WhatsAppTeaser";
import { Arrow } from "@/components/ui/Button";
import { CaseVideo } from "@/components/ui/CaseVideo";
import { CaseVisual } from "@/components/ui/CaseVisual";
import { Reveal } from "@/components/ui/Reveal";
import { ToolIcon } from "@/components/ui/ToolIcons";
import { caseStudies, casesIndex, finalCta } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return caseStudies.items.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = caseStudies.items.find((i) => i.slug === slug);
  if (!c) return {};
  return { title: `${c.client} · Cas client`, description: c.summary };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = caseStudies.items.findIndex((i) => i.slug === slug);
  const c = caseStudies.items[index];
  if (!c) notFound();
  const prev = caseStudies.items[index - 1];
  const next = caseStudies.items[index + 1];

  return (
    <>
      {/* En-tête sombre */}
      <section className="relative overflow-hidden bg-[linear-gradient(100deg,#0f1124_0%,#171533_50%,#1f1a4e_100%)] text-white pt-28 md:pt-36 pb-14 md:pb-20">
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_70%_at_85%_40%,rgba(99,80,255,0.4),transparent_70%)]" />
        <div className="relative mx-auto max-w-luma px-6">
          <div className="text-white/60 [&_a]:text-white/60 [&_a:hover]:text-white">
            <BackLink href="/cas-clients" label={caseStudies.back} />
          </div>
          <div className="mt-8 grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-white text-navy text-[15px] font-bold" aria-hidden>
                  {c.initials}
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">Cas client</p>
                  <p className="text-[14px] font-medium text-white/85">{c.sector}</p>
                </div>
              </div>
              <h1 className="t-h1 mt-7">{c.client}</h1>
              <p className="mt-6 text-[clamp(1.0625rem,1rem+0.35vw,1.25rem)] leading-[1.5] text-white/75 max-w-[600px]">{c.headline}</p>
              <ul className="mt-9 flex flex-wrap gap-3">
                {c.stats.map((st) => (
                  <li key={st.label} className="rounded-2xl bg-white/[0.06] border border-white/12 backdrop-blur px-5 py-4 min-w-[180px]">
                    <p className="text-[40px] md:text-[48px] font-bold tracking-[-0.04em] leading-none text-[#9d8dff] whitespace-nowrap">{st.value}</p>
                    <p className="text-[13px] text-white/70 mt-2 max-w-[200px]">{st.label}</p>
                  </li>
                ))}
                {c.built.map((b) => (
                  <li key={b.title} className="rounded-2xl bg-white/[0.06] border border-white/12 backdrop-blur px-5 py-4 flex items-center">
                    <p className="text-[14px] font-semibold">{b.title}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:block lg:col-span-5 relative min-h-[440px]">
              <CaseVisual c={c} />
            </div>
          </div>
        </div>
      </section>

      {/* Vidéo */}
      <section className="relative -mt-8 md:-mt-10 pb-10 md:pb-14">
        <div className="mx-auto max-w-luma px-6">
          <Reveal>
            <div className="rounded-[26px] bg-white p-2 border border-line shadow-[0_40px_80px_-50px_rgba(18,16,43,0.5)]">
              <CaseVideo url={c.videoUrl} title={`Cas client ${c.client}`} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Résumé + outils */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-luma px-6 grid lg:grid-cols-12 gap-8 items-start">
          <Reveal className="lg:col-span-8">
            <p className="text-[clamp(1.25rem,1.1rem+0.9vw,1.75rem)] font-semibold tracking-[-0.02em] leading-[1.3] max-w-[760px]">{c.description}</p>
          </Reveal>
          {c.tools.length > 0 && (
            <Reveal className="lg:col-span-4 lg:justify-self-end" delay={0.08}>
              <div className="rounded-2xl bg-card border border-line p-5">
                <p className="t-kicker text-muted">Connecté à</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {c.tools.map((t) => (
                    <li key={t} className="inline-flex items-center gap-2 rounded-full bg-white border border-line px-3 h-9 text-[13px] font-semibold">
                      <ToolIcon name={t} size={18} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Frise : besoin → construit */}
      <section className="py-12 md:py-20 bg-card/60">
        <div className="mx-auto max-w-luma px-6">
          <ol className="relative grid lg:grid-cols-12 gap-8">
            <span aria-hidden className="hidden lg:block absolute left-[calc(33.333%-16px)] top-2 bottom-2 w-px bg-line" />
            <li className="lg:col-span-4 lg:pr-12">
              <Reveal>
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-navy text-white text-[13px] font-bold tabular-nums">1</span>
                <h2 className="t-h2 text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] mt-5">Le besoin</h2>
                <p className="t-body mt-4">{c.need}</p>
              </Reveal>
            </li>
            <li className="lg:col-span-8 lg:pl-8">
              <Reveal delay={0.08}>
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-violet text-white text-[13px] font-bold tabular-nums">2</span>
                <h2 className="t-h2 text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] mt-5">Ce qu’on a construit</h2>
                <ul className="mt-6 grid sm:grid-cols-2 gap-4">
                  {c.built.map((b) => (
                    <li key={b.title} className="rounded-2xl bg-white border border-line p-6 transition-[transform,box-shadow] duration-300 ease-[var(--ease-luma)] hover:-translate-y-1 hover:shadow-[0_24px_40px_-30px_rgba(18,16,43,0.35)]">
                      <h3 className="t-h3">{b.title}</h3>
                      <p className="t-body mt-2 text-[15px]">{b.text}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          </ol>
        </div>
      </section>

      {/* Résultats */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-luma px-6">
          <Reveal>
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-violet text-white text-[13px] font-bold tabular-nums">3</span>
            <h2 className="t-h2 text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] mt-5">Le résultat</h2>
          </Reveal>
          <div className="mt-8 grid lg:grid-cols-12 gap-4">
            {c.stats.map((st) => (
              <Reveal key={st.label} className="lg:col-span-4">
                <div className="h-full rounded-[22px] bg-violet text-white p-8 relative overflow-hidden">
                  <span aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-white/10 blur-2xl" />
                  <p className="relative text-[64px] md:text-[72px] font-bold tracking-[-0.04em] leading-none whitespace-nowrap">{st.value}</p>
                  <p className="relative text-[15px] text-white/85 mt-3">{st.label}</p>
                </div>
              </Reveal>
            ))}
            <Reveal className={c.stats.length === 1 ? "lg:col-span-8" : "lg:col-span-12"} delay={0.08}>
              <ul className="h-full grid sm:grid-cols-3 gap-4">
                {c.outcomes.map((o) => (
                  <li key={o} className="rounded-2xl bg-card border border-line p-6 flex flex-col gap-3">
                    <svg width="18" height="18" viewBox="0 0 12 12" fill="none" aria-hidden className="text-violet">
                      <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-[15px] font-medium leading-[1.45]">{o}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Navigation entre cas */}
      <section className="pb-4">
        <div className="mx-auto max-w-luma px-6">
          <div className="grid sm:grid-cols-2 gap-4 border-t border-line pt-6">
            {prev ? (
              <Link href={`/cas-clients/${prev.slug}`} className="group flex items-center gap-3 text-[14px] font-medium text-body hover:text-navy">
                <span className="rotate-180 transition-transform group-hover:-translate-x-1"><Arrow /></span>
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.14em] text-muted">{casesIndex.prevCase}</span>
                  {prev.client}
                </span>
              </Link>
            ) : (
              <BackLink href="/cas-clients" label={caseStudies.back} />
            )}
            {next && (
              <Link href={`/cas-clients/${next.slug}`} className="group flex items-center justify-end gap-3 text-[14px] font-medium text-body hover:text-navy sm:text-right">
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.14em] text-muted">{casesIndex.nextCase}</span>
                  {next.client}
                </span>
                <span className="transition-transform group-hover:translate-x-1"><Arrow /></span>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-luma px-6">
          <Reveal>
            <div className="rounded-[22px] bg-navy text-white px-7 py-12 md:px-12 md:py-16 text-center relative overflow-hidden">
              <span aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-violet/50 blur-3xl" />
              <h2 className="t-h2 relative">{finalCta.title}</h2>
              <p className="relative mt-4 text-[16px] leading-[1.55] text-white/75 max-w-[520px] mx-auto">{finalCta.text}</p>
              <div className="relative mt-8">
                <OpenContactButton variant="white" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
