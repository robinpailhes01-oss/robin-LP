"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { ChannelIcon } from "@/components/ui/Diagrams";
import { guarantee } from "@/lib/content";
import { AUTOMATION_SHARE, formatEuros, miniAudit, type buildResult, type ModuleIcon } from "@/lib/miniAudit";

/**
 * Résultat du mini-audit en schéma : canaux du client → outil IA → modules, puis le temps
 * avant / après en barres et les charges économisées. Apparition au défilement ;
 * avec « réduire les animations », tout s’affiche directement à l’état final.
 */

type Result = ReturnType<typeof buildResult>;
const ease = [0.22, 1, 0.36, 1] as const;
const R = miniAudit.result;

const CHANNEL_ICON: Record<string, string> = { WhatsApp: "WhatsApp", Email: "Gmail", Téléphone: "phone", "Instagram ou Facebook": "instagram", "Site web": "site" };

function Svg({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

const MODULE_PATHS: Record<ModuleIcon, ReactNode> = {
  reply: (
    <>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
    </>
  ),
  quote: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  followup: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5M12 7v5l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18M9 15l2 2 4-4" />
    </>
  ),
  sync: (
    <>
      <path d="M4 9a8 8 0 0 1 14-3l2 2" />
      <path d="M20 4v4h-4M20 15a8 8 0 0 1-14 3l-2-2" />
      <path d="M4 20v-4h4" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="11" r="2.5" />
      <path d="M5.5 17c.6-1.8 2-2.7 3.5-2.7s2.9.9 3.5 2.7M15 10h3M15 14h3" />
    </>
  ),
};

/** Montant en euros, groupes de milliers légèrement espacés (l’espace insécable est trop fine en Inter Tight). */
function Euros({ n }: { n: number }) {
  return (
    <>
      {formatEuros(n)
        .split(" ")
        .map((g, i) => (
          <span key={i} className={i ? "ml-[0.25em]" : ""}>
            {g}
          </span>
        ))}
      &nbsp;€
    </>
  );
}

export function ResultVisual({ result }: { result: Result }) {
  const reduced = useReducedMotion();
  const appear = (i: number) =>
    reduced
      ? { initial: false as const }
      : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.4 }, transition: { duration: 0.45, ease, delay: i * 0.08 } };

  const after = Math.max(0, result.hoursNowWeek - result.hoursWeek);
  const afterShare = result.hoursNowWeek ? after / result.hoursNowWeek : 0;

  return (
    <>
      {/* Schéma de l’outil */}
      <article className="mt-8 rounded-[24px] border border-line bg-white p-5 sm:p-8">
        <motion.div {...appear(0)}>
          <p className="text-center text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{R.channelsLabel}</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {result.channels.map((c) => (
              <li key={c} className="inline-flex items-center gap-2 rounded-full border border-line bg-paper py-1.5 pl-1.5 pr-3.5 text-[14px] font-semibold text-night">
                <ChannelIcon name={CHANNEL_ICON[c] ?? "site"} size={26} />
                {c}
              </li>
            ))}
          </ul>
        </motion.div>

        <Connector reduced={!!reduced} />

        <motion.div {...appear(1)} className="flex justify-center">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-night px-5 py-3 text-[16px] font-bold text-white shadow-[0_18px_40px_-20px_rgba(23,38,61,0.8)]">
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/15">
              <Svg size={16}>
                <path d="M12 3l1.9 5.6 5.6 1.9-5.6 1.9L12 18l-1.9-5.6-5.6-1.9 5.6-1.9z" />
              </Svg>
            </span>
            {R.hub}
          </span>
        </motion.div>

        <Connector reduced={!!reduced} />

        <p className="sr-only">{R.modulesTitle}</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {result.modules.map((m, i) => (
            <motion.li key={m.title} {...appear(2 + i)} className="flex gap-3.5 rounded-2xl bg-paper p-4">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-night shadow-[0_8px_20px_-16px_rgba(23,38,61,0.6)]">
                <Svg>{MODULE_PATHS[m.icon]}</Svg>
              </span>
              <span>
                <span className="block text-[15px] font-semibold leading-snug text-night">{m.title}</span>
                <span className="mt-1 block text-[14px] leading-[1.5] text-ink">{m.text}</span>
              </span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[13px] font-semibold text-muted">{R.toolsLabel}</span>
            {(result.tools.length ? result.tools : ["Vos outils actuels"]).map((t) => (
              <span key={t} className="rounded-full bg-mist px-3 py-1 text-[13px] font-semibold text-night">
                {t}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-night">
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-mist">
              <Svg size={15}>
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </Svg>
            </span>
            {R.validate}
          </span>
        </div>
      </article>

      {/* Gains */}
      <div className="mt-6 rounded-[24px] bg-mist p-5 sm:p-8">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{R.gainsTitle}</p>

        <div className="mt-5 grid gap-4">
          <Bar label={R.now} hours={result.hoursNowWeek} share={1} tone="bg-powder" reduced={!!reduced} delay={0} />
          <Bar label={R.after} hours={after} share={afterShare} tone="bg-night" reduced={!!reduced} delay={0.25} />
        </div>

        <dl className="mt-8 grid gap-6 sm:grid-cols-3">
          <Figure label={R.freed}>≈&nbsp;{result.hoursWeek}&nbsp;h</Figure>
          <Figure label={R.perMonth}>
            ≈&nbsp;<Euros n={result.eurosMonth} />
          </Figure>
          <Figure label={R.perYear}>
            ≈&nbsp;<Euros n={result.eurosYear} />
          </Figure>
        </dl>
        <p className="mt-5 text-[13px] leading-[1.5] text-muted">{R.note(AUTOMATION_SHARE)}</p>
      </div>

      <div className="mt-6 flex items-start gap-3.5 rounded-[24px] border border-line bg-white p-5 sm:items-center sm:p-6">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-mist text-night">
          <Svg size={22}>
            <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
            <path d="M9 12l2 2 4-4" />
          </Svg>
        </span>
        <span>
          <span className="block text-[15px] font-semibold text-night">{guarantee.short}</span>
          <span className="mt-0.5 block text-[14px] leading-[1.5] text-ink">{guarantee.text}</span>
        </span>
      </div>
    </>
  );
}

function Connector({ reduced }: { reduced: boolean }) {
  return (
    <div aria-hidden className="flex justify-center py-1.5">
      <motion.span
        className="block h-7 w-px origin-top bg-powder"
        initial={reduced ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.4, ease }}
      />
    </div>
  );
}

function Bar({ label, hours, share, tone, reduced, delay }: { label: string; hours: number; share: number; tone: string; reduced: boolean; delay: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 whitespace-nowrap text-[14px]">
        <span className="font-semibold text-night">{label}</span>
        <span className="text-ink">
          <span className="font-display text-[18px] font-extrabold text-night">{hours}&nbsp;h</span> par semaine<span className="hidden sm:inline"> sur ces tâches</span>
        </span>
      </div>
      <div className="mt-2 h-3.5 overflow-hidden rounded-full bg-white">
        <motion.div
          className={`h-full origin-left rounded-full ${tone}`}
          style={{ width: `${Math.max(share * 100, 4)}%` }}
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.8, ease, delay }}
        />
      </div>
    </div>
  );
}

function Figure({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <dt className="order-2 mt-2 text-[14px] font-medium text-ink">{label}</dt>
      <dd className="order-1 font-display text-[clamp(1.9rem,1.4rem+1.2vw,2.3rem)] font-extrabold leading-none tracking-[-0.02em] text-night">{children}</dd>
    </div>
  );
}
