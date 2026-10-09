"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { ExampleTag } from "@/components/ui/Logo";

/**
 * Visuel de chaque réalisation : l’interface de l’outil livré, redessinée dans la palette du site.
 * Contenus fictifs, donc toujours accompagnés de l’étiquette « Illustration ».
 * Apparition échelonnée au défilement ; avec « réduire les animations », état final direct.
 */

const ease = [0.22, 1, 0.36, 1] as const;

type Size = "md" | "lg";

function useStep(delayBase = 0) {
  const reduced = useReducedMotion();
  return (i: number, from: { x?: number; y?: number } = { y: 10 }) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { opacity: 0, ...from },
          whileInView: { opacity: 1, x: 0, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.5, ease, delay: delayBase + i * 0.12 },
        };
}

function Check({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
      <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Panneau commun : fond bleu clair, cercles décoratifs, appareil qui sort par le bas. */
function Stage({ size, label, children, float }: { size: Size; label: string; children: ReactNode; float?: ReactNode }) {
  return (
    <div role="img" aria-label={label} className={`relative overflow-hidden rounded-[24px] bg-mist ${size === "lg" ? "h-[26rem] sm:h-[30rem]" : "h-[21rem]"}`}>
      <span aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full border border-powder" />
      <span aria-hidden className="absolute -right-10 -top-10 size-52 rounded-full border border-powder" />
      <span aria-hidden className="absolute -bottom-32 -left-20 size-80 rounded-full bg-white/50" />
      <div className="absolute left-4 top-4 z-10">
        <ExampleTag>Illustration</ExampleTag>
      </div>
      <div aria-hidden className={`relative mx-auto ${size === "lg" ? "mt-16 w-[min(19rem,80%)]" : "mt-14 w-[min(15.5rem,74%)]"}`}>
        {children}
      </div>
      {float && (
        <div aria-hidden className={`absolute z-10 ${size === "lg" ? "bottom-6 right-5 sm:right-8" : "bottom-3 right-3 origin-bottom-right scale-[0.85]"}`}>
          {float}
        </div>
      )}
    </div>
  );
}

const device = "rounded-t-[26px] border border-b-0 border-line bg-white p-2.5 pb-0 shadow-[0_30px_60px_-30px_rgba(23,38,61,0.45)]";
const floatCard = "rounded-2xl border border-line bg-white px-3.5 py-3 shadow-[0_18px_40px_-20px_rgba(23,38,61,0.5)]";

/* ------------------------------------------------------------------ */
/* Harmonie Yacht : agent WhatsApp + tableau de bord                    */
/* ------------------------------------------------------------------ */

function WhatsAppVisual({ size }: { size: Size }) {
  const step = useStep();
  const bubbles = [
    { side: "in", text: "Bonjour, le bateau est-il libre samedi pour 8 personnes ?" },
    { side: "out", text: "Bonjour ! Oui, il est disponible samedi. Je vous envoie le tarif et les options." },
    { side: "in", text: "Parfait, merci !" },
  ] as const;
  return (
    <Stage
      size={size}
      label="Illustration : un client écrit sur WhatsApp, l’agent IA répond aussitôt ; à côté, le tableau de bord de suivi des demandes."
      float={
        size === "md" ? (
          <motion.div {...step(4, { x: 16 })} className={`${floatCard} flex items-center gap-2.5`}>
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-mist text-night">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block text-[12px] font-semibold text-night">Tableau de bord</span>
              <span className="block text-[11px] text-muted">Chaque demande suivie</span>
            </span>
          </motion.div>
        ) : (
          <motion.div {...step(4, { x: 16 })} className={`${floatCard} w-[11.5rem]`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Tableau de bord</p>
            {[
              ["Demandes traitées", "w-[82%] bg-night"],
              ["Devis envoyés", "w-[58%] bg-slate"],
              ["À rappeler", "w-[24%] bg-powder"],
            ].map(([l, bar]) => (
              <div key={l} className="mt-2">
                <p className="text-[11px] font-medium text-ink">{l}</p>
                <div className="mt-1 h-1.5 rounded-full bg-mist">
                  <div className={`h-full rounded-full ${bar}`} />
                </div>
              </div>
            ))}
          </motion.div>
        )
      }
    >
      <motion.div {...step(0, { y: 24 })} className={device}>
        <div className="flex items-center gap-2.5 rounded-t-[18px] bg-night px-3 py-2.5 text-white">
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-whatsapp text-[11px] font-bold">HY</span>
          <span className="leading-tight">
            <span className="block text-[12px] font-semibold">Harmonie Yacht</span>
            <span className="block whitespace-nowrap text-[10px] text-white/70">en ligne</span>
          </span>
        </div>
        <div className="flex h-[20rem] flex-col gap-2 bg-paper px-2.5 pt-3">
          {bubbles.map((b, i) => (
            <motion.p
              key={i}
              {...step(1 + i * 0.9)}
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-[12px] leading-[1.4] text-night ${b.side === "in" ? "self-start rounded-tl-md border border-line bg-white" : "self-end rounded-tr-md bg-[#dcf8d4]"}`}
            >
              {b.text}
              {b.side === "out" && <span className="mt-1 block text-right text-[9px] font-semibold text-muted">Agent IA</span>}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Énergies Concept : bon de commande numérique                         */
/* ------------------------------------------------------------------ */

function OrderFormVisual({ size }: { size: Size }) {
  const step = useStep();
  const fields = [
    ["Client", "M. et Mme Martin"],
    ["Offre", "Pompe à chaleur"],
    ["Adresse", "12 rue des Lilas"],
  ];
  return (
    <Stage
      size={size}
      label="Illustration : un commercial remplit un bon de commande sur tablette ; chaque champ est vérifié, puis le bon part au secrétariat."
      float={
        <div className="flex flex-col items-end gap-2">
          <motion.div {...step(5, { x: 16 })} className={`${floatCard} flex items-center gap-2.5`}>
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-night text-white">
              <Check />
            </span>
            <span className="leading-tight">
              <span className="block text-[12px] font-semibold text-night">Bon complet</span>
              <span className="block text-[11px] text-muted">Reçu par le secrétariat</span>
            </span>
          </motion.div>
        </div>
      }
    >
      <motion.div {...step(0, { y: 24 })} className={device}>
        <div className="flex h-[22rem] flex-col rounded-t-[18px] bg-white px-3 pt-3">
          <div className="flex items-center justify-between">
            <p className="whitespace-nowrap text-[13px] font-bold text-night">Bon de commande</p>
            <span className="whitespace-nowrap rounded-full bg-mist px-2 py-0.5 text-[10px] font-semibold text-night">3 / 3</span>
          </div>
          <div className="mt-2 h-1 rounded-full bg-mist">
            <div className="h-full w-full rounded-full bg-night" />
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {fields.map(([l, v], i) => (
              <motion.div key={l} {...step(1 + i * 0.7)} className="flex items-center justify-between rounded-xl border border-line px-2.5 py-1.5">
                <span className="leading-tight">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.08em] text-muted">{l}</span>
                  <span className="block text-[12px] font-medium text-night">{v}</span>
                </span>
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-mist text-night">
                  <Check size={10} />
                </span>
              </motion.div>
            ))}
            <motion.div {...step(3.2)} className="rounded-xl border border-line px-2.5 py-1.5">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.08em] text-muted">Signature du client</span>
              <svg width="120" height="30" viewBox="0 0 120 30" fill="none" className="text-night">
                <path d="M4 22c8-14 14-16 16-8s-6 10 2 4 10-14 14-6 2 10 10 2 8-8 12-2 10 2 16-4 12 0 18 2 22-2 26 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </motion.div>
          </div>
          <motion.span {...step(4)} className="mt-3 inline-flex h-9 items-center justify-center rounded-full bg-night text-[12px] font-semibold text-white">
            Envoyer au secrétariat
          </motion.span>
        </div>
      </motion.div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Barber Saint-Anne : réservation en ligne                             */
/* ------------------------------------------------------------------ */

function BookingVisual({ size }: { size: Size }) {
  const step = useStep();
  const slots = ["10:00", "10:30", "11:00", "11:30", "14:00", "14:30"];
  return (
    <Stage
      size={size}
      label="Illustration : le client choisit sa prestation, son barbier et un créneau, puis reçoit un email de confirmation."
      float={
        <motion.div {...step(5, { x: 16 })} className={`${floatCard} flex items-center gap-2.5`}>
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-mist text-night">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block text-[12px] font-semibold text-night">Rendez-vous confirmé</span>
            <span className="block text-[11px] text-muted">Rappel envoyé la veille</span>
          </span>
        </motion.div>
      }
    >
      <motion.div {...step(0, { y: 24 })} className={device}>
        <div className="flex h-[22rem] flex-col rounded-t-[18px] bg-white px-3 pt-3">
          <p className="text-[13px] font-bold text-night">Réserver</p>
          <motion.div {...step(1)} className="mt-2.5 flex flex-wrap gap-1.5">
            {["Coupe", "Barbe", "Coupe + barbe"].map((p, i) => (
              <span key={p} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${i === 0 ? "bg-night text-white" : "border border-line text-night"}`}>
                {p}
              </span>
            ))}
          </motion.div>
          <motion.div {...step(1.8)} className="mt-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted">Avec</p>
            <div className="mt-1.5 flex gap-2">
              {["T", "M", "A"].map((n, i) => (
                <span key={n} className={`inline-flex size-8 items-center justify-center rounded-full text-[12px] font-bold ${i === 1 ? "bg-night text-white ring-2 ring-powder ring-offset-2" : "bg-mist text-night"}`}>
                  {n}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.div {...step(2.6)} className="mt-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted">Samedi</p>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {slots.map((s, i) => (
                <span
                  key={s}
                  className={`rounded-lg py-1.5 text-center text-[11px] font-semibold ${i === 2 ? "bg-night text-white" : i === 3 ? "bg-paper text-muted line-through" : "border border-line text-night"}`}
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.span {...step(3.4)} className="mt-3.5 inline-flex h-9 items-center justify-center rounded-full bg-night text-[12px] font-semibold text-white">
            Confirmer · 11:00
          </motion.span>
        </div>
      </motion.div>
    </Stage>
  );
}

const VISUALS: Record<string, (p: { size: Size }) => ReactNode> = {
  "harmonie-yacht": WhatsAppVisual,
  "energies-concept": OrderFormVisual,
  "barber-saint-anne": BookingVisual,
};

export function CaseVisual({ slug, size = "md" }: { slug: string; size?: Size }) {
  const V = VISUALS[slug];
  return V ? <V size={size} /> : null;
}
