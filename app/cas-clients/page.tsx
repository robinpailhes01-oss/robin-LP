import type { Metadata } from "next";
import { CaseList, Contact } from "@/components/sections/Home";
import { Kicker } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { casesIndex } from "@/lib/content";

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
          <Reveal className="mt-14 md:mt-16">
            <CaseList />
          </Reveal>
        </div>
      </section>
      <Contact />
    </>
  );
}
