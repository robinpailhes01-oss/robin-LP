"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { ToolIcon } from "./ToolIcons";
import { journey, offer } from "@/lib/content";

/**
 * Schémas animés de l’accueil. Les animations sont en CSS (voir globals.css, classes sch-* et jr-*) :
 * elles démarrent quand le schéma entre dans l’écran, et restent désactivées sans JavaScript
 * ou avec la préférence « réduire les animations ». Le contenu est alors affiché à son état final.
 */

function usePlay<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        el.classList.toggle("is-in", e.isIntersecting);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

const vars = (v: Record<string, string | number>) => v as CSSProperties;

function ColLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`t-kicker ${className}`}>{children}</p>;
}

function ToolChip({ icon, label, dashed = false }: { icon?: string; label: string; dashed?: boolean }) {
  return (
    <span
      className={`inline-flex h-11 items-center gap-2.5 rounded-full pl-2.5 pr-4 text-[14px] font-semibold whitespace-nowrap lg:w-[11.5rem] ${
        dashed ? "border border-dashed border-slate text-ink" : "border border-line bg-white text-night"
      }`}
    >
      {icon ? (
        <ToolIcon name={icon} size={24} />
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="text-slate">
          <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
      {label}
    </span>
  );
}

/** Ce que Luma construit : vos outils → votre outil Luma (agent IA entraîné) → vous validez. */
export function OfferSchema() {
  const ref = usePlay<HTMLElement>();
  const d = offer.dash;
  return (
    <figure ref={ref} className="sch mt-14 md:mt-16" role="img" aria-label={offer.alt}>
      <div className="rounded-[28px] bg-mist p-5 sm:p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          {/* 1. Vos outils */}
          <div className="flex flex-col lg:w-[28%]">
            <ColLabel>{offer.colTools}</ColLabel>
            <ul className="mt-4 hidden flex-1 flex-col justify-between gap-3 lg:flex">
              {offer.tools.map((t, i) => (
                <li key={t.label} className="flex items-center">
                  <ToolChip icon={t.icon} label={t.label} />
                  <span className="sch-line relative h-px flex-1 bg-powder" aria-hidden>
                    <i className="sch-dot sch-dot-x" style={vars({ "--d": `${i * 0.42}s` })} />
                  </span>
                </li>
              ))}
              <li className="flex items-center">
                <ToolChip label={offer.otherTools} dashed />
                <span className="sch-line relative h-px flex-1 bg-powder" aria-hidden>
                  <i className="sch-dot sch-dot-x" style={vars({ "--d": `${offer.tools.length * 0.42}s` })} />
                </span>
              </li>
            </ul>
            <ul className="mt-4 flex flex-wrap gap-2 lg:hidden">
              {offer.tools.map((t) => (
                <li key={t.label}>
                  <ToolChip icon={t.icon} label={t.label} />
                </li>
              ))}
              <li>
                <ToolChip label={offer.otherTools} dashed />
              </li>
            </ul>
          </div>

          <Connector />

          {/* 2. Votre outil Luma */}
          <div className="flex flex-col lg:w-[36%]">
            <ColLabel>{offer.colLuma}</ColLabel>
            <div className="mt-4 flex flex-1 flex-col justify-between gap-7 rounded-[24px] bg-night p-6 text-white sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-start gap-0.5 font-display text-[28px] font-extrabold leading-none tracking-[-0.045em]">
                  Luma
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="-mt-0.5 text-powder" aria-hidden>
                    <path d="M8 0c.6 4.6 3.4 7.4 8 8-4.6.6-7.4 3.4-8 8-.6-4.6-3.4-7.4-8-8 4.6-.6 7.4-3.4 8-8z" fill="currentColor" />
                  </svg>
                </span>
                <span className="inline-flex h-7 items-center gap-2 rounded-full bg-white/10 px-3 text-[12px] font-semibold">
                  <span className="sch-live size-1.5 rounded-full bg-whatsapp" aria-hidden />
                  {offer.agent}
                </span>
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-powder">{offer.trained}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {offer.training.map((t, i) => (
                    <li key={t} className="sch-learn flex h-11 items-center gap-3 rounded-xl border px-4 text-[15px] font-semibold" style={vars({ "--i": i })}>
                      <span className="sch-learn-dot size-2 shrink-0 rounded-full" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Connector desktop delay="1.1s" />

          {/* 3. Vous */}
          <div className="flex flex-col lg:w-[28%]">
            <ColLabel>{offer.colYou}</ColLabel>
            <div className="mt-4 flex flex-1 flex-col overflow-hidden rounded-[24px] border border-line bg-white">
              <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <p className="text-[14px] font-semibold text-night">{d.title}</p>
                <span className="size-2 rounded-full bg-slate" aria-hidden />
              </header>
              <ul className="flex flex-col gap-2 p-4">
                {d.rows.map((r, i) => (
                  <li key={r.label} className="sch-row flex h-12 items-center justify-between gap-3 rounded-xl border border-line bg-paper px-3.5 text-[14px]" style={vars({ "--i": i })}>
                    <span className="font-medium text-night">{r.label}</span>
                    <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-mist px-2.5 text-[12px] font-semibold text-night">{r.status}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto px-4 pb-4">
                <span className="sch-ok relative inline-flex h-11 items-center gap-2 rounded-full bg-night px-5 text-[14px] font-semibold text-white">
                  <svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {d.validate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="t-lead mx-auto mt-8 max-w-[40rem] text-center">{offer.caption}</figcaption>
    </figure>
  );
}

/** Trait entre deux colonnes : vertical sur mobile ; sur grand écran, seul le trait vers « Vous » est ici (les autres partent de chaque outil). */
function Connector({ desktop = false, delay = "0s" }: { desktop?: boolean; delay?: string }) {
  return (
    <>
      <span className="sch-line relative mx-auto my-3 block h-10 w-px bg-powder lg:hidden" aria-hidden>
        <i className="sch-dot sch-dot-y" style={vars({ "--d": delay })} />
      </span>
      {desktop && (
        <div className="hidden w-14 shrink-0 flex-col lg:flex" aria-hidden>
          <ColLabel className="invisible">.</ColLabel>
          <div className="mt-4 flex flex-1 items-center">
            <span className="sch-line relative block h-px w-full bg-powder">
              <i className="sch-dot sch-dot-x" style={vars({ "--d": delay })} />
            </span>
          </div>
        </div>
      )}
    </>
  );
}

const ICONS = [
  // Appel
  <path key="a" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />,
  // Comprendre
  <g key="b">
    <circle cx="11" cy="11" r="7.5" />
    <path d="M21 21l-4.7-4.7" />
  </g>,
  // Construire et brancher
  <g key="c">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </g>,
  // Il travaille, vous validez
  <g key="d">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4L12 14.01l-3-3" />
  </g>,
];

/** Parcours en quatre étapes : un trait se dessine et allume chaque étape tour à tour. */
export function JourneySchema() {
  const ref = usePlay<HTMLOListElement>();
  const last = journey.steps.length - 1;
  return (
    <ol ref={ref} className="jr mt-14 grid gap-10 md:mt-16 lg:grid-cols-4 lg:gap-8">
      {journey.steps.map((s, i) => (
        <li key={s.name} className="relative flex gap-5 lg:block" style={vars({ "--i": i })}>
          {i < last && (
            <span
              aria-hidden
              className="jr-seg absolute left-6 top-14 h-[calc(100%-16px)] w-px origin-top bg-slate/60 lg:left-14 lg:top-6 lg:h-px lg:w-[calc(100%-24px)] lg:origin-left"
            />
          )}
          <span className="jr-dot relative inline-flex size-12 shrink-0 items-center justify-center rounded-full border" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {ICONS[i]}
            </svg>
          </span>
          <div className="jr-txt lg:mt-6">
            <h3 className="t-h3 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="sr-only">Étape {i + 1} : </span>
              {s.name}
            </h3>
            <p className="t-body mt-2 text-[15px]">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
