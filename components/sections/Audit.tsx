"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Arrow, Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { audit, contextLine, leadsFor, type Answers } from "@/lib/audit";

const ease = [0.22, 1, 0.36, 1] as const;
type Phase = "intro" | "questions" | "result";

export function Audit() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const q = audit.questions[step];
  const selected = answers[q.key] ?? [];
  const total = audit.questions.length;

  function toggle(option: string) {
    setAnswers((a) => {
      const cur = a[q.key] ?? [];
      if (q.multiple) return { ...a, [q.key]: cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option] };
      return { ...a, [q.key]: [option] };
    });
    if (!q.multiple) setTimeout(() => next(), reduced ? 0 : 220);
  }

  function next() {
    if (step + 1 < total) setStep((s) => s + 1);
    else setPhase("result");
  }

  function restart() {
    setPhase("intro");
    setStep(0);
    setAnswers({});
    setContact("");
    setStatus("idle");
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!contact.trim() || status === "sending" || status === "done") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "mini-audit", contact: contact.trim(), answers }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const slide = {
    initial: reduced ? false : { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: reduced ? undefined : { opacity: 0, x: -24, transition: { duration: 0.25 } },
    transition: { duration: 0.45, ease },
  };

  return (
    <section id="mini-audit" className="py-20 md:py-28 scroll-mt-20">
      <div className="mx-auto max-w-luma px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[22px] bg-card border border-line">
            <span aria-hidden className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-[radial-gradient(circle,rgba(70,54,240,0.14),transparent_65%)]" />

            <div className="relative grid lg:grid-cols-12 gap-8 p-7 md:p-12">
              {/* Colonne gauche : accroche */}
              <div className="lg:col-span-5 flex flex-col">
                <Pill>{audit.pill}</Pill>
                <h2 className="t-h2 mt-5">{audit.title}</h2>
                <p className="t-body mt-4 max-w-[420px]">{audit.text}</p>
                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  {["2 minutes", "Gratuit", "Sans engagement"].map((t) => (
                    <li key={t} className="flex items-center gap-1.5 text-[13px] font-medium text-body">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="text-violet">
                        <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Colonne droite : le mini-audit */}
              <div className="lg:col-span-7 lg:pl-6">
                <div className="rounded-2xl bg-white border border-line p-6 md:p-8 min-h-[360px] flex flex-col">
                  <AnimatePresence mode="wait" initial={false}>
                    {phase === "intro" && (
                      <motion.div key="intro" {...slide} className="flex-1 flex flex-col justify-center items-start gap-5">
                        <p className="text-[18px] md:text-[20px] font-semibold tracking-[-0.02em] max-w-[420px]">
                          Cinq questions pour repérer ce qui, chez vous, pourrait fonctionner sans vous.
                        </p>
                        <Button onClick={() => setPhase("questions")}>
                          {audit.start}
                          <Arrow />
                        </Button>
                      </motion.div>
                    )}

                    {phase === "questions" && (
                      <motion.div key={`q-${step}`} {...slide} className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between gap-3 text-[12px] font-medium text-muted">
                          <span className="whitespace-nowrap">
                            Question {step + 1} sur {total}
                          </span>
                          {q.hint && <span className="text-right">{q.hint}</span>}
                        </div>
                        <div className="mt-3 h-1 rounded-full bg-line overflow-hidden" aria-hidden>
                          <motion.div
                            className="h-full bg-violet rounded-full origin-left"
                            initial={false}
                            animate={{ scaleX: (step + 1) / total }}
                            transition={{ duration: 0.5, ease }}
                          />
                        </div>
                        <h3 className="mt-6 text-[22px] md:text-[26px] font-bold tracking-[-0.03em] leading-[1.15]">{q.title}</h3>
                        <ul className="mt-6 flex flex-wrap gap-2" role={q.multiple ? "group" : "radiogroup"} aria-label={q.title}>
                          {q.options.map((o) => {
                            const on = selected.includes(o);
                            return (
                              <li key={o}>
                                <button
                                  type="button"
                                  role={q.multiple ? "checkbox" : "radio"}
                                  aria-checked={on}
                                  onClick={() => toggle(o)}
                                  className={`h-11 rounded-full px-4 text-[14px] font-medium border transition-[background-color,border-color,color,transform] duration-200 ease-[var(--ease-luma)] active:scale-[0.97] ${
                                    on ? "bg-violet border-violet text-white" : "bg-white border-line text-navy hover:border-violet/40"
                                  }`}
                                >
                                  {o}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="mt-auto pt-8 flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => (step === 0 ? setPhase("intro") : setStep((s) => s - 1))}
                            className="text-[14px] font-medium text-muted hover:text-navy transition-colors"
                          >
                            {audit.back}
                          </button>
                          {q.multiple && (
                            <Button onClick={next} disabled={selected.length === 0} className="disabled:opacity-40">
                              {step + 1 === total ? audit.see : audit.next}
                              <Arrow />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {phase === "result" && (
                      <motion.div key="result" {...slide} className="flex-1 flex flex-col">
                        <p className="t-kicker">{audit.resultKicker}</p>
                        <h3 className="mt-3 text-[22px] md:text-[24px] font-bold tracking-[-0.03em] leading-[1.15]">{audit.resultTitle}</h3>
                        <ol className="mt-5 flex flex-col gap-3">
                          {leadsFor(answers).map((l, i) => (
                            <motion.li
                              key={l.title}
                              initial={reduced ? false : { opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.45, delay: 0.15 + i * 0.12, ease }}
                              className="flex gap-3 rounded-xl bg-card border border-line p-4"
                            >
                              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-violet text-white text-[12px] font-bold tabular-nums">{i + 1}</span>
                              <div>
                                <p className="text-[15px] font-semibold leading-tight">{l.title}</p>
                                <p className="text-[14px] text-body mt-1 leading-[1.45]">{l.text}</p>
                              </div>
                            </motion.li>
                          ))}
                        </ol>
                        {contextLine(answers) && <p className="mt-3 text-[13px] text-body">{contextLine(answers)}</p>}
                        <p className="mt-2 text-[12px] text-muted">{audit.resultNote}</p>

                        <div className="mt-6 pt-6 border-t border-line">
                          <p className="text-[16px] font-semibold tracking-[-0.01em]">{audit.leadTitle}</p>
                          <p className="text-[14px] text-body mt-1">{audit.leadText}</p>
                          {status === "done" ? (
                            <p className="mt-4 flex items-center gap-2 text-[14px] font-medium text-violet">
                              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
                                <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              {audit.leadDone}
                            </p>
                          ) : (
                            <form onSubmit={submit} className="mt-4 flex flex-col sm:flex-row gap-2">
                              <label htmlFor="audit-contact" className="sr-only">
                                {audit.leadPlaceholder}
                              </label>
                              <input
                                id="audit-contact"
                                type="text"
                                autoComplete="email"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder={audit.leadPlaceholder}
                                required
                                className="flex-1 h-12 rounded-full bg-card border border-line px-5 text-[15px] placeholder:text-muted"
                              />
                              <Button type="submit" disabled={status === "sending" || !contact.trim()} className="disabled:opacity-40">
                                {audit.leadButton}
                                <Arrow />
                              </Button>
                            </form>
                          )}
                          {status === "error" && <p className="mt-2 text-[13px] text-[#c0392b]">{audit.leadError}</p>}
                        </div>
                        <button type="button" onClick={restart} className="mt-5 self-start text-[13px] font-medium text-muted hover:text-navy transition-colors">
                          {audit.restart}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
