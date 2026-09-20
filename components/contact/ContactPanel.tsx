"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useContact } from "./ContactContext";
import { contactDone, contactQuestions, cta } from "@/lib/content";
import { Button, Arrow } from "@/components/ui/Button";
export function ContactPanel() {
  const { open, closeContact } = useContact();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const abort = useRef<AbortController | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  useEffect(() => {
    if (!open) {
      dialog.current?.close();
      return;
    }
    setStep(0);
    setAnswers(["", "", ""]);
    setStatus("idle");
    dialog.current?.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    input.current?.focus();
    return () => {
      abort.current?.abort();
      document.body.style.overflow = prev;
    };
  }, [open]);
  useEffect(() => {
    if (open) input.current?.focus();
  }, [step, open]);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending" || !answers[step].trim()) return;
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setStatus("sending");
    abort.current = new AbortController();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(
            contactQuestions.map((q, i) => [q.key, answers[i].trim()]),
          ),
        ),
        signal: abort.current.signal,
      });
      if (!res.ok) throw new Error("delivery");
      setStatus("done");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setStatus("error");
    }
  }
  return (
    <dialog
      ref={dialog}
      className="contact-dialog"
      aria-labelledby="contact-title"
      onCancel={closeContact}
      onClose={closeContact}
    >
      <header>
        <h2 id="contact-title">{cta.primary}</h2>
        <button
          className="close-button"
          onClick={closeContact}
          aria-label="Fermer le panneau"
        >
          ×
        </button>
      </header>
      <div className="contact-content">
        {status === "done" ? (
          <div className="contact-success" role="status">
            <span className="shield">✓</span>
            <h3>Merci pour votre message.</h3>
            <p className="t-body">{contactDone}</p>
            <Button onClick={closeContact} className="mt-8">
              Revenir au site
            </Button>
          </div>
        ) : (
          <>
            <p className="contact-step">
              Votre entreprise · Étape {step + 1} sur 3
            </p>
            {contactQuestions.slice(0, step + 1).map((q, i) => (
              <div key={q.key}>
                <p className="contact-question">{q.text}</p>
                {i < step && <p className="contact-answer">{answers[i]}</p>}
              </div>
            ))}
            {status === "error" && (
              <p role="alert" className="t-body mt-6">
                L’envoi n’a pas abouti. Vos réponses sont conservées, vous
                pouvez réessayer.
              </p>
            )}
          </>
        )}
      </div>
      {status !== "done" && (
        <form className="contact-form" onSubmit={submit}>
          <label htmlFor="contact-input">
            {step === 0
              ? "Votre secteur d’activité"
              : step === 1
                ? "Les tâches à simplifier"
                : "Votre email ou téléphone"}
          </label>
          <input
            ref={input}
            id="contact-input"
            value={answers[step]}
            onChange={(e) =>
              setAnswers((a) =>
                a.map((v, i) => (i === step ? e.target.value : v)),
              )
            }
            placeholder={contactQuestions[step].placeholder}
            required
            maxLength={500}
            disabled={status === "sending"}
            autoComplete={step === 2 ? "email" : "off"}
          />
          <div className="button-row">
            {step > 0 && (
              <Button
                type="button"
                variant="light"
                disabled={status === "sending"}
                onClick={() => {
                  setStatus("idle");
                  setStep(step - 1);
                }}
              >
                Retour
              </Button>
            )}
            <Button
              type="submit"
              disabled={status === "sending" || !answers[step].trim()}
            >
              {status === "sending"
                ? "Envoi…"
                : status === "error"
                  ? "Réessayer"
                  : step === 2
                    ? "Envoyer ma demande"
                    : "Continuer"}
              <Arrow />
            </Button>
          </div>
          <p className="micro">
            Ces informations servent à vous recontacter au sujet de votre
            demande.
          </p>
        </form>
      )}
    </dialog>
  );
}
