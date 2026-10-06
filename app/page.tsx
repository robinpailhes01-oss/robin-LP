import { About, Contact, Faq, Hero, Journey, Offers, Problem, System, Trust } from "@/components/sections/Home";

export default function Home() {
  return (
    <>
      <Hero />
      <Trust />
      <Problem />
      <System />
      <Offers />
      <Journey />
      <About />
      <Faq />
      <Contact />
    </>
  );
}
