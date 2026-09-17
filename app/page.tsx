import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContactProvider } from "@/components/contact/ContactContext";
import { ContactPanel } from "@/components/contact/ContactPanel";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Faq, FinalCta, Flow, ForWho, Infrastructure, Method, PromiseSection, Proof, UseCases } from "@/components/sections/Skeleton";

export default function Page() {
  return (
    <ContactProvider>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <PromiseSection />
        <Flow />
        <Infrastructure />
        <UseCases />
        <Proof />
        <Method />
        <ForWho />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <ContactPanel />
    </ContactProvider>
  );
}
