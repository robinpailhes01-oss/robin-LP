import Image from "next/image";
import Link from "next/link";
import { OpenContactButton } from "@/components/contact/OpenContactButton";
import { Arrow, ButtonLink, TextLink } from "@/components/ui/Button";
import { CaseCard } from "@/components/cases/CaseCards";
import { ClientMark } from "@/components/ui/ClientMark";
import { HeroFlow, ProblemSchema, SystemSchema } from "@/components/ui/Diagrams";
import { Parallax } from "@/components/ui/Parallax";
import { ScrollWords } from "@/components/ui/ScrollWords";
import { FaqList } from "@/components/ui/FaqList";
import { Kicker } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { about, caseStudies, casesIndex, contact, cta, faq, founder, guarantee, hero, manifesto, method, problem, steps, system, trust, vsl } from "@/lib/content";

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

/** Souligne l’accent s’il figure dans le texte (un seul accent par page). */
function Accented({ text, accent }: { text: string; accent: string }) {
  const at = text.indexOf(accent);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="u-accent">{accent}</span>
      {text.slice(at + accent.length)}
    </>
  );
}

/* 1. Hero : promesse en deux temps, un seul appel à l’action, le parcours d’une demande. */
export function Hero() {
  const avatar = founder.photos.avatar;
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-32 sm:pt-36 md:pb-20 lg:pt-44">
      <Parallax className="hero-grid absolute inset-0" y={[0, 140]} />
      <div className="relative mx-auto max-w-luma px-5 text-center sm:px-6 lg:px-8">
        <Parallax y={[0, -70]} opacity={[1, 0.25]}>
        <div className="hero-in">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white py-1 pl-1 pr-4 text-[13px] font-medium text-ink">
            <Image src={avatar.src} alt="" width={56} height={56} className="size-7 rounded-full object-cover" />
            {hero.badge}
          </p>
          <h1 className="t-h1 mx-auto mt-8 max-w-[18em]">
            <Accented text={hero.title} accent={hero.accent} />
            <br />
            <Accented text={hero.second} accent={hero.accent} />
          </h1>
          <p className="t-lead mx-auto mt-7 max-w-[34rem]">{hero.text}</p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <ButtonLink href="/audit" className="min-h-14 px-7 text-[16px]">
              {cta.primary}
              <Arrow />
            </ButtonLink>
            <p className="text-[14px] text-muted">{hero.reassurance.join(" · ")}</p>
            {vsl.url && <TextLink href="/video">{hero.video}</TextLink>}
          </div>
        </div>
        </Parallax>
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
                <span className="text-left">
                  <span className="block text-[14px] font-semibold leading-tight text-night">{c.client}</span>
                  <span className="block text-[12px] leading-tight text-muted">{c.slug === "harmonie-yacht" ? trust.own : trust.client}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4">
          {trust.stats.map((st) => (
            <li key={st.label} className="flex items-baseline gap-2.5">
              <span className="font-display text-[28px] font-extrabold leading-none tracking-[-0.01em] text-night">{st.value}</span>
              <span className="text-[14px] text-ink">{st.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-mist px-4 py-2 text-[14px] font-semibold text-night">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            Tous nos outils&nbsp;: {guarantee.short.charAt(0).toLowerCase() + guarantee.short.slice(1)}
          </span>
        </p>
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

/* 4 bis. Manifeste : le pivot de la page, révélé mot à mot au défilement. */
export function Manifesto() {
  return (
    <section id="partenaire" className="bg-white">
      <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8">
        <ScrollWords text={manifesto.text} />
      </div>
    </section>
  );
}

/* 5. Parcours : trois étapes, une seule à faire aujourd’hui (la démo gratuite). */
export function Steps() {
  return (
    <Section id="parcours" tone="mist">
      <Heading kicker={steps.kicker} title={steps.title} second={steps.second} />
      <ol className="mt-14 grid gap-5 md:mt-16 lg:grid-cols-3">
        {steps.items.map((st, i) => {
          const dark = i === 0;
          return (
            <li key={st.title}>
              <Reveal delay={i * 0.08} className="h-full">
                <article className={`flex h-full flex-col rounded-[24px] p-7 sm:p-8 ${dark ? "bg-night text-white" : "border border-line bg-white"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={`font-display text-[44px] font-extrabold leading-none tracking-[-0.04em] tabular-nums ${dark ? "text-white/25" : "text-powder"}`} aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${dark ? "bg-white text-night" : "bg-mist text-night"}`}>{st.label}</span>
                  </div>
                  <h3 className={`mt-8 font-display text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] ${dark ? "text-white" : "text-night"}`}>
                    <span className="sr-only">Étape {i + 1} : </span>
                    {st.title}
                  </h3>
                  <p className={`mt-3 text-[16px] leading-[1.5] ${dark ? "text-white/80" : "text-ink"}`}>{st.text}</p>
                  {st.points && (
                    <ul className="mt-6 flex flex-col gap-2.5">
                      {st.points.map((pt) => (
                        <li key={pt} className={`flex gap-2.5 text-[15px] leading-[1.45] ${dark ? "text-white/90" : "text-ink"}`}>
                          <Check className={`mt-[3px] ${dark ? "text-powder" : "text-night"}`} />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                  {st.options && (
                    <ul className="mt-6 flex flex-col gap-3">
                      {st.options.map((op) => (
                        <li key={op.name} className="rounded-2xl bg-paper p-4">
                          <p className="text-[15px] font-semibold text-night">{op.name}</p>
                          <p className="mt-1 text-[14px] leading-[1.45] text-ink">{op.text}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                  {dark && (
                    <div className="mt-8 lg:mt-auto lg:pt-8">
                      <ButtonLink href="/audit" variant="onDark">
                        {cta.primary}
                        <Arrow />
                      </ButtonLink>
                    </div>
                  )}
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>
      <div className="mt-10 flex justify-center">
        <TextLink href="/cas-clients">Voir les réalisations</TextLink>
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

/* 6. Réalisations : uniquement des cas réels, chacun avec le visuel de son outil et sa page. */
export function Cases() {
  return (
    <Section id="realisations" tone="paper">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <Kicker>{caseStudies.kicker}</Kicker>
          <h2 className="t-h2 mt-5 max-w-[16ch]">{caseStudies.title}</h2>
          <p className="t-lead mt-5 max-w-[36rem]">{caseStudies.text}</p>
        </Reveal>
        <TextLink href="/cas-clients">{caseStudies.all}</TextLink>
      </div>
      <ul className="mt-12 grid gap-5 md:mt-14 lg:grid-cols-3">
        {caseStudies.items.map((c, i) => (
          <li key={c.slug}>
            <Reveal delay={i * 0.06} className="h-full">
              <CaseCard c={c} />
            </Reveal>
          </li>
        ))}
      </ul>
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
                <ButtonLink href="/audit">
                  {cta.primary}
                  <Arrow />
                </ButtonLink>
                <OpenContactButton variant="secondary" label={cta.call} />
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
