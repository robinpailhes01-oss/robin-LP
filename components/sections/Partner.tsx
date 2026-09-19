"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Logo";
import { useMedia } from "@/lib/useMedia";
import { cta, partner } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Temps fort de la page : section épinglée sur desktop.
 * Le bandeau se pose, la mascotte entre par la droite, la lueur monte, le texte s’assemble.
 * Sur mobile et en animations réduites : une simple apparition.
 */
export function Partner() {
  const reduced = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)");
  const pinned = desktop && !reduced;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const bandScale = useTransform(scrollYProgress, [0, 0.35], [0.94, 1]);
  const bandRadius = useTransform(scrollYProgress, [0, 0.35], [36, 22]);
  const glow = useTransform(scrollYProgress, [0, 0.5], [0.15, 1]);
  const robotX = useTransform(scrollYProgress, [0.05, 0.5], [160, 0]);
  const robotScale = useTransform(scrollYProgress, [0.05, 0.5], [0.85, 1]);
  const robotOpacity = useTransform(scrollYProgress, [0.05, 0.35], [0, 1]);
  const t1 = useTransform(scrollYProgress, [0.12, 0.32], [28, 0]);
  const o1 = useTransform(scrollYProgress, [0.12, 0.32], [0, 1]);
  const t2 = useTransform(scrollYProgress, [0.2, 0.42], [28, 0]);
  const o2 = useTransform(scrollYProgress, [0.2, 0.42], [0, 1]);
  const t3 = useTransform(scrollYProgress, [0.3, 0.55], [24, 0]);
  const o3 = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);

  const content = (
    <>
      <div className="relative z-10 max-w-[540px]">
        <motion.div style={pinned ? { y: t1, opacity: o1 } : undefined}>
          <Pill dark>{partner.pill}</Pill>
          <h2 className="t-h2 mt-5 text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)]">{partner.title}</h2>
        </motion.div>
        <motion.p style={pinned ? { y: t2, opacity: o2 } : undefined} className="mt-4 text-[15px] md:text-[16px] leading-[1.55] text-white/75 max-w-[460px]">
          {partner.text}
        </motion.p>
        <motion.div style={pinned ? { y: t3, opacity: o3 } : undefined}>
          <ButtonLink href="#methode" variant="white" className="mt-7 h-11 text-[14px]">
            {cta.method}
            <Arrow />
          </ButtonLink>
        </motion.div>
      </div>
      <motion.div
        aria-hidden
        style={pinned ? { opacity: glow } : undefined}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_90%_at_82%_70%,rgba(99,80,255,0.55),transparent_70%)]"
      />
      <motion.div
        style={pinned ? { x: robotX, scale: robotScale, opacity: robotOpacity } : undefined}
        className="absolute right-0 bottom-0 hidden sm:block origin-bottom-right w-[46%] max-w-[470px]"
      >
        <Image
          src="/images/robot-band.png"
          alt=""
          aria-hidden
          width={331}
          height={221}
          sizes="(max-width: 767px) 60vw, 520px"
          className="pointer-events-none select-none w-full h-auto block [mask-image:linear-gradient(90deg,transparent_0%,black_32%),linear-gradient(180deg,transparent_0%,black_28%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
        />
      </motion.div>
    </>
  );

  const bandClass =
    "relative overflow-hidden bg-[linear-gradient(100deg,#13152a_0%,#191736_55%,#1f1a4e_100%)] text-white px-7 py-10 md:px-12 md:py-16 min-h-[280px] md:min-h-[340px] flex items-center";

  if (!pinned) {
    return (
      <section ref={ref} className="py-6 md:py-10">
        <div className="mx-auto max-w-luma px-6">
          <motion.div
            className={`${bandClass} rounded-[22px]`}
            initial={reduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
          >
            {content}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[170vh]">
      <div className="sticky top-0 h-screen flex items-center">
        <div className="mx-auto max-w-luma px-6 w-full">
          <motion.div style={{ scale: bandScale, borderRadius: bandRadius }} className={`${bandClass} origin-center will-change-transform`}>
            {content}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
