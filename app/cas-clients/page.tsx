import type { Metadata } from "next";
import { CaseCard } from "@/components/sections/CaseStudies";
import { FinalCta } from "@/components/sections/Sections";
import { Pill } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { caseStudies, casesIndex } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cas clients",
  description: casesIndex.text,
};

export default function CasesPage() {
  return (
    <>
      <section className="bg-[linear-gradient(180deg,#fcfdfe_0%,#f5f7fd_100%)] pt-28 md:pt-36 pb-12 md:pb-16">
        <div className="mx-auto max-w-luma px-6">
          <Pill>{casesIndex.pill}</Pill>
          <h1 className="t-h1 mt-6 max-w-[800px]">{casesIndex.title}</h1>
          <p className="t-lead mt-6 max-w-[560px]">{casesIndex.text}</p>
        </div>
      </section>
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-luma px-6">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {caseStudies.items.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.06}>
                <li className="h-full">
                  <CaseCard c={c} />
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
