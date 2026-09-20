import Image from "next/image";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
export function Partner() {
  return (
    <section className="section-compact" id="cas-clients">
      <div className="container">
        <Reveal>
          <div className="whatsapp-feature">
            <div className="feature-copy">
              <Pill dark>Votre agent WhatsApp</Pill>
              <h2 className="t-h2">
                Vos clients écrivent.
                <br />
                <span>Luma prend le relais.</span>
              </h2>
              <p>
                Il répond aux questions, qualifie les demandes et transmet les
                informations à votre CRM. Vous reprenez la main quand cela
                compte.
              </p>
              <ButtonLink href="/agent-whatsapp" variant="white">
                Découvrir l’agent WhatsApp
                <Arrow />
              </ButtonLink>
              <div className="feature-benefits">
                <span>Votre ton</span>
                <span>Vos outils</span>
                <span>Votre équipe</span>
              </div>
            </div>
            <div className="feature-visual">
              <Image
                src="/images/luma-whatsapp.webp"
                alt="L’agent Luma avec son téléphone WhatsApp"
                width={1254}
                height={1254}
                sizes="(max-width: 767px) 90vw, 480px"
              />
              <div className="message-note">
                <span className="wa-badge">✓</span>
                <div>
                  <strong>Une nouvelle demande, prise en charge.</strong>
                  <small>
                    Les informations utiles arrivent dans votre CRM.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
