import Image from "next/image";
import Link from "next/link";
import { OpenContactButton } from "@/components/contact/OpenContactButton";
import { Arrow, ArrowDown, TextLink } from "@/components/ui/Button";
import { ClientMark } from "@/components/ui/ClientMark";
import { ConversationCard } from "@/components/ui/ConversationCard";
import { FaqList } from "@/components/ui/FaqList";
import { ExampleTag, Kicker } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { JourneySchema, OfferSchema } from "@/components/ui/Schema";
import { Section } from "@/components/ui/Section";
import { about, caseStudies, casesIndex, contact, cta, demo, faq, founder, hero, journey, method, offer, type CaseStudy } from "@/lib/content";

function Check({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden className={`shrink-0 ${className}`}>
      <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* 1. Hero : signature, promesse, photo réelle. */
export function Hero() {
  const photo = founder.photos.portrait;
  const at = hero.title.indexOf(hero.accent);
  return (
    <section className="bg-white pt-28 sm:pt-32 lg:pt-40 pb-4 md:pb-8">
      <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-14 lg:gap-10 items-center">
        <div className="lg:col-span-7 hero-in">
          <div>
            <p className="text-[14px] font-medium text-ink flex items-center gap-3">
              <span className="h-px w-8 bg-slate" aria-hidden />
              {founder.signature}
            </p>
            <h1 className="t-display mt-7 max-w-[13em]">
              {at >= 0 ? (
                <>
                  {hero.title.slice(0, at)}
                  <span className="u-accent">{hero.accent}</span>
                  {hero.title.slice(at + hero.accent.length)}
                </>
              ) : (
                hero.title
              )}
            </h1>
            <p className="t-lead mt-7 max-w-[30rem]">{hero.text}</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <OpenContactButton />
              <a
                href="#exemple"
                className="group inline-flex items-center justify-center gap-2 rounded-full px-6 min-h-12 text-[15px] font-semibold bg-white text-night border border-powder hover:border-night/40 hover:bg-paper transition-[background-color,border-color] duration-200 whitespace-nowrap"
              >
                {cta.example}
                <ArrowDown />
              </a>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 hero-in [animation-delay:80ms]">
          <figure className="mx-auto w-full max-w-[420px] lg:max-w-none">
            <div className="relative">
            <span aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-5 sm:translate-y-5 rounded-[28px] bg-mist" />
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              priority
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 420px, 90vw"
              className="relative w-full h-auto aspect-[4/5] object-cover rounded-[28px]"
            />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* 2. Offre : un schéma animé qui montre l’outil construit, relié aux outils du client. */
export function Offer() {
  return (
    <Section id="besoins">
      <Reveal>
        <Kicker>{offer.kicker}</Kicker>
        <h2 className="t-h2 mt-5 max-w-[18ch]">{offer.title}</h2>
      </Reveal>
      <OfferSchema />
    </Section>
  );
}

/* 3. Démonstration : le parcours d’une demande, clairement présenté comme un exemple. */
export function Demo() {
  return (
    <Section id="exemple" tone="mist">
      <Reveal>
        <div className="max-w-[44rem]">
          <Kicker>{demo.kicker}</Kicker>
          <h2 className="t-h2 mt-5">{demo.title}</h2>
          {demo.text && <p className="t-body mt-5 max-w-[36rem]">{demo.text}</p>}
        </div>
      </Reveal>
      <div className="mt-14 md:mt-16 grid lg:grid-cols-12 gap-12 lg:gap-10 items-start">
        <ol className="lg:col-span-5 relative flex flex-col gap-7">
          <span aria-hidden className="absolute left-[19px] top-6 bottom-6 w-px bg-powder" />
          {demo.steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.05} className="relative flex items-center gap-5">
                <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white border border-powder font-display text-[15px] font-bold text-night tabular-nums">
                  {i + 1}
                </span>
                <h3 className="t-h3 text-[18px]">{s.title}</h3>
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal className="lg:col-span-7" delay={0.08}>
          <div className="flex items-center justify-between gap-4">
            <ExampleTag>{demo.label}</ExampleTag>
          </div>
          <div className="mt-4 grid md:grid-cols-[1.2fr_1fr] gap-4 items-end">
            <ConversationCard {...demo.conversation} />
            <RecordCard />
          </div>
          <div className="mt-8">
            <TextLink href="/agent-whatsapp" className="whitespace-nowrap">{demo.link}</TextLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function RecordCard() {
  const r = demo.record;
  return (
    <article className="rounded-[20px] bg-white border border-line overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-line">
        <p className="text-[14px] font-semibold text-night">{r.title}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 h-6 text-[12px] font-semibold text-night">
          <span className="size-1.5 rounded-full bg-slate" aria-hidden />
          {r.status}
        </span>
      </header>
      <dl className="px-5 py-4 flex flex-col gap-3">
        {r.fields.map((f) => (
          <div key={f.label} className="flex items-baseline justify-between gap-4 text-[14px]">
            <dt className="text-muted">{f.label}</dt>
            <dd className="font-medium text-night text-right">{f.value}</dd>
          </div>
        ))}
      </dl>
      <footer className="px-5 py-3.5 border-t border-line flex items-center gap-2 text-[13px] text-ink">
        <Check className="text-night" />
        {r.note}
      </footer>
    </article>
  );
}

/* 4. À propos : qui est Robin, son rôle, le lien avec Luma. */
export function About() {
  const photo = founder.photos.buste;
  return (
    <Section id="a-propos">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <Reveal className="order-2 lg:order-1 lg:col-span-5">
          <figure className="mx-auto max-w-[400px] lg:max-w-none">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1024px) 440px, 90vw"
              className="w-full h-auto aspect-[4/5] object-cover rounded-[28px]"
            />
          </figure>
        </Reveal>
        <div className="order-1 lg:order-2 lg:col-span-7">
          <Reveal>
            <Kicker>{about.kicker}</Kicker>
            <h2 className="t-h2 mt-5 max-w-[16ch]">{about.title}</h2>
            <div className="mt-7 flex flex-col gap-5 max-w-[38rem]">
              {about.paragraphs.map((p) => (
                <p key={p} className="t-body text-[17px]">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <ul className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
              {about.points.map((pt) => (
                <li key={pt.title} className="border-t-2 border-night pt-4">
                  <p className="font-display text-[17px] font-bold text-night">{pt.title}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* 5. Accompagnement en quatre étapes. */
export function Method({ withLink = true, tone = "mist" as "mist" | "white" }: { withLink?: boolean; tone?: "mist" | "white" }) {
  return (
    <Section id="accompagnement" tone={tone}>
      <Reveal>
        <Kicker>{method.kicker}</Kicker>
        <h2 className="t-h2 mt-5">{method.title}</h2>
      </Reveal>
      <ol className="mt-14 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
        {method.steps.map((s, i) => (
          <li key={s.name}>
            <Reveal delay={i * 0.05} className="h-full border-t border-night/80 pt-6">
              <p className="font-display text-[44px] md:text-[52px] font-extrabold leading-none tracking-[-0.04em] text-powder tabular-nums" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="t-h3 mt-5">
                <span className="sr-only">Étape {i + 1} : </span>
                {s.name}
              </h3>
              <p className="t-body mt-2.5 text-[15px]">{s.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      {withLink && (
        <div className="mt-12">
          <TextLink href="/methode">Voir la méthode en détail</TextLink>
        </div>
      )}
    </Section>
  );
}

/* 5 bis. Parcours animé : de l’appel sous 24 h à l’outil qui travaille. */
export function Journey() {
  return (
    <Section id="accompagnement" tone="mist">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Reveal>
          <Kicker>{journey.kicker}</Kicker>
          <h2 className="t-h2 mt-5">{journey.title}</h2>
        </Reveal>
        <Reveal>
          <OpenContactButton />
        </Reveal>
      </div>
      <JourneySchema />
    </Section>
  );
}

/* 6. Réalisations : uniquement des cas réels, avec leurs vrais logos. */
export function CaseList({ items = caseStudies.items, compact = false }: { items?: CaseStudy[]; compact?: boolean }) {
  return (
    <ul className="border-t border-line">
      {items.map((c) => (
        <li key={c.slug} className="border-b border-line">
          <Link
            href={`/cas-clients/${c.slug}`}
            className="group grid md:grid-cols-12 gap-5 md:gap-8 items-center py-8 md:py-10 -mx-3 px-3 md:-mx-5 md:px-5 rounded-2xl hover:bg-paper transition-colors duration-200"
          >
            <div className="md:col-span-4 flex items-center gap-4">
              <ClientMark c={c} size="md" />
              <div>
                <p className="font-display text-[19px] font-bold tracking-[-0.015em] text-night">{c.client}</p>
                <p className="text-[14px] text-muted">{c.sector}</p>
              </div>
            </div>
            {!compact && <p className="md:col-span-5 text-[17px] leading-[1.5] text-ink">{c.summary}</p>}
            <div className={`${compact ? "md:col-start-9 md:col-span-4" : "md:col-span-3"} flex items-end justify-between gap-4`}>
              {c.stats[0] && (
                <p>
                  <span className="block font-display text-[30px] font-extrabold tracking-[-0.02em] leading-none text-night whitespace-nowrap">{c.stats[0].value}</span>
                  <span className="block mt-1.5 text-[13px] leading-[1.4] text-muted max-w-[200px]">{c.stats[0].label}</span>
                </p>
              )}
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-powder text-night group-hover:bg-night group-hover:text-white group-hover:border-night transition-colors duration-200">
                <Arrow />
                <span className="sr-only">{casesIndex.read} {c.client}</span>
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Cases() {
  return (
    <Section id="realisations">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Kicker>{caseStudies.kicker}</Kicker>
            <h2 className="t-h2 mt-5 max-w-[18ch]">{caseStudies.title}</h2>
          </div>
          <TextLink href="/cas-clients" className="shrink-0">
            {caseStudies.all}
          </TextLink>
        </div>
      </Reveal>
      <Reveal className="mt-12 md:mt-14">
        <CaseList compact />
      </Reveal>
    </Section>
  );
}

/* 7. FAQ */
export function Faq({ items = faq.items, title = faq.title }: { items?: { q: string; a: string }[]; title?: string }) {
  return (
    <Section id="faq" tone="paper">
      <div className="grid lg:grid-cols-12 gap-10">
        <Reveal className="lg:col-span-4">
          <Kicker>{faq.kicker}</Kicker>
          <h2 className="t-h2 mt-5">{title}</h2>
        </Reveal>
        <div className="lg:col-start-6 lg:col-span-7">
          <FaqList items={items} />
        </div>
      </div>
    </Section>
  );
}

/* 8. Contact : ouvre le panneau existant (questions puis email ou téléphone). */
export function Contact() {
  const photo = founder.photos.avatar;
  return (
    <section id="contact" className="bg-white py-20 md:py-28 scroll-mt-20">
      <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8">
        <Reveal>
          <div className="rounded-[28px] bg-mist px-6 py-12 sm:px-10 md:px-14 md:py-16 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <Kicker>{contact.kicker}</Kicker>
              <h2 className="t-h2 mt-5">{contact.title}</h2>
              <p className="t-lead mt-5 max-w-[36rem]">{contact.text}</p>
              <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-4">
                <OpenContactButton />
                <span className="text-[14px] text-muted">{contact.note}</span>
              </div>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end flex items-center gap-4">
              <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} className="size-20 rounded-full object-cover" />
              <div>
                <p className="font-display text-[18px] font-bold text-night">{founder.name}</p>
                <p className="text-[14px] text-ink">{founder.role}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
