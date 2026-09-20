import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContactProvider } from "@/components/contact/ContactContext";
import { ContactPanel } from "@/components/contact/ContactPanel";
import { Hero } from "@/components/sections/Hero";
import { Partner } from "@/components/sections/Partner";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Connect } from "@/components/sections/Connect";
import { Audit } from "@/components/sections/Audit";
import { Expertise, Faq, FinalCta, Logos, Method, Testimonials } from "@/components/sections/Sections";

export default function Page() {
  return (
    <ContactProvider>
      <Nav />
      <main>
        <Hero />
        <Logos />
        <Connect />
        <Expertise />
        <Audit />
        <Partner />
        <CaseStudies />
        <Testimonials />
        <Method />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <ContactPanel />
    </ContactProvider>
  );
}
