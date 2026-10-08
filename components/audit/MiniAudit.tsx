"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Arrow, Button } from "@/components/ui/Button";
import { buildResult, formatEuros, miniAudit, type AuditAnswers } from "@/lib/miniAudit";
import { ResultVisual } from "./ResultVisual";

/**
 * Mini-audit en libre-service : une question par écran, puis les coordonnées, puis le résultat.
 * Le lead part vers /api/contact dès l’envoi des coordonnées, avec les réponses et l’estimation.
 */

type Phase = "questions" | "contact" | "result";
type Status = "idle" | "sending" | "sent" | "error";
const ease = [0.22, 1, 0.36, 1] as const;
const Q = miniAudit.questions;

function Check({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden className={`shrink-0 ${className}`}>
      <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

async function send(body: Record<string, unknown>) {
  const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(String(res.status));
}

export function MiniAudit() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("questions");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AuditAnswers>({});
  const [picked, setPicked] = useState<string[]>([]);
  const [detail, setDetail] = useState("");
  const [contact, setContact] = useState({ name: "", company: "", email: "", phone: "" });
  const [invalid, setInvalid] = useState(false);
  const [lead, setLead] = useState<Status>("idle");
  const [callback, setCallback] = useState<Status>("idle");
  const headingRef = useRef<HTMLHeadingElement>(null);

  const q = Q[step];
  const total = Q.length + 1;
  const position = phase === "questions" ? step : phase === "contact" ? Q.length : total;
  const result = phase === "result" ? buildResult(answers) : null;

  // Le titre de chaque nouvel écran reçoit le focus (pas au premier affichage) : lecteurs d’écran et clavier suivent le parcours.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: false });
  }, [step, phase]);

  useEffect(() => {
    if (phase === "questions") {
      setPicked(answers[q.key] ?? []);
      setDetail(answers.toolsDetail?.[0] ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, phase]);

  function commit(values: string[]) {
    const extra = q.detail ? { toolsDetail: detail.trim() ? [detail.trim().slice(0, 200)] : [] } : {};
    setAnswers((a) => ({ ...a, [q.key]: values, ...extra }));
    if (step + 1 < Q.length) setStep(step + 1);
    else setPhase("contact");
  }

  function choose(label: string) {
    if (!q.multiple) return commit([label]);
    setPicked((p) => (p.includes(label) ? p.filter((x) => x !== label) : [...p, label]));
  }

  function back() {
    if (phase === "contact") return setPhase("questions");
    if (step > 0) setStep(step - 1);
  }

  /** Coordonnées, réponses et estimation : envoyées avec le lead puis avec la demande de rappel. */
  function leadAnswers() {
    const r = buildResult(answers);
    return {
      ...answers,
      name: [contact.name.trim()],
      company: contact.company.trim() ? [contact.company.trim()] : [],
      email: [contact.email.trim()],
      phone: contact.phone.trim() ? [contact.phone.trim()] : [],
      estimate: [`${r.hoursWeek} h par semaine`, `${formatEuros(r.eurosMonth)} € par mois`],
      source: ["mini-audit"],
    };
  }

  async function submitLead() {
    setLead("sending");
    try {
      await send({ kind: "mini-audit", contact: contact.email.trim() || contact.phone.trim(), answers: leadAnswers() });
      setLead("sent");
    } catch {
      setLead("error");
    }
  }

  function onContact(e: FormEvent) {
    e.preventDefault();
    if (!contact.name.trim() || !/^\S+@\S+\.\S+$/.test(contact.email.trim())) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setPhase("result");
    void submitLead();
  }

  async function askCallback() {
    setCallback("sending");
    try {
      await send({ kind: "rappel", contact: contact.phone.trim() || contact.email.trim(), answers: leadAnswers() });
      setCallback("sent");
    } catch {
      setCallback("error");
    }
  }

  function restart() {
    setAnswers({});
    setDetail("");
    setStep(0);
    setPhase("questions");
    setLead("idle");
    setCallback("idle");
  }

  const motionProps = reduced
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.3, ease } };

  return (
    <div className="mx-auto w-full max-w-[44rem]">
      {phase !== "result" && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-[13px] font-medium text-muted">
            <span>
              Étape {Math.min(position + 1, total)} sur {total}
            </span>
            {(step > 0 || phase === "contact") && (
              <button type="button" onClick={back} className="min-h-11 px-1 font-semibold text-night hover:underline">
                {miniAudit.back}
              </button>
            )}
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={position} aria-label="Progression">
            <motion.div className="h-full rounded-full bg-night" animate={{ width: `${(position / total) * 100}%` }} transition={{ duration: reduced ? 0 : 0.4, ease }} />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === "questions" && (
          <motion.section key={`q-${step}`} {...motionProps} aria-labelledby="audit-q">
            <h2 id="audit-q" ref={headingRef} tabIndex={-1} className="scroll-mt-32 t-h2 text-[clamp(1.6rem,1.1rem+1.8vw,2.4rem)] outline-none">
              {q.title}
            </h2>
            {q.hint && <p className="mt-3 text-[15px] text-muted">{q.hint}</p>}
            <ul className="mt-8 grid gap-3 sm:grid-cols-2" role={q.multiple ? "group" : "radiogroup"} aria-labelledby="audit-q">
              {q.options.map((o) => {
                const on = picked.includes(o.label) || (!q.multiple && answers[q.key]?.[0] === o.label);
                return (
                  <li key={o.label}>
                    <button
                      type="button"
                      role={q.multiple ? "checkbox" : "radio"}
                      aria-checked={on}
                      onClick={() => choose(o.label)}
                      className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border px-5 text-left text-[16px] font-semibold transition-[background-color,border-color,color] duration-200 ${
                        on ? "border-night bg-night text-white" : "border-line bg-white text-night hover:border-night/40"
                      }`}
                    >
                      {o.label}
                      {q.multiple && (
                        <span className={`inline-flex size-5 shrink-0 items-center justify-center rounded-md border ${on ? "border-white bg-white text-night" : "border-powder"}`} aria-hidden>
                          {on && <Check />}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            {q.detail && (
              <label className="mt-6 flex flex-col gap-2 text-[14px] font-semibold text-night">
                {q.detail.label}
                <input
                  type="text"
                  value={detail}
                  maxLength={200}
                  placeholder={q.detail.placeholder}
                  onChange={(e) => setDetail(e.target.value)}
                  className="h-12 rounded-xl border border-powder bg-white px-4 text-[16px] font-normal text-night placeholder:text-muted focus:border-night focus:outline-none focus-visible:outline-2 focus-visible:outline-night"
                />
              </label>
            )}
            {q.multiple && (
              <div className="mt-8">
                <Button onClick={() => picked.length && commit(picked)} disabled={picked.length === 0}>
                  {miniAudit.next}
                  <Arrow />
                </Button>
              </div>
            )}
          </motion.section>
        )}

        {phase === "contact" && (
          <motion.section key="contact" {...motionProps} aria-labelledby="audit-contact">
            <h2 id="audit-contact" ref={headingRef} tabIndex={-1} className="scroll-mt-32 t-h2 text-[clamp(1.6rem,1.1rem+1.8vw,2.4rem)] outline-none">
              {miniAudit.contact.title}
            </h2>
            <p className="t-lead mt-4">{miniAudit.contact.text}</p>
            <form onSubmit={onContact} className="mt-8 grid gap-4 sm:grid-cols-2" noValidate>
              {(
                [
                  ["name", miniAudit.contact.name, "given-name", "text"],
                  ["company", miniAudit.contact.company, "organization", "text"],
                  ["email", miniAudit.contact.email, "email", "email"],
                  ["phone", miniAudit.contact.phone, "tel", "tel"],
                ] as const
              ).map(([key, label, auto, type]) => (
                <label key={key} className="flex flex-col gap-2 text-[14px] font-semibold text-night">
                  {label}
                  <input
                    type={type}
                    autoComplete={auto}
                    value={contact[key]}
                    onChange={(e) => setContact((c) => ({ ...c, [key]: e.target.value }))}
                    aria-invalid={invalid && (key === "name" || key === "email") ? true : undefined}
                    className="h-12 rounded-xl border border-powder bg-white px-4 text-[16px] font-normal text-night focus:border-night focus:outline-none focus-visible:outline-2 focus-visible:outline-night"
                  />
                </label>
              ))}
              {invalid && (
                <p role="alert" className="text-[14px] font-medium text-night sm:col-span-2">
                  {miniAudit.contact.invalid}
                </p>
              )}
              <div className="flex flex-col gap-4 sm:col-span-2">
                <Button type="submit" className="w-fit">
                  {miniAudit.contact.submit}
                  <Arrow />
                </Button>
                <p className="text-[13px] leading-[1.5] text-muted">{miniAudit.contact.consent}</p>
              </div>
            </form>
          </motion.section>
        )}

        {phase === "result" && result && (
          <motion.section key="result" {...motionProps} aria-labelledby="audit-result">
            <p className="t-kicker">{miniAudit.result.kicker}</p>
            <h2 id="audit-result" ref={headingRef} tabIndex={-1} className="scroll-mt-32 t-h2 mt-4 text-[clamp(1.7rem,1.1rem+2vw,2.6rem)] outline-none">
              {miniAudit.result.toolTitle(contact.company.trim())}
            </h2>

            <ResultVisual result={result} />

            {lead === "error" && (
              <p role="alert" className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-night">
                {miniAudit.result.sendError}
                <button type="button" onClick={() => void submitLead()} className="min-h-11 font-semibold underline">
                  {miniAudit.result.retry}
                </button>
              </p>
            )}

            <div className="mt-8 rounded-[24px] bg-night p-6 text-white sm:p-8">
              <h3 className="font-display text-[24px] font-extrabold tracking-[-0.02em]">{miniAudit.result.callbackTitle}</h3>
              <p className="mt-2 max-w-[34rem] text-[15px] leading-[1.5] text-white/80">{miniAudit.result.callbackText}</p>
              <div className="mt-6" aria-live="polite">
                {callback === "sent" ? (
                  <p className="text-[15px] font-semibold">{miniAudit.result.callbackDone}</p>
                ) : (
                  <Button variant="onDark" onClick={() => void askCallback()} disabled={callback === "sending"}>
                    {miniAudit.result.callback}
                    <Arrow />
                  </Button>
                )}
                {callback === "error" && <p className="mt-3 text-[14px] text-white/80">{miniAudit.result.sendError}</p>}
              </div>
            </div>

            <button type="button" onClick={restart} className="mt-6 min-h-11 text-[14px] font-semibold text-muted hover:text-night">
              {miniAudit.result.restart}
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
