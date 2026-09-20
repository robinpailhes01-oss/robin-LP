import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/PageIntro";
import { FinalCta, Method } from "@/components/sections/Sections";
import { Reveal } from "@/components/ui/Reveal";
export const metadata: Metadata = { title: "À propos de Luma" };
export default function About() {
  return (
    <>
      <PageIntro
        kicker="À propos de Luma"
        title="La technologie doit"
        accent="vous simplifier la vie."
        text="Luma est né d’une conviction simple : votre entreprise peut grandir sans que chaque nouvelle demande devienne une interruption."
      />
      <section className="container about-grid">
        <Reveal>
          <Image
            className="about-image"
            src="/images/hero-luma.png"
            alt="Le fondateur de Luma et la mascotte de l’agence"
            width={516}
            height={424}
          />
        </Reveal>
        <Reveal>
          <p className="t-kicker">Toujours à vos côtés</p>
          <h2 className="t-h2">
            Un partenaire.
            <br />
            Pas un outil de plus.
          </h2>
          <p className="t-body">
            Répondre aux mêmes questions, mettre à jour un fichier, relancer une
            demande… Ces tâches sont utiles. Mais elles ne devraient pas prendre
            toute votre journée.
          </p>
          <p className="t-body">
            Nous créons des agents qui respectent votre façon de travailler, vos
            outils et votre ton. Votre équipe garde la main sur les décisions et
            les échanges qui méritent une attention humaine.
          </p>
        </Reveal>
      </section>
      <section className="container values-grid">
        {[
          [
            "Comprendre d’abord",
            "Nous prenons le temps d’observer votre fonctionnement avant de proposer une solution.",
          ],
          [
            "Construire autour de vous",
            "Chaque agent est pensé pour votre activité, vos règles et les besoins de votre équipe.",
          ],
          [
            "Rester à vos côtés",
            "Le lancement est un début. Nous ajustons le système à mesure que votre entreprise évolue.",
          ],
        ].map(([title, text], i) => (
          <Reveal key={title} delay={i * 0.06}>
            <article>
              <span className="t-kicker">0{i + 1}</span>
              <h3>{title}</h3>
              <p className="t-body">{text}</p>
            </article>
          </Reveal>
        ))}
      </section>
      <Method />
      <FinalCta />
    </>
  );
}
