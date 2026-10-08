import type { Metadata } from "next";
import Image from "next/image";
import { BookingButton } from "@/components/contact/BookingButton";
import { Trust } from "@/components/sections/Home";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { CaseVideo } from "@/components/ui/CaseVideo";
import { Kicker } from "@/components/ui/Logo";
import { founder, vsl } from "@/lib/content";

export const metadata: Metadata = {
  title: vsl.meta.title,
  description: vsl.meta.description,
};

/**
 * Page d’arrivée de « Faire mon audit gratuit » : la VSL, puis deux choix.
 * 1. L’audit en ligne (/audit/en-ligne), action principale. 2. Réserver un appel.
 */
export default function AuditLandingPage() {
  const avatar = founder.photos.avatar;
  return (
    <>
      <section className="bg-white pb-16 pt-28 sm:pt-32 md:pb-20 lg:pt-36">
        <div className="mx-auto max-w-luma px-5 text-center sm:px-6 lg:px-8">
          <Kicker className="justify-center">{vsl.kicker}</Kicker>
          <h1 className="t-h1 mx-auto mt-5 max-w-[16em] text-[clamp(2rem,1.2rem+3vw,3.5rem)]">{vsl.title}</h1>
          <p className="t-lead mx-auto mt-5 max-w-[38rem]">{vsl.text}</p>

          <div className="mx-auto mt-10 max-w-[58rem] md:mt-12">
            {vsl.url ? (
              <CaseVideo url={vsl.url} title={vsl.title} poster={vsl.poster} />
            ) : (
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-[24px] bg-night text-white">
                <span aria-hidden className="absolute -left-24 -top-24 size-96 rounded-full bg-[radial-gradient(circle,rgba(202,223,237,0.28),transparent_65%)]" />
                <span aria-hidden className="absolute -bottom-32 -right-20 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(113,135,154,0.35),transparent_65%)]" />
                <div className="relative flex flex-col items-center gap-4">
                  <span aria-hidden className="inline-flex size-16 items-center justify-center rounded-full bg-white text-night shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] sm:size-20">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                      <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" />
                    </svg>
                  </span>
                  <p className="text-[15px] font-semibold text-white/85">{vsl.soon}</p>
                </div>
                <div className="absolute bottom-6 left-6 hidden items-center gap-2.5 sm:flex">
                  <Image src={avatar.src} alt="" width={56} height={56} className="size-9 rounded-full object-cover ring-2 ring-white/20" />
                  <span className="text-left leading-tight">
                    <span className="block text-[13px] font-semibold">{founder.name}</span>
                    <span className="block text-[12px] text-white/70">{founder.role}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mx-auto mt-10 flex max-w-[40rem] flex-col items-center gap-6 md:mt-12">
            <div className="flex w-full flex-col items-center gap-2.5">
              <ButtonLink href="/audit/en-ligne" className="min-h-14 w-full max-w-[28rem] whitespace-normal! px-6 py-3 text-center text-[15px] leading-snug sm:w-auto sm:max-w-none sm:px-7 sm:text-[16px]">
                {vsl.online}
                <Arrow />
              </ButtonLink>
              <p className="text-[14px] text-muted">{vsl.onlineNote}</p>
            </div>
            <div className="flex items-center gap-3 text-[13px] font-medium text-muted" aria-hidden>
              <span className="h-px w-10 bg-line" />
              ou
              <span className="h-px w-10 bg-line" />
            </div>
            <div className="flex flex-col items-center gap-2.5">
              <BookingButton label={vsl.call} />
              <p className="text-[14px] text-muted">{vsl.callNote}</p>
            </div>
          </div>
        </div>
      </section>
      <Trust />
    </>
  );
}
