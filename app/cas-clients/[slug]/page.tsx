import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseVisual } from "@/components/cases/CaseVisual";
import { Contact } from "@/components/sections/Home";
import { BackLink } from "@/components/ui/BackLink";
import { Arrow } from "@/components/ui/Button";
import { CaseVideo } from "@/components/ui/CaseVideo";
import { ClientMark } from "@/components/ui/ClientMark";
import { Kicker } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ToolIcon } from "@/components/ui/ToolIcons";
import { caseStudies, casesIndex, type CaseStudy } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return caseStudies.items.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = caseStudies.items.find((i) => i.slug === slug);
  if (!c) return {};
  return { title: `${c.client} · Réalisation`, description: c.summary };
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden className={`shrink-0 ${className}`}>
      <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const items = caseStudies.items;
  const index = items.findIndex((i) => i.slug === slug);
  const c = items[index];
  if (!c) notFound();
  const next = items[(index + 1) % items.length];
  const testimonial = (c as CaseStudy).testimonial;

  return (
    <>
      {/* En-tête : le client, la phrase clé, le visuel de l’outil */}
      <section className="bg-white pb-16 pt-24 sm:pt-28 md:pb-24 lg:pt-32">
        <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8">
          <BackLink href="/cas-clients" label={casesIndex.back} />
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-4">
                <ClientMark c={c} size="lg" />
                <div>
                  <p className="t-kicker">Réalisation</p>
                  <p className="mt-1 text-[15px] font-medium text-ink">{c.sector}</p>
                </div>
              </div>
              <h1 className="t-h1 mt-8">{c.client}</h1>
              <p className="t-lead mt-6 max-w-[34rem]">{c.headline}</p>
              <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-6 border-t border-line pt-8">
                {c.stats.map((st) => (
                  <li key={st.label}>
                    <p className="whitespace-nowrap font-display text-[48px] font-extrabold leading-none tracking-[-0.03em] text-night md:text-[56px]">{st.value}</p>
                    <p className="mt-2 max-w-[15rem] text-[14px] leading-[1.4] text-ink">{st.label}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-6">
              <CaseVisual slug={c.slug} size="lg" />
            </div>
          </div>
        </div>
      </section>

      {c.videoUrl && (
        <section className="bg-white pb-16 md:pb-20">
          <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8">
            <CaseVideo url={c.videoUrl} title={`Réalisation ${c.client}`} />
          </div>
        </section>
      )}

      {/* Le récit en une phrase */}
      <section className="bg-white pb-20 md:pb-28">
        <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-[52rem] text-center">
            <p className="text-[clamp(1.25rem,1.05rem+0.9vw,1.85rem)] font-medium leading-[1.45] tracking-[-0.012em] text-night">{c.description}</p>
            {c.tools.length > 0 && (
              <ul className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <li className="mr-1 text-[13px] font-semibold text-muted">{casesIndex.tools}</li>
                {c.tools.map((t) => (
                  <li key={t} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-3 text-[14px] font-semibold text-night">
                    <ToolIcon name={t} size={18} />
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </div>
      </section>

      {/* Avant : le besoin. Puis ce qui a été construit, étape par étape. */}
      <Section tone="mist">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <div className="h-full rounded-[28px] bg-white p-7 md:p-9">
              <Kicker>{casesIndex.need}</Kicker>
              <p className="mt-6 text-[clamp(1.1rem,1rem+0.4vw,1.3rem)] leading-[1.55] text-night">{c.need}</p>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.06}>
            <div className="h-full rounded-[28px] bg-white p-7 md:p-9">
              <Kicker>{casesIndex.built}</Kicker>
              <ol className="relative mt-7 flex flex-col gap-7">
                <span aria-hidden className="absolute bottom-4 left-[19px] top-4 w-px bg-powder" />
                {c.built.map((b, i) => (
                  <li key={b.title} className="relative flex gap-5">
                    <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-night font-display text-[15px] font-bold text-white">{i + 1}</span>
                    <div className="pt-1.5">
                      <h2 className="t-h3">{b.title}</h2>
                      <p className="t-body mt-1.5 text-[15px]">{b.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Après : le résultat, sur fond bleu nuit */}
      <section className="bg-night py-20 text-white md:py-28">
        <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8">
          <Reveal>
            <p className="t-kicker inline-flex items-center gap-2.5 text-powder">
              <span className="h-px w-6 bg-powder" aria-hidden />
              {casesIndex.result}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <ul className="flex flex-col gap-8 lg:col-span-5">
              {c.stats.map((st, i) => (
                <li key={st.label}>
                  <Reveal delay={i * 0.06}>
                    <p className="whitespace-nowrap font-display text-[clamp(3.2rem,2.4rem+3vw,5.5rem)] font-extrabold leading-none tracking-[-0.035em]">{st.value}</p>
                    <p className="mt-3 max-w-[20rem] text-[16px] leading-[1.45] text-white/75">{st.label}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col lg:col-span-7 lg:col-start-6">
              {c.outcomes.map((o, i) => (
                <li key={o} className="border-t border-white/15 py-6 first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-6">
                  <Reveal delay={i * 0.05} className="flex gap-4">
                    <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-night">
                      <Check />
                    </span>
                    <p className="text-[clamp(1.05rem,1rem+0.3vw,1.25rem)] font-medium leading-[1.45]">{o}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {testimonial && (
        <Section>
          <Reveal className="mx-auto max-w-[48rem] text-center">
            <Kicker>{casesIndex.quote}</Kicker>
            <blockquote className="mt-8">
              <p className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] font-bold leading-[1.25] tracking-[-0.02em] text-night">« {testimonial.quote} »</p>
              <footer className="mt-8 flex items-center justify-center gap-3">
                <ClientMark c={c} size="sm" />
                <span className="text-left leading-tight">
                  <span className="block text-[15px] font-semibold text-night">{testimonial.author}</span>
                  <span className="block text-[13px] text-muted">{testimonial.role}</span>
                </span>
              </footer>
            </blockquote>
          </Reveal>
        </Section>
      )}

      {/* Réalisation suivante */}
      <Section tone="paper">
        {next && next.slug !== c.slug && (
          <Reveal>
            <Link href={`/cas-clients/${next.slug}`} className="group grid items-center gap-6 rounded-[28px] border border-line bg-white p-3 transition-[border-color,box-shadow] duration-300 hover:border-powder hover:shadow-[0_30px_60px_-40px_rgba(23,38,61,0.55)] md:grid-cols-2 md:gap-10">
              <div className="order-2 px-4 pb-4 md:order-1 md:px-7 md:pb-0">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">{casesIndex.nextCase}</p>
                <div className="mt-5 flex items-center gap-3">
                  <ClientMark c={next} size="md" />
                  <p className="font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold tracking-[-0.02em] text-night">{next.client}</p>
                </div>
                <p className="mt-4 max-w-[28rem] text-[16px] leading-[1.5] text-ink">{next.summary}</p>
                <span className="mt-6 inline-flex min-h-11 items-center gap-3 text-[15px] font-semibold text-night">
                  {casesIndex.read}
                  <span className="inline-flex size-10 items-center justify-center rounded-full border border-powder transition-colors duration-200 group-hover:border-night group-hover:bg-night group-hover:text-white">
                    <Arrow />
                  </span>
                </span>
              </div>
              <div className="order-1 md:order-2">
                <CaseVisual slug={next.slug} />
              </div>
            </Link>
          </Reveal>
        )}
      </Section>

      <Contact />
    </>
  );
}
