import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContactProvider } from "@/components/contact/ContactContext";
import { ContactPanel } from "@/components/contact/ContactPanel";
import { Hero } from "@/components/sections/Hero";
import { Expertise, Faq, FinalCta, Logos, Method, Partner, Testimonials } from "@/components/sections/Sections";

export default function Page() {
  return (
    <ContactProvider>
      <Nav />
      <main>
        <Hero />
        <Logos />
        <Expertise />
        <Partner />
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
