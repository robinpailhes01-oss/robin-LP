import type { Metadata } from "next";
import { CaseBand, CaseCard } from "@/components/sections/CaseStudies";
import { FinalCta } from "@/components/sections/Sections";
import { Pill } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { caseStudies, casesIndex } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cas clients",
  description: casesIndex.text,
};

export default function CasesPage() {
  const [featured, ...rest] = caseStudies.items;
  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fcfdfe_0%,#f5f7fd_100%)] pt-28 md:pt-36 pb-12 md:pb-16">
        <span aria-hidden className="pointer-events-none absolute -top-40 right-[-8%] size-[560px] rounded-full bg-[radial-gradient(circle,rgba(70,54,240,0.12),transparent_65%)]" />
        <div className="relative mx-auto max-w-luma px-6 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <Pill>{casesIndex.pill}</Pill>
            <h1 className="t-h1 mt-6 max-w-[800px]">{casesIndex.title}</h1>
            <p className="t-lead mt-6 max-w-[560px]">{casesIndex.text}</p>
          </div>
          <ul className="md:col-span-4 flex md:flex-col gap-3 md:items-end text-[13px] font-medium text-body">
            {casesIndex.pillars.map((pl, i) => (
              <li key={pl.title} className="flex items-center gap-2">
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-violet-tint text-violet text-[11px] font-bold tabular-nums">{i + 1}</span>
                {pl.title}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {featured && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-luma px-6">
            <Reveal>
              <p className="t-kicker mb-5">{casesIndex.featured}</p>
              <CaseBand c={featured} />
            </Reveal>
          </div>
        </section>
      )}

      <section className="pb-14 md:pb-20">
        <div className="mx-auto max-w-luma px-6">
          <Reveal>
            <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
              <h2 className="t-h2 text-[clamp(1.5rem,1.2rem+1.2vw,2rem)]">{casesIndex.all}</h2>
              <p className="text-[13px] text-muted whitespace-nowrap">
                {caseStudies.items.length} cas {caseStudies.items.length > 1 ? "publiés" : "publié"}
              </p>
            </div>
          </Reveal>
          <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {caseStudies.items.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.06}>
                <li className="h-full">
                  <CaseCard c={c} />
                </li>
              </Reveal>
            ))}
            {rest.length === 0 && (
              <li className="hidden sm:flex h-full min-h-[380px] rounded-[22px] border border-dashed border-line items-center justify-center p-8 text-center text-[14px] text-muted" aria-hidden>
                Prochain cas client en préparation
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-card/60">
        <div className="mx-auto max-w-luma px-6 grid md:grid-cols-3 gap-4">
          {casesIndex.pillars.map((pl, i) => (
            <Reveal key={pl.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl bg-white border border-line p-7">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-violet text-white text-[13px] font-bold tabular-nums">{i + 1}</span>
                <h3 className="t-h3 mt-5">{pl.title}</h3>
                <p className="t-body mt-2 text-[15px]">{pl.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
