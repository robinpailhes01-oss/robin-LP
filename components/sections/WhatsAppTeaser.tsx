import Link from "next/link";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Logo";
import { PhoneMock } from "@/components/ui/PhoneMock";
import { Reveal } from "@/components/ui/Reveal";
import { ToolIcon } from "@/components/ui/ToolIcons";
import { whatsapp } from "@/lib/content";

/** Aperçu de l’agent WhatsApp sur l’accueil, avec renvoi vers la page dédiée. */
export function WhatsAppTeaser() {
  return (
    <section id="agent-whatsapp" className="py-10 md:py-14 scroll-mt-20">
      <div className="mx-auto max-w-luma px-6">
        <Reveal>
          <article className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(160deg,#eeebff_0%,#f6f5ff_60%,#ffffff_100%)] border border-line grid lg:grid-cols-12">
            <div className="lg:col-span-7 px-7 py-9 md:px-12 md:py-12">
              <div className="flex flex-wrap items-center gap-2">
                <Pill>{whatsapp.pill}</Pill>
                <GuaranteeBadge />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <ToolIcon name="WhatsApp" size={34} />
                <p className="t-kicker">Agent WhatsApp</p>
              </div>
              <h2 className="t-h2 mt-3 max-w-[560px]">{whatsapp.teaser.title}</h2>
              <p className="t-body mt-4 max-w-[500px]">{whatsapp.teaser.text}</p>
              <ul className="mt-6 flex flex-col gap-2">
                {whatsapp.teaser.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-[15px] font-medium">
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden className="text-violet">
                      <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {pt}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/agent-whatsapp" className="mt-8">
                {whatsapp.teaser.cta}
                <Arrow />
              </ButtonLink>
            </div>
            <div className="hidden lg:block lg:col-span-5 relative min-h-[420px]">
              <PhoneMock initials="L" name="Votre entreprise" greeting="Bonjour ! Je suis l’assistant de votre entreprise. Comment puis-je vous aider ?" chips={["Une question", "Une disponibilité", "Un devis", "Un rendez-vous"]} />
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

export function GuaranteeBadge({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 h-7 text-[11px] font-semibold uppercase tracking-[0.12em] ${
        dark ? "bg-white text-navy" : "bg-navy text-white"
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 1.5l5 2v4c0 3.2-2.1 5.6-5 7-2.9-1.4-5-3.8-5-7v-4l5-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M5.5 8l1.8 1.8L10.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {whatsapp.guarantee}
    </span>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-[14px] font-medium text-muted hover:text-navy transition-colors">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M13 8H3M7.5 3.5L3 8l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </Link>
  );
}
