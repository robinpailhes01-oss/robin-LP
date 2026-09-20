import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { Faq, FinalCta } from "@/components/sections/Sections";
export const metadata: Metadata = { title: "Questions fréquentes" };
export default function FaqPage() {
  return (
    <>
      <PageIntro
        kicker="Vos questions"
        title="L’essentiel, en clair."
        text="Personnalisation, outils, équipe : voici comment nous travaillons et ce que vous pouvez attendre de votre agent."
      />
      <Faq />
      <FinalCta />
    </>
  );
}
