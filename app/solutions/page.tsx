import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { Expertise, Method, FinalCta } from "@/components/sections/Sections";
import { Partner } from "@/components/sections/Partner";
export const metadata: Metadata = { title: "Solutions IA sur mesure" };
export default function Solutions() {
  return (
    <>
      <PageIntro
        kicker="Nos solutions"
        title="Moins de tâches à gérer."
        accent="Plus de place pour avancer."
        text="Nous partons de votre quotidien pour construire les agents dont votre entreprise a vraiment besoin."
      />
      <Partner />
      <Expertise />
      <Method />
      <FinalCta />
    </>
  );
}
