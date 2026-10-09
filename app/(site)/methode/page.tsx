import type { Metadata } from "next";
import { Contact, Faq, Method } from "@/components/sections/Home";
import { Kicker } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { methodPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Méthode",
  description: methodPage.text,
};

export default function MethodePage() {
  return (
    <>
      <section className="bg-white pt-28 sm:pt-32 lg:pt-40 pb-4 md:pb-8">
        <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8">
          <Kicker>Méthode</Kicker>
          <h1 className="t-h1 mt-6">{methodPage.title}</h1>
          <p className="t-lead mt-6 max-w-[38rem]">{methodPage.text}</p>
        </div>
      </section>
      <Method withLink={false} tone="white" />
      <Section tone="mist">
        <Reveal>
          <Kicker>Principes</Kicker>
          <h2 className="t-h2 mt-5">{methodPage.principlesTitle}</h2>
        </Reveal>
        <ul className="mt-12 grid md:grid-cols-3 gap-4">
          {methodPage.principles.map((pr, i) => (
            <li key={pr.title}>
              <Reveal delay={i * 0.05} className="h-full rounded-[20px] bg-white border border-line p-7">
                <h3 className="t-h3">{pr.title}</h3>
                <p className="t-body mt-2.5 text-[15px]">{pr.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>
      <Faq />
      <Contact />
    </>
  );
}
