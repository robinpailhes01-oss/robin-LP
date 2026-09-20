import { Hero } from "@/components/sections/Hero";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Connect } from "@/components/sections/Connect";
import { Audit } from "@/components/sections/Audit";
import { WhatsAppTeaser } from "@/components/sections/WhatsAppTeaser";
import { Partner } from "@/components/sections/Partner";
import { Expertise, Faq, FinalCta, Logos, Method, Testimonials } from "@/components/sections/Sections";

export default function Page() {
  return (
    <>
      <Hero />
      <Logos />
      <Connect />
      <Expertise />
      <WhatsAppTeaser />
      <Audit />
      <Partner />
      <CaseStudies />
      <Testimonials />
      <Method />
      <Faq />
      <FinalCta />
    </>
  );
}
