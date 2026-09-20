import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { FinalCta } from "@/components/sections/Sections";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Dashboard } from "@/components/whatsapp/WhatsAppExperience";
export const metadata: Metadata = {
  title: "Cas clients et applications concrètes",
};
export default function Cases() {
  return (
    <>
      <PageIntro
        kicker="Applications concrètes"
        title="De la demande client"
        accent="à la prochaine étape."
        text="Découvrez comment les conversations, la qualification et le suivi peuvent fonctionner ensemble dans une activité de réservation."
      />
      <section className="container case-story">
        <span className="t-kicker">
          Parcours illustratif · Réservation d’une expérience
        </span>
        <h2 className="t-h2">
          Quand les messages arrivent,
          <br />
          tout ne repose plus sur vous.
        </h2>
        <div className="before-after">
          <article>
            <span>Avant</span>
            <h3>Des échanges dispersés.</h3>
            <p>
              Les questions se répètent, les informations restent dans les
              conversations et chaque relance demande une action manuelle.
            </p>
          </article>
          <article>
            <span>Avec un agent Luma</span>
            <h3>Un suivi dans la continuité.</h3>
            <p>
              L’agent recueille la date, le nombre de personnes et le besoin,
              puis transmet un dossier clair à votre équipe.
            </p>
          </article>
        </div>
        <ButtonLink href="/agent-whatsapp#conversations">
          Voir le parcours en conversation
          <Arrow />
        </ButtonLink>
        <p className="demo-disclaimer">
          Ce parcours est une démonstration, pas une étude de résultats client.
          Les références et témoignages seront publiés après validation.
        </p>
      </section>
      <Dashboard />
      <FinalCta />
    </>
  );
}
