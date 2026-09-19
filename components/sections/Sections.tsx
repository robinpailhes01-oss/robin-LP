import Image from "next/image";
import { Pill } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { ScaleIn, ScrollLine } from "@/components/ui/ScrollLine";
import { OpenContactButton } from "@/components/contact/OpenContactButton";
import { caseStudies, expertise, faq, finalCta, logos, method, testimonials } from "@/lib/content";

function Wrap({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-20 md:py-28 scroll-mt-20 ${className}`}>
      <div className="mx-auto max-w-luma px-6">{children}</div>
    </section>
  );
}

/* Logos clients : emplacements neutres tant que les vrais logos ne sont pas fournis. */
export function Logos() {
  const items = logos.items.length ? logos.items : Array.from({ length: 6 }, (_, i) => ({ name: `Logo client ${i + 1}`, src: "" }));
  return (
    <section className="py-14 md:py-16">
      <div className="mx-auto max-w-luma px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{logos.kicker}</p>
        <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-8 gap-y-6 items-center">
          {items.map((l) => (
            <li key={l.name} className="flex items-center justify-center h-10">
              {l.src ? (
                <Image src={l.src} alt={l.name} width={120} height={32} className="h-7 w-auto opacity-80 grayscale" />
              ) : (
                <span className="h-7 w-24 rounded-md bg-card border border-dashed border-line" aria-label={l.name} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const icons = {
  bolt: <path d="M11 2L4 12h6l-1 8 7-10h-6l1-8z" fill="currentColor" />,
  users: (
    <>
      <circle cx="8" cy="8" r="3.2" fill="currentColor" />
      <circle cx="15.5" cy="9" r="2.6" fill="currentColor" />
      <path d="M2 19c0-3.3 2.7-6 6-6s6 2.7 6 6H2zM14.5 19c0-1.6-.4-3-1.1-4.2.7-.5 1.5-.8 2.3-.8 2.5 0 4.3 2 4.3 5h-5.5z" fill="currentColor" />
    </>
  ),
  chart: (
    <>
      <rect x="3" y="12" width="4" height="8" rx="1" fill="currentColor" />
      <rect x="10" y="7" width="4" height="13" rx="1" fill="currentColor" />
      <rect x="17" y="3" width="4" height="17" rx="1" fill="currentColor" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export function Expertise() {
  return (
    <Wrap id="expertise">
      <Reveal>
        <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-end">
          <div className="md:col-span-7">
            <Pill>{expertise.pill}</Pill>
            <h2 className="t-h2 mt-5">
              {expertise.titleA} <span className="text-violet">{expertise.titleB}</span>
              <br className="hidden md:block" /> {expertise.titleC}
            </h2>
          </div>
          <p className="t-body md:col-span-5 md:pb-2 max-w-[420px]">{expertise.text}</p>
        </div>
      </Reveal>
      <ul className="mt-10 md:mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {expertise.cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06}>
            <li className="h-full rounded-2xl bg-card border border-line p-6 md:p-7 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-luma)] hover:-translate-y-1 hover:border-violet/25 hover:shadow-[0_24px_40px_-30px_rgba(18,16,43,0.35)]">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white border border-line text-violet shadow-[0_6px_16px_-10px_rgba(70,54,240,0.5)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  {icons[c.icon]}
                </svg>
              </span>
              <h3 className="t-h3 mt-6">{c.title}</h3>
              <p className="t-body mt-2 text-[15px]">{c.text}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </Wrap>
  );
}

export function CaseStudies() {
  return (
    <Wrap id="cas-clients">
      <Reveal>
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <Pill>{caseStudies.pill}</Pill>
            <h2 className="t-h2 mt-5">{caseStudies.title}</h2>
          </div>
          <p className="t-body md:col-span-5 max-w-[420px]">{caseStudies.text}</p>
        </div>
      </Reveal>
      <div className="mt-12 flex flex-col gap-6">
        {caseStudies.items.map((c) => (
          <Reveal key={c.client}>
            <article className="rounded-[22px] bg-card border border-line overflow-hidden grid lg:grid-cols-12">
              <div className="lg:col-span-7 p-7 md:p-10 flex flex-col">
                <p className="t-kicker text-muted">{c.sector}</p>
                <h3 className="mt-3 text-[28px] md:text-[34px] font-bold tracking-[-0.03em] leading-[1.1]">{c.client}</h3>
                <p className="t-body mt-4 max-w-[520px]">{c.summary}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {c.built.map((b) => (
                    <li key={b} className="inline-flex items-center gap-2 rounded-full bg-white border border-line px-3.5 h-9 text-[13px] font-semibold">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="text-violet">
                        <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 md:mt-auto pt-8 border-t border-line flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
                  <p className="text-[52px] md:text-[64px] font-bold tracking-[-0.04em] leading-none text-violet whitespace-nowrap">
                    {c.result.value}
                    <span className="text-[20px] md:text-[24px] font-semibold tracking-[-0.02em] text-navy ml-2">{c.result.unit}</span>
                  </p>
                  <p className="text-[14px] leading-[1.4] text-body pb-1.5 max-w-[220px]">{c.result.label}</p>
                </div>
              </div>
              <div className="lg:col-span-5 bg-[linear-gradient(160deg,#eeebff_0%,#f5f3ff_100%)] p-7 md:p-10 flex items-center">
                <div className="w-full max-w-[380px] mx-auto rounded-[20px] bg-white border border-line p-4 flex flex-col gap-3 shadow-[0_24px_60px_-40px_rgba(70,54,240,0.45)]" aria-label="Exemple d’échange traité par l’agent">
                  <div className="flex items-center gap-2 pb-3 border-b border-line">
                    <span className="size-7 rounded-full bg-violet text-white inline-flex items-center justify-center text-[11px] font-bold" aria-hidden>
                      HY
                    </span>
                    <p className="text-[13px] font-semibold">Agent WhatsApp · {c.client}</p>
                  </div>
                  <p className="self-start max-w-[88%] rounded-[16px] rounded-bl-[6px] bg-card border border-line px-4 py-2.5 text-[14px] leading-[1.4]">{c.demo.client}</p>
                  <p className="self-end max-w-[88%] rounded-[16px] rounded-br-[6px] bg-navy text-white px-4 py-2.5 text-[14px] leading-[1.4]">{c.demo.agent}</p>
                  <p className="flex items-center gap-2 text-[12px] font-medium text-violet pl-1">
                    <span className="size-1.5 rounded-full bg-violet" aria-hidden />
                    {c.demo.status}
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Wrap>
  );
}

/* Témoignages : emplacements tant que de vrais retours clients ne sont pas fournis. */
export function Testimonials() {
  const items = testimonials.items.length
    ? testimonials.items
    : Array.from({ length: 3 }, (_, i) => ({ quote: "", name: `Client ${i + 1}`, role: "" }));
  return (
    <Wrap id="temoignages">
      <Reveal>
        <p className="text-center t-kicker text-muted">{testimonials.kicker}</p>
        <h2 className="t-h2 text-center mt-4">{testimonials.title}</h2>
      </Reveal>
      <ul className="mt-12 grid md:grid-cols-3 gap-4">
        {items.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.06}>
            <li className="h-full rounded-2xl bg-card border border-line p-7 flex flex-col transition-[transform,box-shadow] duration-300 ease-[var(--ease-luma)] hover:-translate-y-1 hover:shadow-[0_24px_40px_-30px_rgba(18,16,43,0.35)]">
              <div className="flex gap-1 text-violet" aria-hidden>
                {Array.from({ length: 5 }).map((_, k) => (
                  <svg key={k} width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6L10 15l-5.4 3 1.2-6L1.3 7.8l6.1-.7L10 1.5z" />
                  </svg>
                ))}
              </div>
              {t.quote ? (
                <p className="mt-5 text-[16px] leading-[1.55] text-navy flex-1">« {t.quote} »</p>
              ) : (
                <div className="mt-5 flex-1 space-y-2.5" aria-label="Témoignage à venir">
                  <span className="block h-3 rounded bg-line w-full" />
                  <span className="block h-3 rounded bg-line w-11/12" />
                  <span className="block h-3 rounded bg-line w-2/3" />
                </div>
              )}
              <div className="mt-6 flex items-center gap-3">
                <span className="size-10 rounded-full bg-violet-tint" aria-hidden />
                <div>
                  <p className="text-[14px] font-semibold">{t.name}</p>
                  <p className="text-[13px] text-muted">{t.role || "Fonction, entreprise"}</p>
                </div>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </Wrap>
  );
}

export function Method() {
  return (
    <Wrap id="methode" className="bg-card/60">
      <Reveal>
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <Pill>{method.pill}</Pill>
            <h2 className="t-h2 mt-5">{method.title}</h2>
          </div>
          <p className="t-body md:col-span-5 max-w-[420px]">{method.text}</p>
        </div>
      </Reveal>
      <ScrollLine>
      <ol className="mt-16 lg:mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {method.steps.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.06}>
            <li className="h-full rounded-2xl bg-white border border-line p-6 md:p-7 transition-[transform,box-shadow] duration-300 ease-[var(--ease-luma)] hover:-translate-y-1 hover:shadow-[0_24px_40px_-30px_rgba(18,16,43,0.35)]">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-violet text-white text-[13px] font-bold tabular-nums">
                {i + 1}
              </span>
              <h3 className="t-h3 mt-5">{s.name}</h3>
              <p className="t-body mt-2 text-[15px]">{s.text}</p>
            </li>
          </Reveal>
        ))}
      </ol>
      </ScrollLine>
    </Wrap>
  );
}

export function Faq() {
  return (
    <Wrap id="faq">
      <div className="grid md:grid-cols-12 gap-10">
        <Reveal className="md:col-span-4">
          <Pill>{faq.kicker}</Pill>
          <h2 className="t-h2 mt-5">{faq.title}</h2>
        </Reveal>
        <div className="md:col-start-6 md:col-span-7 border-t border-line">
          {faq.items.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex items-center justify-between gap-6 py-5 text-[17px] md:text-[18px] font-semibold tracking-[-0.01em]">
                {f.q}
                <span aria-hidden className="faq-icon shrink-0 size-8 inline-flex items-center justify-center rounded-full bg-card text-navy">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="t-body pb-6 max-w-[560px]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

export function FinalCta() {
  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-luma px-6">
        <ScaleIn>
          <div className="rounded-[22px] bg-violet text-white px-7 py-12 md:px-12 md:py-16 text-center relative overflow-hidden">
            <span aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-2xl" />
            <h2 className="t-h2 relative">{finalCta.title}</h2>
            <p className="relative mt-4 text-[16px] leading-[1.55] text-white/80 max-w-[520px] mx-auto">{finalCta.text}</p>
            <div className="relative mt-8">
              <OpenContactButton variant="white" />
            </div>
          </div>
        </ScaleIn>
      </div>
    </section>
  );
}
