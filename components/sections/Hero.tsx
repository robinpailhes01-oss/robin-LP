"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Arrow, ButtonLink, PlayIcon } from "@/components/ui/Button";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { useContact } from "@/components/contact/ContactContext";
import { cta, hero } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const { openContact } = useContact();
  const ref = useRef<HTMLElement>(null);

  // Parallaxe légère : la photo descend un peu plus lentement que la page quand on quitte le hero.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 70]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.04]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0.35]);

  const item = (i: number) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.15 + i * 0.09, ease },
  });
  const line = (i: number) => ({
    initial: reduced ? false : { y: "110%" },
    animate: { y: 0 },
    transition: { duration: 0.9, delay: 0.25 + i * 0.1, ease },
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[linear-gradient(180deg,#fcfdfe_0%,#f5f7fd_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[640px] rounded-full bg-[radial-gradient(circle,rgba(70,54,240,0.10),transparent_65%)]"
      />
      <div className="mx-auto max-w-luma px-6 pt-28 md:pt-36 grid md:grid-cols-12 md:gap-x-6 md:items-end">
        <motion.div style={{ opacity: textOpacity }} className="md:col-span-6 md:row-start-1 relative z-10">
          <motion.p {...item(0)} className="t-kicker mb-6">
            {hero.kicker}
          </motion.p>
          <h1 className="t-h1" aria-label={hero.lines.map((l) => l.text).join(" ")}>
            {hero.lines.map((l, i) => {
              const [before, after] = l.accent ? l.text.split(l.accent) : [l.text, undefined];
              return (
                <span key={l.text} className={`block overflow-hidden ${i === hero.lines.length - 1 ? "pb-4 -mb-3" : "pb-1"}`}>
                  <motion.span {...line(i)} className="block" aria-hidden>
                    {before}
                    {l.accent && (
                      <span className="relative inline-block text-violet">
                        {l.accent}
                        <svg
                          className="absolute left-0 right-0 -bottom-1.5 md:-bottom-2.5 w-full h-3 text-violet"
                          viewBox="0 0 220 12"
                          fill="none"
                          preserveAspectRatio="none"
                          aria-hidden
                        >
                          <motion.path
                            d="M3 8.5C50 3 110 2 217 5.5"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1.05, ease }}
                          />
                        </svg>
                      </span>
                    )}
                    {after}
                  </motion.span>
                </span>
              );
            })}
          </h1>
          <motion.p {...item(3)} className="t-lead mt-7 max-w-[440px]">
            {hero.text}
          </motion.p>
        </motion.div>

        <motion.div
          className="md:col-start-7 md:col-span-6 md:row-start-1 md:row-span-2 self-end -mx-6 md:mx-0 mt-4 md:mt-0 md:-mt-8 lg:-mt-14"
          initial={reduced ? false : { opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease }}
        >
          <motion.div style={{ y: photoY, scale: photoScale }} className="origin-bottom">
            <Image
              src="/images/hero-luma.png"
              alt="Le fondateur de Luma et l’agent IA Luma, bras croisés, côte à côte"
              width={516}
              height={424}
              priority
              sizes="(max-width: 767px) 100vw, 640px"
              className="w-full max-w-[600px] lg:max-w-[640px] h-auto ml-auto block [mask-image:linear-gradient(90deg,transparent_0%,black_22%,black_97%,transparent_100%),linear-gradient(180deg,transparent_0%,black_12%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
            />
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: textOpacity }} className="md:col-span-6 md:row-start-2 relative z-10 pb-10 md:pb-20 mt-2 md:mt-0">
          <motion.div {...item(4)} className="mt-6 md:mt-9 flex flex-col sm:flex-row gap-3">
            <ShimmerButton onClick={openContact}>
              {cta.primary}
              <Arrow />
            </ShimmerButton>
            <ButtonLink href="#methode" variant="light" className="pl-2.5">
              <PlayIcon />
              <span className="flex flex-col items-start leading-none sm:leading-tight">
                <span>{cta.video}</span>
                <span className="text-[11px] font-medium text-muted">{cta.videoDuration}</span>
              </span>
            </ButtonLink>
          </motion.div>

          <motion.ul {...item(5)} className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {hero.trust.map((t) => (
              <li key={t} className="flex items-center gap-1.5 text-[12px] font-medium text-body">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="text-violet">
                  <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
