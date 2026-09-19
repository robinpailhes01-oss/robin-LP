"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Arrow, Button, ButtonLink, PlayIcon } from "@/components/ui/Button";
import { useContact } from "@/components/contact/ContactContext";
import { cta, hero } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const { openContact } = useContact();
  const item = (i: number) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.1 + i * 0.08, ease },
  });

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fcfdfe_0%,#f6f8fd_100%)]">
      <div className="mx-auto max-w-luma px-6 pt-28 md:pt-40 grid md:grid-cols-12 md:gap-x-8 md:items-end">
        <div className="md:col-span-6 md:row-start-1 relative z-10">
          <motion.p {...item(0)} className="t-kicker mb-6">
            {hero.kicker}
          </motion.p>
          <motion.h1 {...item(1)} className="t-h1">
            {hero.titleA}
            <br />
            {hero.titleB}{" "}
            <span className="relative inline-block text-violet">
              {hero.titleC}
              <svg
                className="absolute left-0 right-0 -bottom-2 md:-bottom-3 w-full h-3 text-violet"
                viewBox="0 0 220 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path d="M3 8.5C50 3 110 2 217 5.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>
          <motion.p {...item(2)} className="t-lead mt-7 max-w-[440px]">
            {hero.text}
          </motion.p>
        </div>

        <motion.div
          className="md:col-start-7 md:col-span-6 md:row-start-1 md:row-span-2 self-end -mx-6 md:mx-0 mt-4 md:mt-0"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
        >
          <Image
            src="/images/hero-luma.png"
            alt="Le fondateur de Luma et l’agent IA Luma, bras croisés, côte à côte"
            width={516}
            height={424}
            priority
            sizes="(max-width: 767px) 100vw, 560px"
            className="w-full max-w-[560px] h-auto ml-auto block [mask-image:linear-gradient(90deg,transparent_0%,black_22%),linear-gradient(180deg,transparent_0%,black_12%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
          />
        </motion.div>

        <div className="md:col-span-6 md:row-start-2 relative z-10 pb-10 md:pb-24 mt-2 md:mt-0">
          <motion.div {...item(3)} className="mt-6 md:mt-9 flex flex-col sm:flex-row gap-3">
            <Button onClick={openContact}>
              {cta.primary}
              <Arrow />
            </Button>
            <ButtonLink href="#methode" variant="light" className="pl-2.5">
              <PlayIcon />
              <span className="flex flex-col items-start leading-none sm:leading-tight">
                <span>{cta.video}</span>
                <span className="text-[11px] font-medium text-muted">{cta.videoDuration}</span>
              </span>
            </ButtonLink>
          </motion.div>

          <motion.ul {...item(4)} className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {hero.trust.map((t) => (
              <li key={t} className="flex items-center gap-1.5 text-[12px] font-medium text-body">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="text-violet">
                  <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
