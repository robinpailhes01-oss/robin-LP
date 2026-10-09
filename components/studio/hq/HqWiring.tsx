import type { CSSProperties } from "react";
import type { StudioStats } from "@/lib/studio/data";
import { CountUp } from "@/components/studio/fx/CountUp";
import { FadeIn } from "@/components/studio/fx/FadeIn";
import { OrbitRing } from "@/components/studio/fx/OrbitRing";
import { DEPT_GLOW, GLACIER, TONE_COLOR } from "@/components/studio/fx/tokens";
import { AlertIcon, ChevronDownIcon, PlugIcon } from "./icons";
import { almaPriority } from "./priority";

const NBSP = " ";

/**
 * Module « Branchement » du QG : remplace les tuiles d’indicateurs et le panneau des demandes tant qu’aucune
 * valeur réelle n’est lisible (Supabase pas branché, ou lecture en échec). Un seul module au lieu de quatre tuiles vides
 * et d’un grand panneau vide : pas d’effet « squelette de chargement ».
 *
 * À gauche : la prise en orbite (le seul anneau d’orbite de l’écran), l’état, et la marche à suivre, ouverte d’emblée (repliable)
 * (almaPriority().howTo, la même que celle annoncée par la carte d’Alma). À droite : les quatre indicateurs
 * en lignes fines séparées par des filets (libellé, « 7 j », trait fin « — », raison), sans encadré.
 * Composant serveur ; aucune donnée de demande n’est lue ni rendue ici.
 */
type Row = { key: string; label: string; about: string; reason: string };

export function HqWiring({ stats }: { stats: StudioStats }) {
  const failed = stats.connected && stats.error;
  const p = almaPriority(stats);
  const tone = failed ? TONE_COLOR.error : GLACIER;
  const wait = failed ? "lecture impossible pour l’instant" : "en attente de Supabase";

  const rows: Row[] = [
    { key: "leads", label: "Demandes", about: "Audits, rappels et messages du site", reason: wait },
    { key: "audits", label: "Audits", about: "Mini-audits complétés", reason: wait },
    { key: "rappels", label: "Rappels", about: "Demandes de rappel", reason: wait },
    { key: "drafts", label: "Brouillons", about: "Emails préparés par Inès", reason: "branché quand elle sera entraînée" },
  ];

  return (
    <FadeIn
      as="section"
      trigger="inView"
      y={18}
      id="demandes"
      aria-labelledby="branchement-titre"
      className="studio-glass relative scroll-mt-32 overflow-hidden rounded-[28px] sm:scroll-mt-24"
    >
      {/* Décor : lumière bleu électrique côté prise, trame de points qui s’efface vers la droite. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <span className="studio-halo absolute -left-32 -top-40 size-[28rem] opacity-50" style={{ "--halo": failed ? TONE_COLOR.error : DEPT_GLOW.prospection } as CSSProperties} />
        <span className="studio-dots absolute inset-y-0 right-0 w-2/3 opacity-60 [mask-image:linear-gradient(to_left,#000_10%,transparent_85%)]" />
      </span>

      <div className="relative grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* État et marche à suivre */}
        <div className="flex min-w-0 flex-col items-start justify-center px-5 pb-7 pt-8 sm:px-8 sm:pb-8 sm:pt-10 lg:p-10">
          <span className="relative ml-3 mt-3 inline-flex">
            <span
              aria-hidden
              className="relative inline-flex size-14 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]"
              style={{ color: tone }}
            >
              {failed ? <AlertIcon /> : <PlugIcon />}
            </span>
            <OrbitRing color={tone} rings={1} inset="-34%" speed={1.4} />
          </span>

          <p className="studio-kicker mt-9">Branchement</p>
          <h3 id="branchement-titre" className="mt-2 font-display text-[26px] font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-[30px]">
            {failed ? "Lecture impossible" : "Pas encore branché"}
          </h3>
          <p className="studio-body mt-3 max-w-[46ch]">
            {failed
              ? "Supabase est configuré, mais la lecture des demandes a échoué. Les indicateurs et les demandes reviendront dès qu’elle réussira."
              : `Les demandes du site et les indicateurs des 7${NBSP}derniers jours apparaîtront ici dès que Supabase sera connecté.`}
          </p>

          {p.howTo ? (
            <details open className="group/how mt-4 w-full max-w-[60ch]">
              <summary className="-mx-3 inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full px-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-white/[0.06] motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
                Comment brancher
                <ChevronDownIcon className="size-4 text-[#CADFED] transition-transform duration-300 group-open/how:rotate-180 motion-reduce:transition-none" />
              </summary>
              <p className="mt-2 rounded-[14px] border border-white/[0.08] bg-[rgb(6_11_22/0.4)] p-4 text-[14px] leading-[1.65] text-white/75 text-pretty">{p.howTo}</p>
            </details>
          ) : p.detail ? (
            <p className="mt-4 max-w-[60ch] text-[14px] leading-[1.6] text-white/70 text-pretty">{p.detail}</p>
          ) : null}
        </div>

        {/* Les quatre indicateurs, éteints : lignes fines, aucune boîte. */}
        <div className="min-w-0 border-t border-white/[0.08] px-5 pb-6 pt-6 sm:px-8 sm:pb-8 lg:border-l lg:border-t-0 lg:p-10">
          <h4 id="indicateurs" className="studio-kicker">
            Indicateurs · 7{NBSP}derniers jours
          </h4>
          <ul aria-labelledby="indicateurs" className="mt-3 divide-y divide-white/[0.07] border-b border-white/[0.07] lg:mt-4">
            {rows.map((r) => (
              <li key={r.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 py-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2.5 text-[15px] font-semibold leading-[1.3] text-white">
                    <PlugIcon className="size-4 shrink-0 text-white/50" />
                    {r.label}
                    <span aria-hidden className="rounded-full border border-white/[0.1] px-1.5 py-px text-[10.5px] font-semibold text-white/62">
                      7{NBSP}j
                    </span>
                  </p>
                  <p className="mt-1 pl-[26px] text-[12.5px] leading-[1.45] text-white/62 text-pretty">
                    {r.about} · {r.reason}
                  </p>
                </div>
                <p className="font-display text-[32px] font-extrabold leading-none tracking-[-0.04em]">
                  <CountUp value={null} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FadeIn>
  );
}
