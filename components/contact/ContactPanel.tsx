"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useContact } from "./ContactContext";
import { Card, ClientBubble, LumaBubble, Typing } from "@/components/ui/Conversation";
import { contactDone, contactQuestions, cta } from "@/lib/content";

type Msg = { from: "luma" | "client"; text: string };
type Status = "idle" | "sending" | "done" | "error";

export function ContactPanel() {
  const { open, closeContact } = useContact();
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Réinitialise et pose la première question à l’ouverture.
  useEffect(() => {
    if (!open) return;
    setMessages([]);
    setAnswers({});
    setStep(0);
    setValue("");
    setStatus("idle");
    setTyping(true);
    const id = setTimeout(() => {
      setTyping(false);
      setMessages([{ from: "luma", text: contactQuestions[0].text }]);
      inputRef.current?.focus();
    }, reduced ? 0 : 600);
    return () => clearTimeout(id);
  }, [open, reduced]);

  // Échap ferme, et le scroll de page est bloqué tant que le panneau est ouvert.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeContact();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeContact]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, typing, reduced]);

  async function submit(all: Record<string, string>) {
    setStatus("sending");
    setTyping(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(all),
      });
      if (!res.ok) throw new Error(String(res.status));
      setTyping(false);
      setMessages((m) => [...m, { from: "luma", text: contactDone }]);
      setStatus("done");
    } catch {
      setTyping(false);
      setMessages((m) => [...m, { from: "luma", text: "L’envoi n’a pas abouti. Vous pouvez réessayer." }]);
      setStatus("error");
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = value.trim();
    if (!text || typing || status === "sending" || status === "done") return;
    if (status === "error") {
      setStatus("idle");
      void submit(answers);
      return;
    }
    const q = contactQuestions[step];
    const next = { ...answers, [q.key]: text };
    setAnswers(next);
    setMessages((m) => [...m, { from: "client", text }]);
    setValue("");
    if (step + 1 < contactQuestions.length) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { from: "luma", text: contactQuestions[step + 1].text }]);
        setStep(step + 1);
        inputRef.current?.focus();
      }, reduced ? 0 : 700);
    } else {
      void submit(next);
    }
  }

  const placeholder =
    status === "done" ? "Merci, à très vite." : status === "error" ? "Appuyez sur Entrée pour réessayer" : contactQuestions[step].placeholder;
  const inputType = status === "idle" && contactQuestions[step].key === "contact" ? "text" : "text";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Fermer"
            onClick={closeContact}
            className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-surface flex flex-col border-l border-surface-alt"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between px-5 sm:px-6 h-16 border-b border-surface-alt">
              <h2 id="contact-title" className="text-[15px] font-medium">
                {cta.primary}
              </h2>
              <button
                type="button"
                onClick={closeContact}
                className="size-10 -mr-2 inline-flex items-center justify-center rounded-full hover:bg-surface-alt"
                aria-label="Fermer le panneau"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div ref={listRef} className="flex-1 overflow-y-auto px-5 sm:px-6 py-6">
              <Card className="max-w-none bg-transparent border-0 shadow-none p-0">
                {messages.map((m, i) =>
                  m.from === "luma" ? <LumaBubble key={i}>{m.text}</LumaBubble> : <ClientBubble key={i}>{m.text}</ClientBubble>,
                )}
                {typing && <Typing />}
              </Card>
            </div>

            <form onSubmit={onSubmit} className="p-4 sm:p-5 border-t border-surface-alt flex gap-2">
              <label htmlFor="contact-input" className="sr-only">
                Votre réponse
              </label>
              <input
                ref={inputRef}
                id="contact-input"
                type={inputType}
                autoComplete={status === "idle" && contactQuestions[step].key === "contact" ? "email" : "off"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                disabled={status === "done" || status === "sending"}
                className="flex-1 h-12 rounded-full bg-white/70 border border-surface-alt px-5 text-[15px] placeholder:text-muted disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "done" || status === "sending" || !value.trim()}
                className="size-12 shrink-0 rounded-full bg-accent text-white inline-flex items-center justify-center disabled:opacity-40 transition-opacity"
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
