import { About, Contact, Faq, Hero, Manifesto, Problem, Steps, System, Trust } from "@/components/sections/Home";

export default function Home() {
  return (
    <>
      <Hero />
      <Trust />
      <Problem />
      <Manifesto />
      <System />
      <Steps />
      <About />
      <Faq />
      <Contact />
    </>
  );
}
