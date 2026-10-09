import Link from "next/link";
import type { ReactNode } from "react";
import { manager } from "@/lib/studio/agents";
import type { StudioStats } from "@/lib/studio/data";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { ArrowRightIcon, ChatIcon, ChevronDownIcon } from "./icons";
import { count, plural } from "./format";

const NBSP = " ";

export type AlmaPriority = {
  tone: "setup" | "error" | "urgent" | "focus" | "calm";
  /** Étiquette courte, lisible d’un coup d’œil. */
  label: string;
  headline: ReactNode;
  detail?: ReactNode;
  /** Marche à suivre détaillée, repliée sous « Comment brancher » (mise en route). */
  howTo?: ReactNode;
};

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.88em] text-white [overflow-wrap:anywhere]">{children}</code>;
}

/**
 * La priorité du jour, par des règles simples et honnêtes, à partir des seules données réelles.
 * Alma n’est pas encore entraînée : ce n’est pas elle qui « pense » ni qui parle. Les titres sont donc
 * écrits de façon neutre (jamais « je… »), et la carte le dit.
 * Les comptes portent sur toutes les demandes des 7 derniers jours, sans regarder leur statut :
 * on dit « reçues », jamais « en attente ». (Plus tard : compter seulement status = "nouveau".)
 */
export function almaPriority(stats: Pick<StudioStats, "connected" | "error" | "rappelsWeek" | "auditsWeek">): AlmaPriority {
  if (!stats.connected) {
    return {
      tone: "setup",
      label: "Mise en route",
      headline: "Les demandes du site ne sont pas encore branchées.",
      detail: "Première étape\u00a0: connecter Supabase dans Vercel.",
      howTo: (
        <>
          Dans Vercel, ajoute <Code>SUPABASE_URL</Code> et <Code>SUPABASE_SERVICE_ROLE_KEY</Code> aux variables d’environnement du projet, puis redéploie. La
          table <Code>leads</Code> se crée avec la migration du dossier <Code>supabase/migrations</Code>.
        </>
      ),
    };
  }
  if (stats.error) {
    return {
      tone: "error",
      label: "Lecture impossible",
      headline: "Lecture des demandes du site impossible pour le moment.",
      detail: (
        <>
          Supabase est bien configuré, mais la lecture a échoué. Vérifie la clé et la table <Code>leads</Code>, puis recharge la page.
        </>
      ),
    };
  }

  const rappels = stats.rappelsWeek ?? 0;
  const audits = stats.auditsWeek ?? 0;

  if (rappels > 0) {
    const promise = `Le site promet un rappel sous 24${NBSP}h.`;
    return {
      tone: "urgent",
      label: rappels > 1 ? "Demandes de rappel reçues" : "Demande de rappel reçue",
      headline: `${count(rappels, "demande")} de rappel sur 7${NBSP}jours${NBSP}: rappelle-${rappels > 1 ? "les" : "la"} en priorité.`,
      detail: audits > 0 ? `${promise} Ensuite${NBSP}: ${count(audits, "audit")} ${plural(audits, "reçu", "reçus")}.` : promise,
    };
  }
  if (audits > 0) {
    return audits === 1
      ? {
          tone: "focus",
          label: "Audit reçu",
          headline: `1${NBSP}audit reçu sur 7${NBSP}jours${NBSP}: appelle ce dirigeant en premier.`,
          detail: "Nina préparera les fiches d’appel une fois entraînée. Pour l’instant, la demande t’attend plus bas, dans les demandes entrantes.",
        }
      : {
          tone: "focus",
          label: "Audits reçus",
          headline: `${audits}${NBSP}audits reçus sur 7${NBSP}jours${NBSP}: appelle d’abord les plus urgents.`,
          detail: `Commence par les échéances «${NBSP}Dès que possible${NBSP}». Nina préparera les fiches d’appel une fois entraînée.`,
        };
  }
  return {
    tone: "calm",
    label: "Journée de prospection",
    headline: `Aucune demande sur 7${NBSP}jours${NBSP}: 10${NBSP}emails de prospection aujourd’hui.`,
    detail: `Léo et Inès s’en chargeront une fois entraînés. En attendant, c’est toi qui écris.`,
  };
}

const toneDot: Record<AlmaPriority["tone"], string> = {
  setup: "bg-powder",
  error: "bg-[#F2C48D]",
  urgent: "bg-white",
  focus: "bg-powder",
  calm: "bg-[#9FD3B5]",
};

/** Les sources d’Alma et leur état réel. Une seule est branchable à l’étape 1 : les demandes du site. */
function sources(stats: StudioStats) {
  return [
    {
      name: "Demandes du site",
      on: stats.connected && !stats.error,
      state: !stats.connected ? "Pas encore branchées" : stats.error ? "Lecture impossible" : "Branchées (Supabase)",
    },
    { name: "Résultats de l’équipe", on: false, state: "Après l’entraînement des agents" },
    { name: "Agenda", on: false, state: "Pas encore branché" },
  ];
}

