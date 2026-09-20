import Image from "next/image";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { OpenContactButton } from "@/components/contact/OpenContactButton";
import { hero } from "@/lib/content";
export function Hero() {
  return (
    <section className="home-hero">
      <div className="container hero-grid">
        <div className="hero-copy entrance">
          <p className="t-kicker">{hero.kicker}</p>
          <h1 className="t-h1">
            Moins de tâches.
            <br />
            Plus <span className="accent underlined">d’impact.</span>
          </h1>
          <p className="t-lead">{hero.text}</p>
        </div>
        <div className="home-visual entrance">
          <Image
            src="/images/hero-luma.png"
            alt="Le fondateur de Luma et sa mascotte, à vos côtés"
            width={516}
            height={424}
            priority
            sizes="(max-width: 767px) 95vw, 50vw"
          />
        </div>
        <div className="hero-actions entrance">
          <div className="button-row">
            <OpenContactButton />
            <ButtonLink href="/agent-whatsapp" variant="light">
              Découvrir l’agent WhatsApp
              <Arrow />
            </ButtonLink>
          </div>
          <ul className="trust-list">
            {hero.trust.map((t) => (
              <li key={t}>
                <span>✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
