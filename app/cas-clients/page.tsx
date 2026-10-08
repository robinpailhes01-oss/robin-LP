import type { Metadata } from "next";
import { CaseFeature } from "@/components/cases/CaseCards";
import { Contact } from "@/components/sections/Home";
import { Kicker } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { caseStudies, casesIndex } from "@/lib/content";

export const metadata: Metadata = {
  title: "Réalisations",
  description: casesIndex.text,
};

export default function CasesPage() {
  return (
    <>
      <section className="bg-white pt-28 sm:pt-32 lg:pt-40 pb-20 md:pb-28">
        <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8">
          <Kicker>{casesIndex.kicker}</Kicker>
          <h1 className="t-h1 mt-6 max-w-[14em]">{casesIndex.title}</h1>
          <p className="t-lead mt-6 max-w-[36rem]">{casesIndex.text}</p>
          <ul className="mt-16 flex flex-col gap-20 md:mt-20 md:gap-28">
            {caseStudies.items.map((c, i) => (
              <li key={c.slug}>
                <Reveal>
                  <CaseFeature c={c} flip={i % 2 === 1} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Contact />
    </>
  );
}
