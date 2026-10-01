import { About, Cases, Contact, Demo, Faq, Hero, Method, Needs } from "@/components/sections/Home";

export default function Home() {
  return (
    <>
      <Hero />
      <Needs />
      <Demo />
      <About />
      <Method />
      <Cases />
      <Faq />
      <Contact />
    </>
  );
}
