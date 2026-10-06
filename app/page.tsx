import { About, Contact, Faq, Hero, Journey, Manifesto, Offers, Problem, System, Trust } from "@/components/sections/Home";

export default function Home() {
  return (
    <>
      <Hero />
      <Trust />
      <Problem />
      <Manifesto />
      <System />
      <Offers />
      <Journey />
      <About />
      <Faq />
      <Contact />
    </>
  );
}
