import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContactProvider } from "@/components/contact/ContactContext";
import { ContactPanel } from "@/components/contact/ContactPanel";
import { OpenContactButton } from "@/components/contact/OpenContactButton";
import { CaseVideo } from "@/components/ui/CaseVideo";
import { Pill } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { caseStudies, finalCta } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return caseStudies.items.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = caseStudies.items.find((i) => i.slug === slug);
  if (!c) return {};
  return { title: `${c.client} · Cas client Luma`, description: c.summary };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = caseStudies.items.find((i) => i.slug === slug);
  if (!c) notFound();

  return (
    <ContactProvider>
      <Nav />
      <main>
        <section className="bg-[linear-gradient(180deg,#fcfdfe_0%,#f5f7fd_100%)] pt-28 md:pt-36 pb-12 md:pb-16">
          <div className="mx-auto max-w-luma px-6">
            <Link href="/#cas-clients" className="inline-flex items-center gap-2 text-[14px] font-medium text-muted hover:text-navy transition-colors">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M13 8H3M7.5 3.5L3 8l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {caseStudies.back}
            </Link>
            <div className="mt-8 grid md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-8">
                <Pill>{c.sector}</Pill>
                <h1 className="t-h1 mt-5">{c.client}</h1>
                <p className="t-lead mt-6 max-w-[560px]">{c.summary}</p>
              </div>
              <div className="md:col-span-4 flex md:justify-end gap-8">
                {c.stats.map((st) => (
                  <div key={st.label}>
                    <p className="text-[56px] md:text-[64px] font-bold tracking-[-0.04em] leading-none text-violet whitespace-nowrap">{st.value}</p>
                    <p className="text-[14px] text-body mt-2 max-w-[200px]">{st.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-luma px-6">
            <Reveal>
              <CaseVideo url={c.videoUrl} title={`Cas client ${c.client}`} />
            </Reveal>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-luma px-6 grid md:grid-cols-12 gap-10 md:gap-8">
            <Reveal className="md:col-span-4">
              <p className="t-kicker">Le besoin</p>
              <p className="t-body mt-4 max-w-[380px]">{c.need}</p>
            </Reveal>
            <Reveal className="md:col-span-8" delay={0.08}>
              <p className="t-kicker">Ce qu’on a construit</p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-4">
                {c.built.map((b, i) => (
                  <li key={b.title} className="rounded-2xl bg-card border border-line p-6">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-violet text-white text-[12px] font-bold tabular-nums">{i + 1}</span>
                    <h2 className="t-h3 mt-4">{b.title}</h2>
                    <p className="t-body mt-2 text-[15px]">{b.text}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-card/60">
          <div className="mx-auto max-w-luma px-6">
            <Reveal>
              <p className="t-kicker">Les résultats</p>
              <ul className="mt-6 grid md:grid-cols-3 gap-4">
                {c.outcomes.map((o) => (
                  <li key={o} className="flex gap-3 rounded-2xl bg-white border border-line p-6 text-[16px] font-medium leading-[1.4]">
                    <svg width="18" height="18" viewBox="0 0 12 12" fill="none" aria-hidden className="text-violet shrink-0 mt-0.5">
                      <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {o}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="mx-auto max-w-luma px-6">
            <Reveal>
              <div className="rounded-[22px] bg-violet text-white px-7 py-12 md:px-12 md:py-16 text-center relative overflow-hidden">
                <span aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-2xl" />
                <h2 className="t-h2 relative">{finalCta.title}</h2>
                <p className="relative mt-4 text-[16px] leading-[1.55] text-white/80 max-w-[520px] mx-auto">{finalCta.text}</p>
                <div className="relative mt-8">
                  <OpenContactButton variant="white" />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <ContactPanel />
    </ContactProvider>
  );
}
