import type { Metadata } from "next";
import { OpenContactButton } from "@/components/contact/OpenContactButton";
import { GuaranteeBadge } from "@/components/sections/WhatsAppTeaser";
import { FinalCta } from "@/components/sections/Sections";
import { CaseVideo } from "@/components/ui/CaseVideo";
import { Pill } from "@/components/ui/Logo";
import { PhoneMock } from "@/components/ui/PhoneMock";
import { Reveal } from "@/components/ui/Reveal";
import { ToolIcon } from "@/components/ui/ToolIcons";
import { FaqList } from "@/components/ui/FaqList";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Marquee } from "@/components/ui/Marquee";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { ConversationCard } from "@/components/ui/ConversationCard";
import { whatsapp } from "@/lib/content";

export const metadata: Metadata = {
  title: "Agent WhatsApp",
  description: whatsapp.page.text,
};

export default function AgentWhatsAppPage() {
  const p = whatsapp.page;
  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fcfdfe_0%,#f5f7fd_100%)] pt-28 md:pt-36 pb-14 md:pb-20">
        <div className="mx-auto max-w-luma px-6 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Pill>Agent WhatsApp</Pill>
              <GuaranteeBadge />
            </div>
            <h1 className="t-h1 mt-6 max-w-[720px]">{p.title}</h1>
            <p className="t-lead mt-6 max-w-[600px]">{p.text}</p>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
              <OpenContactButton />
              <span className="flex items-center gap-2 text-[13px] font-medium text-body">
                <ToolIcon name="WhatsApp" size={20} />
                Fonctionne avec votre numéro WhatsApp actuel
              </span>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-5 relative min-h-[460px]">
            <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(100deg,#13152a_0%,#191736_55%,#1f1a4e_100%)] overflow-hidden">
              <span aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_80%_at_80%_60%,rgba(99,80,255,0.35),transparent_70%)]" />
              <PhoneMock initials="L" name="Votre entreprise" greeting="Bonjour ! Je suis l’assistant de votre entreprise. Comment puis-je vous aider ?" chips={["Une question", "Une disponibilité", "Un devis", "Un rendez-vous"]} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 md:py-8 border-y border-line">
        <Marquee duration={36} gapClass="gap-3">
          {["Répond aux questions", "Donne vos disponibilités", "Envoie un tarif", "Prépare le devis", "Prend le rendez-vous", "Relance sans oublier", "Passe la main quand il faut", "Met le CRM à jour"].map((t) => (
            <span key={t} className="inline-flex items-center gap-2 rounded-full bg-card border border-line px-4 h-10 text-[14px] font-medium whitespace-nowrap">
              <ToolIcon name="WhatsApp" size={16} />
              {t}
            </span>
          ))}
        </Marquee>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-luma px-6 grid lg:grid-cols-12 gap-8 items-start">
          <Reveal className="lg:col-span-4">
            <p className="t-kicker">{p.videoKicker}</p>
            <h2 className="t-h2 mt-4 text-[clamp(1.6rem,1.2rem+1.6vw,2.25rem)]">{p.videoTitle}</h2>
            <p className="t-body mt-4 max-w-[380px]">{p.videoText}</p>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.08}>
            <CaseVideo url={p.videoUrl} title={p.videoTitle} pending="La vidéo arrive bientôt." />
          </Reveal>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-luma px-6">
          <Reveal>
            <div className="grid md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-7">
                <Pill>{p.examplesPill}</Pill>
                <h2 className="t-h2 mt-5">{p.examplesTitle}</h2>
              </div>
              <p className="t-body md:col-span-5 max-w-[420px]">{p.examplesText}</p>
            </div>
          </Reveal>
          <ul className="mt-10 grid sm:grid-cols-2 gap-4">
            {p.examples.map((ex, i) => (
              <Reveal key={ex.title} delay={i * 0.06}>
                <li className="h-full">
                  <ConversationCard {...ex} />
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-card/60">
        <div className="mx-auto max-w-luma px-6">
          <Reveal>
            <h2 className="t-h2 max-w-[700px]">{p.doTitle}</h2>
          </Reveal>
          <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {p.doItems.map((it, i) => (
              <Reveal key={it.title} delay={i * 0.05}>
                <SpotlightCard as="li" className="h-full rounded-2xl bg-white border border-line p-6 md:p-7 transition-[transform,box-shadow] duration-300 ease-[var(--ease-luma)] hover:-translate-y-1 hover:shadow-[0_24px_40px_-30px_rgba(18,16,43,0.35)]">
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-violet-tint text-violet text-[13px] font-bold tabular-nums">{i + 1}</span>
                  <h3 className="t-h3 mt-5">{it.title}</h3>
                  <p className="t-body mt-2 text-[15px]">{it.text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-luma px-6 grid lg:grid-cols-12 gap-10">
          <Reveal className="lg:col-span-5">
            <h2 className="t-h2">{p.howTitle}</h2>
            <ol className="mt-8 flex flex-col gap-6">
              {p.howSteps.map((st, i) => (
                <li key={st.name} className="flex gap-4">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-violet text-white text-[13px] font-bold tabular-nums">{i + 1}</span>
                  <div>
                    <h3 className="t-h3">{st.name}</h3>
                    <p className="t-body mt-1 text-[15px]">{st.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="lg:col-start-7 lg:col-span-6" delay={0.08}>
            <div className="rounded-[22px] bg-navy text-white p-8 md:p-10 relative overflow-hidden">
              <span aria-hidden className="absolute -top-20 -right-20 size-64 rounded-full bg-violet/40 blur-3xl" />
              <BorderBeam duration={10} />
              <GuaranteeBadge dark />
              <h2 className="mt-5 text-[28px] md:text-[34px] font-bold tracking-[-0.03em] leading-[1.1]">{p.guaranteeTitle}</h2>
              <p className="mt-4 text-[15px] md:text-[16px] leading-[1.55] text-white/75 max-w-[460px]">{p.guaranteeText}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-card/60">
        <div className="mx-auto max-w-luma px-6 grid md:grid-cols-12 gap-10">
          <Reveal className="md:col-span-4">
            <Pill>FAQ</Pill>
            <h2 className="t-h2 mt-5">Vos questions sur l’agent</h2>
          </Reveal>
          <div className="md:col-start-6 md:col-span-7">
            <FaqList items={p.faq} iconBg="bg-white" />
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
