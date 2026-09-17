"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Action, Card, ClientBubble, LumaBubble, Tag, Timestamp, Treated, Typing } from "@/components/ui/Conversation";
import { cta, hero, heroConversation as c } from "@/lib/content";
import { useMounted } from "@/lib/useMounted";

/**
 * Étapes de la séquence (BRIEF.md, section 01) :
 * 1 client · 2 Luma écrit · 3 Luma répond · 4 seconde demande · 5 Qualifié
 * 6 rendez-vous créé · 7 Traité par Luma · 8 la carte s’efface · 9 le titre se pose
 */
const TIMELINE_MS = [400, 1300, 1900, 3000, 3700, 4300, 5000, 6300, 6900];
const FINAL = TIMELINE_MS.length;
const MOBILE_FACTOR = 0.72;

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const mounted = useMounted();
  const reduced = useReducedMotion() === true && mounted;
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!mounted) return;
    if (reduced) {
      setStep(FINAL);
      return;
    }
    setStep(0);
    const factor = window.matchMedia("(max-width: 767px)").matches ? MOBILE_FACTOR : 1;
    const ids = TIMELINE_MS.map((ms, i) => setTimeout(() => setStep(i + 1), ms * factor));
    return () => ids.forEach(clearTimeout);
  }, [run, reduced, mounted]);

  const showCard = reduced || step < 8;
  const showTitle = reduced || step >= FINAL;
  const replay = () => setRun((r) => r + 1);

  return (
    <section className="relative min-h-svh flex flex-col items-center justify-center px-6 pt-24 pb-16 md:pt-28">
      <p className="sr-only">
        Un client écrit à {c.time} : {c.client1} Luma répond : {c.luma1} Le client précise : {c.client2} La demande est
        qualifiée, un rendez-vous est créé, {c.action}. {c.treated}.
      </p>

      <div className="w-full flex flex-col items-center justify-center min-h-[440px] md:min-h-[520px]">
        <AnimatePresence mode="wait" initial={false}>
          {showTitle && (
            <motion.div
              key="title"
              className="flex flex-col items-center text-center max-w-[880px]"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              <h1 className="t-hero">{hero.title}</h1>
              <motion.p
                className="t-sub mt-6 max-w-[640px]"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease }}
              >
                {hero.subtitle}
              </motion.p>
              <motion.div
                className="hidden md:flex flex-wrap justify-center gap-3 mt-10"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45, ease }}
              >
                <ButtonLink href="#cas-usage">{cta.discover}</ButtonLink>
                <Button variant="ghost" onClick={replay}>
                  {cta.demo}
                </Button>
              </motion.div>
            </motion.div>
          )}

          {showCard && !showTitle && (
            <motion.div
              key={`conv-${run}`}
              className="w-full flex justify-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.6, ease } }}
              transition={{ duration: 0.6, ease }}
              aria-hidden
            >
              <Conversation step={step} />
            </motion.div>
          )}
        </AnimatePresence>

        {reduced && (
          <div className="mt-12 w-full flex justify-center" aria-hidden>
            <Conversation step={FINAL} />
          </div>
        )}
      </div>

      {/* Mobile : les CTA sont visibles dès le départ, sous la scène. */}
      <div className="md:hidden flex flex-col items-stretch gap-3 mt-6 w-full max-w-[420px]">
        <ButtonLink href="#cas-usage">{cta.discover}</ButtonLink>
        <Button variant="ghost" onClick={replay}>
          {cta.demo}
        </Button>
      </div>
    </section>
  );
}

function Conversation({ step }: { step: number }) {
  return (
    <Card>
      <AnimatePresence initial={false}>
        {step >= 1 && <Timestamp key="ts">{c.time}</Timestamp>}
        {step >= 1 && <ClientBubble key="c1">{c.client1}</ClientBubble>}
        {step === 2 && <Typing key="typing" />}
        {step >= 3 && <LumaBubble key="l1">{c.luma1}</LumaBubble>}
        {step >= 4 && <ClientBubble key="c2">{c.client2}</ClientBubble>}
        {step >= 5 && <Tag key="tag">{c.qualified}</Tag>}
        {step >= 6 && <Action key="action">{c.action}</Action>}
        {step >= 7 && <Treated key="treated">{c.treated}</Treated>}
      </AnimatePresence>
    </Card>
  );
}
