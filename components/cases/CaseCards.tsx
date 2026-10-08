import Link from "next/link";
import { Arrow } from "@/components/ui/Button";
import { ClientMark } from "@/components/ui/ClientMark";
import { casesIndex, type CaseStudy } from "@/lib/content";
import { CaseVisual } from "./CaseVisual";

/** Carte de réalisation : visuel de l’outil, client, phrase clé et premier chiffre. Toute la carte mène à la page du client. */
export function CaseCard({ c, headingLevel = "h3" }: { c: CaseStudy; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Link href={`/cas-clients/${c.slug}`} className="group flex h-full flex-col rounded-[28px] border border-line bg-white p-3 transition-[border-color,box-shadow] duration-300 hover:border-powder hover:shadow-[0_30px_60px_-40px_rgba(23,38,61,0.55)]">
      <div className="transition-transform duration-500 ease-[var(--ease-luma)] group-hover:-translate-y-0.5">
        <CaseVisual slug={c.slug} />
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
        <div className="flex items-center gap-3">
          <ClientMark c={c} size="sm" />
          <div className="leading-tight">
            <H className="font-display text-[18px] font-bold tracking-[-0.015em] text-night">{c.client}</H>
            <p className="text-[13px] text-muted">{c.sector}</p>
          </div>
        </div>
        <p className="mt-4 text-[16px] leading-[1.5] text-ink">{c.summary}</p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          {c.stats[0] && (
            <p>
              <span className="block whitespace-nowrap font-display text-[30px] font-extrabold leading-none tracking-[-0.02em] text-night">{c.stats[0].value}</span>
              <span className="mt-1.5 block max-w-[14rem] text-[13px] leading-[1.4] text-muted">{c.stats[0].label}</span>
            </p>
          )}
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-powder text-night transition-colors duration-200 group-hover:border-night group-hover:bg-night group-hover:text-white">
            <Arrow />
            <span className="sr-only">
              {casesIndex.read} {c.client}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Grande ligne de réalisation pour la page /cas-clients : visuel d’un côté, récit court de l’autre, en alternance. */
export function CaseFeature({ c, flip = false }: { c: CaseStudy; flip?: boolean }) {
  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <Link href={`/cas-clients/${c.slug}`} tabIndex={-1} aria-hidden className="block">
          <CaseVisual slug={c.slug} size="lg" />
        </Link>
      </div>
      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <div className="flex items-center gap-4">
          <ClientMark c={c} size="md" />
          <p className="t-kicker">{c.sector}</p>
        </div>
        <h2 className="t-h2 mt-6 text-[clamp(1.8rem,1.3rem+1.6vw,2.6rem)]">{c.client}</h2>
        <p className="t-lead mt-4">{c.headline}</p>
        <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
          {c.stats.map((st) => (
            <li key={st.label}>
              <p className="whitespace-nowrap font-display text-[40px] font-extrabold leading-none tracking-[-0.025em] text-night">{st.value}</p>
              <p className="mt-2 max-w-[14rem] text-[14px] leading-[1.4] text-ink">{st.label}</p>
            </li>
          ))}
        </ul>
        <Link href={`/cas-clients/${c.slug}`} className="group mt-9 inline-flex min-h-11 items-center gap-3 text-[15px] font-semibold text-night">
          {casesIndex.read}
          <span className="sr-only"> {c.client}</span>
          <span className="inline-flex size-10 items-center justify-center rounded-full border border-powder transition-colors duration-200 group-hover:border-night group-hover:bg-night group-hover:text-white">
            <Arrow />
          </span>
        </Link>
      </div>
    </article>
  );
}
