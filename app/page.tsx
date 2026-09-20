import { Hero } from "@/components/sections/Hero";
import { Partner } from "@/components/sections/Partner";
import {
  Expertise,
  Faq,
  FinalCta,
  Logos,
  Method,
  Testimonials,
} from "@/components/sections/Sections";
export default function Page() {
  return (
    <>
      <Hero />
      <Logos />
      <Expertise />
      <Partner />
      <Testimonials />
      <Method />
      <Faq />
      <FinalCta />
    </>
  );
}
