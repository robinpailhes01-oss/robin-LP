import { agents, departments, type AgentStatus } from "@/lib/studio/agents";
import { PortraitBusts } from "@/components/studio/PortraitBusts";
import { FadeIn } from "@/components/studio/fx/FadeIn";
import { SplitTitle } from "@/components/studio/fx/SplitTitle";
import { LiveDot } from "@/components/studio/fx/LiveDot";
import { DEPT_GLOW, GLACIER, deptGlow } from "@/components/studio/fx/tokens";
import { count, parisIsoDate, parisLongDate, plural } from "./format";

const NBSP = " ";

/** « 5 à entraîner », « 2 prêts », « 1 actif » : l’état réel de l’équipe, d’après les fiches. */
const STATUS_ORDER: AgentStatus[] = ["actif", "pret", "a-entrainer"];
function statusWord(status: AgentStatus, n: number) {
  if (status === "a-entrainer") return "à entraîner";
  if (status === "pret") return plural(n, "prêt", "prêts");
  return plural(n, "actif", "actifs");
}

/**
 * En-tête du QG : date du jour (Paris), « Bonjour Robin » en très grand, la taille de l’équipe
 * calculée depuis les fiches, et l’équipe en bustes qui se chevauchent, dans leur halo (immobiles :
 * le seul grand portrait qui flotte sur cet écran est celui d’Alma, juste dessous).
 * Sous 640 px, la ligne d’équipe passe en puces (pas de séparateur « · » orphelin en bout de ligne).
 * Entrées à l’affichage (CSS, sans attendre le JavaScript).
 */
export function HqHero({ now }: { now: number }) {
  const today = new Date(now);
  const open = departments.filter((d) => d.open).length;
  const toOpen = departments.length - open;
  const byStatus = STATUS_ORDER.map((s) => ({ status: s, n: agents.filter((a) => a.status === s).length })).filter((x) => x.n > 0);
  const segment = "max-sm:rounded-full max-sm:border max-sm:border-white/10 max-sm:bg-[rgb(202_223_237/0.05)] max-sm:px-3 max-sm:py-1 max-sm:text-[14px]";

  return (
    <header className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
      <div className="min-w-0">
        <FadeIn y={10} duration={0.7}>
          <p className="studio-kicker flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-linear-to-r from-transparent to-[#9CC3FF]" />
            <time dateTime={parisIsoDate(today)}>{parisLongDate(today)}</time>
          </p>
        </FadeIn>
        {/* Mouvement signature : chaque mot monte de sous sa ligne (SplitTitle). pb : place pour la jambe du « j ». */}
        <SplitTitle text="Bonjour Robin" gradient delay={0.1} className="studio-display mt-5 pb-[0.12em]" />
        {/* Chaque segment reste d’un bloc : la ligne ne se coupe qu’aux séparateurs (en puces sous 640 px). */}
        <FadeIn as="p" delay={0.32} y={10} className="studio-lead mt-3 flex max-w-[52ch] flex-wrap gap-2 sm:block">
          <span className={`whitespace-nowrap ${segment}`}>
            Ton équipe{NBSP}: <span className="font-semibold text-white">{count(agents.length, "agent")}</span>
          </span>
          <span aria-hidden className="mx-2 hidden text-white/30 sm:inline">
            ·
          </span>
          <span className="sr-only">, </span>{" "}
          <span className={`whitespace-nowrap ${segment}`}>{count(open, "département ouvert", "départements ouverts")}</span>
          <span aria-hidden className="mx-2 hidden text-white/30 sm:inline">
            ·
          </span>
          <span className="sr-only">, </span>{" "}
          <span className={`whitespace-nowrap ${segment}`}>
            {toOpen}
            {NBSP}à ouvrir
          </span>
        </FadeIn>
      </div>

      <div className="relative w-fit">
        {/* Halo de l’équipe (bleu électrique, cœur glacier côté Alma), contenu dans la gouttière : jamais de débordement horizontal. */}
        <span aria-hidden className="studio-halo absolute -inset-x-4 -inset-y-12 opacity-75 [--halo:#4C8DFF]" />
        <span aria-hidden className="studio-halo absolute -left-4 top-[30%] size-40 -translate-y-1/2 opacity-60 sm:size-48 [--halo:#9CC3FF]" />

        {/* Les visages, décoratifs : la ligne « Ton équipe » le dit déjà en texte. */}
        {/* Chaque buste monte de sous sa ligne, en cascade (CSS, studio-bust). */}
        <PortraitBusts people={agents} colorOf={(a) => deptGlow(a.department)} size="sm" delay={0.22} className="relative" />

        <FadeIn delay={0.6} y={8} className="relative mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-white/70">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-full" style={{ background: GLACIER, boxShadow: `0 0 8px ${GLACIER}` }} />
            Direction
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-full" style={{ background: DEPT_GLOW.prospection, boxShadow: `0 0 8px ${DEPT_GLOW.prospection}` }} />
            Prospection
          </span>
          {byStatus.map(({ status, n }) => (
            <span key={status} className="inline-flex items-center gap-2 font-semibold text-white/85">
              <LiveDot status={status} size={6} />
              {n}
              {NBSP}
              {statusWord(status, n)}
            </span>
          ))}
        </FadeIn>
      </div>
    </header>
  );
}
