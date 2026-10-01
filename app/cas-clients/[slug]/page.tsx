import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/sections/Home";
import { BackLink } from "@/components/ui/BackLink";
import { Arrow } from "@/components/ui/Button";
import { CaseVideo } from "@/components/ui/CaseVideo";
import { ClientMark } from "@/components/ui/ClientMark";
import { Kicker } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ToolIcon } from "@/components/ui/ToolIcons";
import { caseStudies, casesIndex } from "@/lib/content";

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

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = caseStudies.items.findIndex((i) => i.slug === slug);
  const c = caseStudies.items[index];
  if (!c) notFound();
  const prev = caseStudies.items[index - 1];
  const next = caseStudies.items[index + 1];

  return (
    <>
      {/* En-tête clair */}
      <section className="bg-white pt-24 sm:pt-28 lg:pt-32 pb-16 md:pb-20">
        <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8">
          <BackLink href="/cas-clients" label={casesIndex.back} />
          <div className="mt-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-4">
                <ClientMark c={c} size="lg" />
                <div>
                  <p className="t-kicker">Réalisation</p>
                  <p className="mt-1 text-[15px] font-medium text-ink">{c.sector}</p>
                </div>
              </div>
              <h1 className="t-h1 mt-8">{c.client}</h1>
              <p className="t-lead mt-6 max-w-[38rem]">{c.headline}</p>
            </div>
            <ul className="lg:col-span-4 flex flex-col gap-3">
              {c.stats.map((st) => (
                <li key={st.label} className="rounded-[20px] bg-mist px-6 py-5">
                  <p className="font-display text-[44px] md:text-[52px] font-extrabold tracking-[-0.025em] leading-none text-night whitespace-nowrap">{st.value}</p>
                  <p className="mt-2 text-[14px] text-ink">{st.label}</p>
                </li>
              ))}
            </ul>
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

      {/* Résumé */}
      <section className="bg-white pb-20 md:pb-28">
        <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start border-t border-line pt-12 md:pt-16">
          <Reveal className="lg:col-span-8">
            <p className="text-[clamp(1.2rem,1.05rem+0.7vw,1.6rem)] font-medium tracking-[-0.01em] leading-[1.45] text-night max-w-[44rem]">{c.description}</p>
          </Reveal>
          {c.tools.length > 0 && (
            <Reveal className="lg:col-span-4 lg:justify-self-end" delay={0.06}>
              <p className="t-kicker">Connecté à</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {c.tools.map((t) => (
                  <li key={t} className="inline-flex items-center gap-2 rounded-full bg-white border border-line px-3 h-10 text-[14px] font-semibold text-night">
                    <ToolIcon name={t} size={18} />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
        </div>
      </section>

      {/* Le besoin, ce qui a été construit */}
      <Section tone="mist">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <Kicker>Le point de départ</Kicker>
            <h2 className="t-h2 mt-5 text-[clamp(1.6rem,1.2rem+1.4vw,2.25rem)]">Le besoin</h2>
            <p className="t-body mt-5">{c.need}</p>
          </Reveal>
          <Reveal className="lg:col-start-6 lg:col-span-7" delay={0.06}>
            <Kicker>La solution</Kicker>
            <h2 className="t-h2 mt-5 text-[clamp(1.6rem,1.2rem+1.4vw,2.25rem)]">Ce qui a été mis en place</h2>
            <ul className="mt-8 flex flex-col">
              {c.built.map((b) => (
                <li key={b.title} className="border-t border-night/20 py-6">
                  <h3 className="t-h3">{b.title}</h3>
                  <p className="t-body mt-2 text-[15px]">{b.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Résultats */}
      <Section>
        <Reveal>
          <Kicker>Ce qui a changé</Kicker>
          <h2 className="t-h2 mt-5 text-[clamp(1.6rem,1.2rem+1.4vw,2.25rem)]">Le résultat</h2>
        </Reveal>
        <ul className="mt-10 grid md:grid-cols-3 gap-x-8 gap-y-6">
          {c.outcomes.map((o, i) => (
            <li key={o}>
              <Reveal delay={i * 0.05} className="flex gap-3 border-t-2 border-night pt-5">
                <svg width="18" height="18" viewBox="0 0 12 12" fill="none" aria-hidden className="mt-0.5 shrink-0 text-night">
                  <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-[16px] font-medium leading-[1.5] text-night">{o}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Navigation entre réalisations */}
        <nav aria-label="Autres réalisations" className="mt-20 grid sm:grid-cols-2 gap-4 border-t border-line pt-6">
          {prev ? (
            <Link href={`/cas-clients/${prev.slug}`} className="group flex items-center gap-3 min-h-11 text-[15px] font-medium text-ink hover:text-night">
              <span className="rotate-180">
                <Arrow />
              </span>
              <span>
                <span className="block text-[12px] uppercase tracking-[0.14em] text-muted">{casesIndex.prevCase}</span>
                {prev.client}
              </span>
            </Link>
          ) : (
            <BackLink href="/cas-clients" label={casesIndex.back} />
          )}
          {next && (
            <Link href={`/cas-clients/${next.slug}`} className="group flex items-center sm:justify-end gap-3 min-h-11 text-[15px] font-medium text-ink hover:text-night sm:text-right">
              <span>
                <span className="block text-[12px] uppercase tracking-[0.14em] text-muted">{casesIndex.nextCase}</span>
                {next.client}
              </span>
              <Arrow />
            </Link>
          )}
        </nav>
      </Section>

      <Contact />
    </>
  );
}
