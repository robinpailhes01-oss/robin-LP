import Image from "next/image";
import Link from "next/link";
import { OpenContactButton } from "@/components/contact/OpenContactButton";
import { Arrow, TextLink } from "@/components/ui/Button";
import { ClientMark } from "@/components/ui/ClientMark";
import { HeroFlow, OfferPreview, ProblemSchema, SystemSchema } from "@/components/ui/Diagrams";
import { FaqList } from "@/components/ui/FaqList";
import { Kicker } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { JourneySchema } from "@/components/ui/Schema";
import { Section } from "@/components/ui/Section";
import { about, caseStudies, casesIndex, contact, faq, founder, hero, journey, method, offers, problem, system, trust, type CaseStudy } from "@/lib/content";

function Check({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden className={`shrink-0 ${className}`}>
      <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Titre de section centré en deux temps : l’affirmation, puis la suite en bleu ardoise. */
function Heading({ kicker, title, second, text }: { kicker: string; title: string; second: string; text?: string }) {
  return (
    <Reveal className="mx-auto max-w-[58rem] text-center">
      <Kicker className="justify-center">{kicker}</Kicker>
      <h2 className="t-h2 mt-5">
        {title}
        <br />
        <span className="text-slate">{second}</span>
      </h2>
      {text && <p className="t-lead mx-auto mt-5 max-w-[34rem]">{text}</p>}
    </Reveal>
  );
}

/* 1. Hero : promesse en deux temps, un seul appel à l’action, le parcours d’une demande. */
export function Hero() {
  const at = hero.title.indexOf(hero.accent);
  const avatar = founder.photos.avatar;
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-32 sm:pt-36 md:pb-20 lg:pt-44">
      <div aria-hidden className="hero-grid absolute inset-0" />
      <div className="relative mx-auto max-w-luma px-5 text-center sm:px-6 lg:px-8">
        <div className="hero-in">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white py-1 pl-1 pr-4 text-[13px] font-medium text-ink">
            <Image src={avatar.src} alt="" width={56} height={56} className="size-7 rounded-full object-cover" />
            {hero.badge}
          </p>
          <h1 className="t-display mx-auto mt-8 max-w-[14em]">
            {at >= 0 ? (
              <>
                {hero.title.slice(0, at)}
                <span className="u-accent">{hero.accent}</span>
                {hero.title.slice(at + hero.accent.length)}
              </>
            ) : (
              hero.title
            )}
            <br />
            {hero.second}
          </h1>
          <p className="t-lead mx-auto mt-7 max-w-[34rem]">{hero.text}</p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <OpenContactButton className="min-h-14 px-7 text-[16px]" />
            <p className="text-[14px] text-muted">{hero.reassurance.join(" · ")}</p>
          </div>
        </div>
        <HeroFlow />
      </div>
    </section>
  );
}

/* 2. Confiance : les vrais clients, avec leurs logos. */
export function Trust() {
  return (
    <section className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8">
        <p className="t-kicker text-center">{trust.kicker}</p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {caseStudies.items.map((c) => (
            <li key={c.slug}>
              <Link href={`/cas-clients/${c.slug}`} className="group inline-flex items-center gap-3 rounded-2xl py-1 pr-3 hover:bg-paper">
                <ClientMark c={c} size="md" />
                <span className="text-[14px] font-semibold text-night">{c.client}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 3. Constat : les demandes arrivent de partout, tout repose sur le dirigeant. */
export function Problem() {
  return (
    <Section id="probleme" tone="paper">
      <Heading kicker={problem.kicker} title={problem.title} second={problem.second} />
      <ProblemSchema />
    </Section>
  );
}

/* 4. Système : l’outil Luma au centre, relié aux canaux, au contexte et aux outils. */
export function System() {
  return (
    <Section id="systeme">
      <Heading kicker={system.kicker} title={system.title} second={system.second} text={system.text} />
      <SystemSchema />
    </Section>
  );
}

/* 5. Points de départ : trois offres, chacune appuyée sur une réalisation réelle. */
export function Offers() {
  return (
    <Section id="offres" tone="mist">
      <Heading kicker={offers.kicker} title={offers.title} second={offers.second} text={offers.text} />
      <ul className="mt-14 grid gap-5 md:mt-16 lg:grid-cols-3">
        {offers.items.map((o, i) => (
          <li key={o.kind}>
            <Reveal delay={i * 0.06} className="h-full">
              <article className="flex h-full flex-col rounded-[24px] border border-line bg-white p-5 sm:p-6">
                <OfferPreview kind={o.kind} />
                <p className="t-kicker mt-6">{o.label}</p>
                <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-mist px-3 py-1 text-[13px] font-semibold text-night">
                  <span className="size-1.5 rounded-full bg-night" aria-hidden />
                  {o.tag}
                </p>
                <h3 className="t-h3 mt-4 text-[22px]">{o.title}</h3>
                <p className="mt-1.5 text-[15px] font-medium text-night">{o.text}</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {o.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5 text-[15px] leading-[1.45] text-ink">
                      <Check className="mt-[3px] text-night" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-2xl bg-paper p-4 text-[14px] leading-[1.5] text-ink lg:mt-auto">
                  <span className="font-semibold text-night">{offers.ideal}</span> {o.ideal}
                </p>
                <Link href={o.slug ? `/cas-clients/${o.slug}` : "/methode"} className="group mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-night">
                  {o.slug ? `${offers.see} · ${o.client}` : offers.method}
                  <Arrow />
                </Link>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
      <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
        <OpenContactButton />
        <TextLink href="/cas-clients">{offers.all}</TextLink>
      </div>
    </Section>
  );
}

/* 6. Parcours animé : de l’appel sous 24 h à l’outil qui travaille. */
export function Journey() {
  return (
    <Section id="accompagnement">
      <Heading kicker={journey.kicker} title={journey.title} second={journey.second} />
      <JourneySchema />
      <div className="mt-14 flex justify-center">
        <OpenContactButton />
      </div>
    </Section>
  );
}

/* 4. À propos : qui est Robin, son rôle, le lien avec Luma. */
export function About() {
  const photo = founder.photos.buste;
  return (
    <Section id="a-propos">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
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