/** Focus visible sur fond bleu nuit (le contour global est bleu nuit, donc invisible ici). */
const focusOnDark = "focus-visible:outline-white! focus-visible:rounded-full!";

/**
 * « Priorité du jour » : la grande carte bleu nuit en haut du QG. Alma (avatar, nom, rôle) y figure
 * comme future propriétaire de la carte et lien vers sa fiche, pas comme autrice du texte.
 */
export function AlmaBrief({ stats }: { stats: StudioStats }) {
  const alma = manager;
  const p = almaPriority(stats);

  return (
    <section
      aria-labelledby="priorite-jour"
      className="hero-in relative overflow-hidden rounded-[28px] bg-night p-5 text-white shadow-[0_24px_60px_-32px_rgba(23,38,61,0.6)] sm:p-8 lg:p-10"
      style={{ animationDelay: "60ms" }}
    >
      {/* Trame de points très discrète, qui s’efface vers la gauche */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-2/3"
        style={{
          backgroundImage: "radial-gradient(rgb(255 255 255 / 0.1) 1px, transparent 1.3px)",
          backgroundSize: "18px 18px",
          maskImage: "linear-gradient(to left, #000 15%, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to left, #000 15%, transparent 85%)",
        }}
      />

      <div className="relative flex flex-col gap-6 md:flex-row md:gap-10">
        <div className="flex items-center gap-4 md:w-52 md:shrink-0 md:flex-col md:items-start">
          <span aria-hidden className="shrink-0 rounded-full bg-white/10 p-1.5">
            <AgentAvatar agent={{ name: alma.name, avatar: alma.avatar }} size={88} animated />
          </span>
          <div className="min-w-0">
            <h2 id="priorite-jour" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-powder">
              Priorité du jour
            </h2>
            <p className="mt-1.5 font-display text-[24px] font-bold leading-tight tracking-[-0.02em] text-white">{alma.name}</p>
            <p className="mt-0.5 text-[14px] leading-[1.4] text-white/70">{alma.role}</p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-white">
            <span aria-hidden className={`size-1.5 rounded-full ${toneDot[p.tone]}`} />
            {p.label}
          </p>
          <p className="mt-4 max-w-[36ch] font-display text-[22px] font-semibold leading-[1.25] tracking-[-0.02em] text-balance text-white sm:text-[28px]">
            {p.headline}
          </p>
          {p.detail && <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.6] text-white/75 text-pretty">{p.detail}</p>}
          {p.howTo && (
            <details className="group/how mt-2 max-w-[62ch]">
              <summary
                className={`-mx-3 inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full px-3 text-[14px] font-semibold text-white hover:bg-white/10 [&::-webkit-details-marker]:hidden ${focusOnDark}`}
              >
                Comment brancher
                <ChevronDownIcon className="size-4 text-powder transition-transform duration-200 ease-luma group-open/how:rotate-180 motion-reduce:transition-none" />
              </summary>
              <p className="mt-1 text-[14px] leading-[1.6] text-white/75 text-pretty">{p.howTo}</p>
            </details>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`/studio/agents/${alma.id}`}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-[15px] font-semibold text-night transition-colors duration-200 hover:bg-mist motion-reduce:transition-none ${focusOnDark}`}
            >
              Ouvrir la fiche d’Alma
              <ArrowRightIcon />
            </Link>
            <Link
              href={`/studio/agents/${alma.id}#discussion`}
              aria-label={`Discuter avec ${alma.name}, disponible à l’étape 2`}
              className={`inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-white/25 px-5 text-[15px] font-semibold text-white transition-colors duration-200 hover:border-white/45 hover:bg-white/10 motion-reduce:transition-none ${focusOnDark}`}
            >
              <ChatIcon />
              Discuter avec {alma.name}
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-powder">Étape 2</span>
            </Link>
          </div>

          {/* Mention d’honnêteté : toujours visible, plus courte sur mobile. */}
          <p className="mt-6 max-w-[62ch] border-t border-white/10 pt-4 text-[13px] leading-[1.55] text-white/60">
            <span className="sm:hidden">{alma.name} n’est pas encore entraînée&nbsp;: ce point suit des règles simples.</span>
            <span className="hidden sm:inline">
              Point calculé par des règles simples à partir des demandes du site. {alma.name} n’est pas encore entraînée&nbsp;: la discussion avec elle arrive à
              l’étape 2 (branchement à Claude).
            </span>
          </p>
        </div>

        {/* Les sources de la carte et leur état réel : seule la source Supabase peut être branchée à l’étape 1. */}
        <aside aria-labelledby="sources-alma" className="hidden xl:block xl:w-60 xl:shrink-0 xl:border-l xl:border-white/10 xl:pl-8">
          <h3 id="sources-alma" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-powder">
            Sources de données
          </h3>
          <ul className="mt-4 space-y-4">
            {sources(stats).map((s) => (
              <li key={s.name}>
                <p className="text-[14px] font-semibold text-white">{s.name}</p>
                <p className="mt-1 flex items-center gap-2 text-[13px] text-white/70">
                  <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${s.on ? "bg-[#9FD3B5]" : "bg-white/30"}`} />
                  {s.state}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
