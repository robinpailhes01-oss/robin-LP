"use client";

import Image from "next/image";
import { Arrow, Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { useContact } from "@/components/contact/ContactContext";
import { audit } from "@/lib/audit";

/** Accroche du mini-audit : la mascotte invite à lancer l’échange, qui s’ouvre dans le panneau conversationnel. */
export function Audit() {
  const { openContact } = useContact();
  return (
    <section id="mini-audit" className="py-20 md:py-28 scroll-mt-20">
      <div className="mx-auto max-w-luma px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[22px] bg-card border border-line grid lg:grid-cols-12 items-center">
            <span aria-hidden className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-[radial-gradient(circle,rgba(70,54,240,0.16),transparent_65%)]" />
            <div className="relative lg:col-span-7 p-7 md:p-12">
              <Pill>{audit.pill}</Pill>
              <h2 className="t-h2 mt-5 max-w-[560px]">{audit.title}</h2>
              <p className="t-body mt-4 max-w-[520px]">{audit.text}</p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {["2 minutes", "Gratuit", "Sans engagement", "Robin vous rappelle"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5 text-[13px] font-medium text-body">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="text-violet">
                      <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
              <Button onClick={openContact} className="mt-8">
                {audit.start}
                <Arrow />
              </Button>
            </div>
            <div className="relative lg:col-span-5 min-h-[260px] lg:min-h-[380px] flex items-end justify-center overflow-hidden">
              <div className="absolute left-6 right-6 top-8 lg:top-10 rounded-[18px] bg-white border border-line p-3.5 shadow-[0_24px_50px_-30px_rgba(18,16,43,0.45)] flex items-start gap-3" aria-hidden>
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white border border-line overflow-hidden">
                  <Image src="/images/mascotte-avatar.png" alt="" width={64} height={64} className="h-full w-full object-cover" />
                </span>
                <p className="rounded-[14px] rounded-tl-[4px] bg-navy text-white px-3.5 py-2.5 text-[13px] leading-[1.4]">{audit.questions[0].title}</p>
              </div>
              <Image
                src="/images/mascotte.png"
                alt="La mascotte Luma, prête à poser ses questions"
                width={480}
                height={330}
                sizes="(max-width: 1023px) 60vw, 380px"
                className="relative w-[70%] max-w-[380px] h-auto mt-28 lg:mt-32 [mask-image:linear-gradient(180deg,black_70%,transparent_100%)]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
