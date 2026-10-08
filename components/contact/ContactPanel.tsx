"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useContact } from "./ContactContext";
import { audit, contextLine, leadsFor, type Answers } from "@/lib/audit";

/**
 * Panneau « Assistant de Robin » : cinq questions préparées par Robin, à réponses rapides,
 * une question libre, des premières pistes, puis prénom, entreprise et téléphone ou email.
 * Robin rappelle sous 24 h. Envoi vers /api/contact.
 */

type Msg =
  | { id: number; from: "luma"; text: string }
  | { id: number; from: "client"; text: string }
  | { id: number; from: "leads"; leads: { title: string; text: string }[]; context: string };

type Status = "idle" | "sending" | "done" | "error";
const ease = [0.22, 1, 0.36, 1] as const;
let seq = 0;
const nid = () => ++seq;

export function ContactPanel() {
  const { open, closeContact } = useContact();
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [phase, setPhase] = useState<"questions" | "free" | "who" | "contact">("questions");
  const [typing, setTyping] = useState(false);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const q = audit.questions[Math.min(step, audit.questions.length - 1)];
  const delay = (ms: number) => (reduced ? 0 : ms);

  function say(text: string, after = 600) {
    setTyping(true);
    return new Promise<void>((resolve) =>
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { id: nid(), from: "luma", text }]);
        resolve();
      }, delay(after)),
    );
  }

  // Ouverture : on repart de zéro et l’assistant de Robin se présente.
  useEffect(() => {
    if (!open) return;
    setMessages([]);
    setAnswers({});
    setStep(0);
    setPicked([]);
    setPhase("questions");
    setValue("");
    setStatus("idle");
    let cancelled = false;
    (async () => {
      await say(audit.agent.hello, 500);
      if (cancelled) return;
      await say(audit.agent.purpose, 900);
      if (cancelled) return;
      await say(audit.questions[0].title, 700);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeContact();
    window.addEventListener("keydown", onKey);
    const opener = document.activeElement as HTMLElement | null;
    const f = setTimeout(() => closeRef.current?.focus(), 50);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(f);
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, [open, closeContact]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, typing, picked, reduced]);

  async function answer(values: string[]) {
    const text = values.join(", ");
    setMessages((m) => [...m, { id: nid(), from: "client", text }]);
    const next = { ...answers, [q.key]: values };
    setAnswers(next);
    setPicked([]);
    setValue("");
    if (step + 1 < audit.questions.length) {
      setStep(step + 1);
      await say(audit.questions[step + 1].title, 700);
    } else if (q.key !== "tools" || phase === "free") {
      await finish(next);
    } else {
      setPhase("free");
      await say(audit.agent.freeQuestion, 800);
      inputRef.current?.focus();
    }
  }

  async function submitFree(text: string) {
    setMessages((m) => [...m, { id: nid(), from: "client", text }]);
    setValue("");
    const next = { ...answers, need: [text] };
    setAnswers(next);
    await finish(next);
  }

  async function finish(next: Answers) {
    {
      await say(audit.agent.beforeLeads, 700);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { id: nid(), from: "leads", leads: leadsFor(next), context: contextLine(next) }]);
      }, delay(900));
      setTimeout(async () => {
        await say(audit.agent.askWho, 600);
        setPhase("who");
        inputRef.current?.focus();
      }, delay(1800));
    }
  }

  function toggle(option: string) {
    if (!q.multiple) {
      void answer([option]);
      return;
    }
    setPicked((p) => (p.includes(option) ? p.filter((o) => o !== option) : [...p, option]));
  }

  async function submitWho(text: string) {
    setMessages((m) => [...m, { id: nid(), from: "client", text }]);
    setValue("");
    setAnswers((a) => ({ ...a, who: [text] }));
    await say(audit.agent.askContact, 600);
    setPhase("contact");
    inputRef.current?.focus();
  }

  async function submitContact(contact: string) {
    setMessages((m) => [...m, { id: nid(), from: "client", text: contact }]);
    setValue("");
    setStatus("sending");
    setTyping(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "assistant", contact, answers: { ...answers, source: ["assistant"] } }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setTyping(false);
      setMessages((m) => [...m, { id: nid(), from: "luma", text: audit.agent.done }]);
      setStatus("done");
    } catch {
      setTyping(false);
      setMessages((m) => [...m, { id: nid(), from: "luma", text: audit.agent.error }]);
      setStatus("error");
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = value.trim();
    if (typing || status === "sending" || status === "done") return;
    if (phase === "contact") {
      if (text) void submitContact(text);
      return;
    }
    if (phase === "who") {
      if (text) void submitWho(text);
      return;
    }
    if (phase === "free") {
      if (text) void submitFree(text);
      return;
    }
    // Réponse libre à une question
    if (text) void answer([text]);
    else if (q.multiple && picked.length) void answer(picked);
  }

  const canSend = phase === "questions" ? value.trim().length > 0 || (q.multiple && picked.length > 0) : value.trim().length > 0;
  const placeholder = phase === "contact" ? audit.leadPlaceholder : phase === "who" ? audit.agent.whoPlaceholder : phase === "free" ? audit.agent.freePlaceholder : "Ou écrivez votre réponse…";
  const showChips = phase === "questions" && !typing && status === "idle";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Fermer"
            onClick={closeContact}
            className="fixed inset-0 z-40 bg-night/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white flex flex-col border-l border-line"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.35, ease }}
          >
            <header className="flex items-center justify-between px-5 sm:px-6 h-[72px] border-b border-line">
              <div className="flex items-center gap-3">
                <Avatar size={40} />
                <div>
                  <h2 id="contact-title" className="font-display text-[16px] font-bold leading-tight text-night">
                    {audit.agent.name}
                  </h2>
                  <p className="text-[13px] text-muted leading-tight mt-0.5">{audit.agent.role}</p>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={closeContact}
                className="size-11 -mr-2 inline-flex items-center justify-center rounded-full text-night hover:bg-mist"
                aria-label="Fermer le panneau"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div ref={listRef} className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 flex flex-col gap-3" aria-live="polite">
              {messages.map((m) =>
                m.from === "luma" ? (
                  <LumaRow key={m.id}>
                    <Bubble side="luma">{m.text}</Bubble>
                  </LumaRow>
                ) : m.from === "client" ? (
                  <Bubble key={m.id} side="client">
                    {m.text}
                  </Bubble>
                ) : (
                  <LumaRow key={m.id}>
                    <motion.div
                      initial={reduced ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease }}
                      className="max-w-[92%] rounded-[18px] rounded-bl-[6px] bg-mist p-3.5 flex flex-col gap-2"
                    >
                      <p className="t-kicker">{audit.resultKicker}</p>
                      <ol className="flex flex-col gap-2">
                        {m.leads.map((l, i) => (
                          <li key={l.title} className="flex gap-2.5 rounded-xl bg-white border border-line p-3">
                            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-night text-white text-[11px] font-bold tabular-nums">{i + 1}</span>
                            <div>
                              <p className="text-[14px] font-semibold leading-tight text-night">{l.title}</p>
                              <p className="text-[13px] text-ink mt-1 leading-[1.45]">{l.text}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                      {m.context && <p className="text-[13px] text-ink">{m.context}</p>}
                      <p className="text-[12px] text-muted leading-[1.45]">{audit.resultNote}</p>
                    </motion.div>
                  </LumaRow>
                ),
              )}
              {typing && (
                <LumaRow>
                  <div className="rounded-[18px] rounded-bl-[6px] bg-night px-4 py-3 flex gap-1.5" role="status" aria-label="Message en cours">
                    <span className="typing-dot block size-1.5 rounded-full bg-white" />
                    <span className="typing-dot block size-1.5 rounded-full bg-white" />
                    <span className="typing-dot block size-1.5 rounded-full bg-white" />
                  </div>
                </LumaRow>
              )}
              {showChips && (
                <motion.ul
                  key={`chips-${step}`}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05, ease }}
                  className="flex flex-wrap gap-2 pl-0 sm:pl-[42px]"
                  role={q.multiple ? "group" : "radiogroup"}
                  aria-label={q.title}
                >
                  {q.options.map((o) => {
                    const on = picked.includes(o);
                    return (
                      <li key={o}>
                        <button
                          type="button"
                          role={q.multiple ? "checkbox" : "radio"}
                          aria-checked={on}
                          onClick={() => toggle(o)}
                          className={`min-h-11 rounded-full px-4 text-[14px] font-medium border transition-[background-color,border-color,color] duration-200 ease-[var(--ease-luma)] ${
                            on ? "bg-night border-night text-white" : "bg-white border-powder text-night hover:border-night/50 hover:bg-paper"
                          }`}
                        >
                          {o}
                        </button>
                      </li>
                    );
                  })}
                  {q.multiple && (
                    <li className="w-full mt-1">
                      <button
                        type="button"
                        onClick={() => picked.length && void answer(picked)}
                        disabled={picked.length === 0}
                        className="min-h-11 rounded-full px-5 text-[14px] font-semibold bg-night text-white hover:bg-night-hover disabled:opacity-30 transition-[opacity,background-color]"
                      >
                        {q.hint ? "Valider" : "Suivant"}
                      </button>
                    </li>
                  )}
                </motion.ul>
              )}
            </div>

            <form onSubmit={onSubmit} className="p-4 sm:p-5 border-t border-line flex gap-2">
              <label htmlFor="contact-input" className="sr-only">
                Votre réponse
              </label>
              <input
                ref={inputRef}
                id="contact-input"
                type="text"
                autoComplete={phase === "contact" ? "tel" : "off"}
                inputMode="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={status === "done" ? "Merci, à très vite." : placeholder}
                disabled={status === "done" || status === "sending" || typing}
                className="flex-1 min-w-0 h-12 rounded-full bg-paper border border-powder px-5 text-[16px] text-night placeholder:text-muted focus:border-night focus:outline-none focus-visible:outline-2 focus-visible:outline-night disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "done" || status === "sending" || typing || !canSend}
                className="size-12 shrink-0 rounded-full bg-night text-white hover:bg-night-hover inline-flex items-center justify-center disabled:opacity-40 transition-[opacity,background-color]"
                aria-label="Envoyer"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/** Avatar de l’assistant : l’étoile Luma, pour ne pas laisser croire que Robin répond en direct. */
export function Avatar({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-night text-white" style={{ width: size, height: size }} aria-hidden>
      <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 16 16" fill="none">
        <path d="M8 0c.6 4.6 3.4 7.4 8 8-4.6.6-7.4 3.4-8 8-.6-4.6-3.4-7.4-8-8 4.6-.6 7.4-3.4 8-8z" fill="currentColor" />
      </svg>
    </span>
  );
}

function LumaRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-end gap-2.5">
      <Avatar size={32} />
      {children}
    </div>
  );
}

function Bubble({ side, children }: { side: "luma" | "client"; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
      className={
        side === "luma"
          ? "max-w-[85%] rounded-[18px] rounded-bl-[6px] bg-mist text-night px-4 py-2.5 text-[15px] leading-[1.45]"
          : "self-end max-w-[85%] rounded-[18px] rounded-br-[6px] bg-night text-white px-4 py-2.5 text-[15px] leading-[1.45]"
      }
    >
      {children}
    </motion.div>
  );
}
