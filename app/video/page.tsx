import type { Metadata } from "next";
import { OpenContactButton } from "@/components/contact/OpenContactButton";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { CaseVideo } from "@/components/ui/CaseVideo";
import { Kicker } from "@/components/ui/Logo";
import { cta, vsl } from "@/lib/content";

export const metadata: Metadata = {
  title: vsl.title,
  description: vsl.text,
};

/** Page de la VSL : la vidéo, puis une seule action (le mini-audit), et l’appel en second choix. */
export default function VideoPage() {
  return (
    <section className="bg-white pb-24 pt-28 sm:pt-32 lg:pt-36">
      <div className="mx-auto max-w-luma px-5 text-center sm:px-6 lg:px-8">
        <Kicker className="justify-center">{vsl.kicker}</Kicker>
        <h1 className="t-h1 mx-auto mt-5 max-w-[18em] text-[clamp(2rem,1.2rem+3vw,3.5rem)]">{vsl.title}</h1>
        <p className="t-lead mx-auto mt-4 max-w-[36rem]">{vsl.text}</p>
        <div className="mx-auto mt-10 max-w-[56rem]">
          {vsl.url ? (
            <CaseVideo url={vsl.url} title={vsl.title} />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-[20px] border border-line bg-mist text-[15px] font-semibold text-ink">{vsl.soon}</div>
          )}
        </div>
        <div className="mt-10 flex flex-col items-center gap-4">
          <ButtonLink href="/audit" className="min-h-14 px-7 text-[16px]">
            {cta.primary}
            <Arrow />
          </ButtonLink>
          <p className="text-[14px] text-muted">{cta.reassurance}</p>
          <OpenContactButton variant="secondary" label={cta.call} />
        </div>
      </div>
    </section>
  );
}
