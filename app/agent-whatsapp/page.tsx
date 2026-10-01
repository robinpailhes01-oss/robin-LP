import type { Metadata } from "next";
import { OpenContactButton } from "@/components/contact/OpenContactButton";
import { Contact, Faq } from "@/components/sections/Home";
import { CaseVideo } from "@/components/ui/CaseVideo";
import { ConversationCard } from "@/components/ui/ConversationCard";
import { ExampleTag, Kicker } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ToolIcon } from "@/components/ui/ToolIcons";
import { whatsapp } from "@/lib/content";

export const metadata: Metadata = {
  title: "Agent WhatsApp",
  description: whatsapp.page.text,
};

export default function AgentWhatsAppPage() {
  const p = whatsapp.page;
  const [first, ...others] = p.examples;
  return (
    <>
      <section className="bg-white pt-28 sm:pt-32 lg:pt-40 pb-16 md:pb-24">
        <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <Kicker>
              <span className="inline-flex items-center gap-2">
                <ToolIcon name="WhatsApp" size={16} />
                {p.kicker}
              </span>
            </Kicker>
            <h1 className="t-h1 mt-6 max-w-[14em]">{p.title}</h1>
            <p className="t-lead mt-6 max-w-[36rem]">{p.text}</p>
            <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-4">
              <OpenContactButton />
              <span className="text-[14px] text-muted">{p.note}</span>
            </div>
          </div>
          {first && (
            <Reveal className="lg:col-span-5" delay={0.08}>
              <div className="rounded-[28px] bg-mist p-4 sm:p-6">
                <ExampleTag />
                <div className="mt-4">
                  <ConversationCard {...first} />
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <Section tone="mist">
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            <div className="lg:col-span-7">
              <Kicker>Usages</Kicker>
              <h2 className="t-h2 mt-5">{p.doTitle}</h2>
            </div>
            <p className="t-body lg:col-span-5 max-w-[30rem]">{p.doText}</p>
          </div>
        </Reveal>
        <ul className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {p.doItems.map((it, i) => (
            <li key={it.title}>
              <Reveal delay={i * 0.04} className="border-t border-night/80 pt-5">
                <h3 className="t-h3">{it.title}</h3>
                <p className="t-body mt-2 text-[15px]">{it.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            <div className="lg:col-span-7">
              <Kicker>{p.examplesKicker}</Kicker>
              <h2 className="t-h2 mt-5">{p.examplesTitle}</h2>
            </div>
            <p className="t-body lg:col-span-5 max-w-[30rem]">{p.examplesText}</p>
          </div>
        </Reveal>
        <ul className="mt-12 grid md:grid-cols-3 gap-4">
          {others.map((ex, i) => (
            <li key={ex.title} className="h-full">
              <Reveal delay={i * 0.05} className="h-full">
                <ConversationCard {...ex} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {p.videoUrl && (
        <Section tone="paper">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <Reveal className="lg:col-span-4">
              <Kicker>{p.videoKicker}</Kicker>
              <h2 className="t-h2 mt-5 text-[clamp(1.6rem,1.2rem+1.6vw,2.25rem)]">{p.videoTitle}</h2>
              <p className="t-body mt-4 max-w-[380px]">{p.videoText}</p>
            </Reveal>
            <Reveal className="lg:col-span-8" delay={0.06}>
              <CaseVideo url={p.videoUrl} title={p.videoTitle} />
            </Reveal>
          </div>
        </Section>
      )}

      <Section tone="mist">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          <Reveal className="lg:col-span-6">
            <Kicker>Mise en place</Kicker>
            <h2 className="t-h2 mt-5">{p.howTitle}</h2>
            <ol className="mt-10 flex flex-col gap-8">
              {p.howSteps.map((st, i) => (
                <li key={st.name} className="flex gap-5">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white border border-powder font-display text-[15px] font-bold text-night tabular-nums">{i + 1}</span>
                  <div className="pt-1.5">
                    <h3 className="t-h3 text-[18px]">{st.name}</h3>
                    <p className="t-body mt-1.5 text-[15px]">{st.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="lg:col-start-8 lg:col-span-5" delay={0.06}>
            <div className="rounded-[24px] bg-white border border-line p-7 md:p-9">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-mist text-night" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2l6 2.5v5c0 4-2.6 6.9-6 8.5-3.4-1.6-6-4.5-6-8.5v-5L10 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h2 className="mt-5 font-display text-[26px] md:text-[30px] font-extrabold tracking-[-0.03em] leading-[1.1] text-night">{p.guaranteeTitle}</h2>
              <p className="mt-3 t-body">{p.guaranteeText}</p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Faq items={p.faq} title={p.faqTitle} />
      <Contact />
    </>
  );
}
