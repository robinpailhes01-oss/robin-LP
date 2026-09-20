import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { FinalCta } from "@/components/sections/Sections";
import { articles } from "@/lib/resources";
import { Arrow } from "@/components/ui/Button";
export const metadata: Metadata = { title: "Ressources et guides" };
export default function Resources() {
  return (
    <>
      <PageIntro
        kicker="Les ressources Luma"
        title="Comprendre simplement."
        accent="Avancer concrètement."
        text="Des repères utiles pour réfléchir à l’automatisation de votre entreprise, à votre rythme."
      />
      <section className="container resource-grid">
        {articles.map((a, i) => (
          <Link
            href={`/ressources/${a.slug}`}
            className="resource-card"
            key={a.slug}
          >
            <div className="resource-art">
              <span>0{i + 1}</span>
              <span className="resource-spark">✦</span>
            </div>
            <p className="t-kicker">{a.category}</p>
            <h2>{a.title}</h2>
            <p className="t-body">{a.intro}</p>
            <span className="read-link">
              Lire le guide
              <Arrow />
            </span>
          </Link>
        ))}
      </section>
      <FinalCta />
    </>
  );
}
