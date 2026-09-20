import type { Metadata } from "next";
import { Faq, FinalCta, Method } from "@/components/sections/Sections";
import { Pill } from "@/components/ui/Logo";
import { methodPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Notre méthode",
  description: methodPage.text,
};

export default function MethodePage() {
  return (
    <>
      <section className="bg-[linear-gradient(180deg,#fcfdfe_0%,#f5f7fd_100%)] pt-28 md:pt-36 pb-6 md:pb-10">
        <div className="mx-auto max-w-luma px-6">
          <Pill>Méthode</Pill>
          <h1 className="t-h1 mt-6">{methodPage.title}</h1>
          <p className="t-lead mt-6 max-w-[560px]">{methodPage.text}</p>
        </div>
      </section>
      <Method />
      <Faq />
      <FinalCta />
    </>
  );
}
