import Link from "next/link";
import type { ReactNode } from "react";
import { manager } from "@/lib/studio/agents";
import type { StudioStats } from "@/lib/studio/data";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { ArrowRightIcon, ChatIcon } from "./icons";
import { count, plural } from "./format";

const NBSP = " ";

export type AlmaPriority = {
  tone: "setup" | "error" | "urgent" | "focus" | "calm";
  /** Étiquette courte, lisible d’un coup d’œil. */
  label: string;
  headline: ReactNode;
  detail?: ReactNode;
};

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.88em] text-white [overflow-wrap:anywhere]">{children}</code>;
}

/**
 * La priorité du jour, par des règles simples et honnêtes, à partir des seules données réelles.
 * Alma n’est pas encore entraînée : ce n’est pas elle qui « pense », et la carte le dit.
 */
export function almaPriority(stats: Pick<StudioStats, "connected" | "error" | "rappelsWeek" | "auditsWeek">): AlmaPriority {
  if (!stats.connected) {
    return {
      tone: "setup",
      label: "Mise en route",
      headline: "Je ne vois pas encore les demandes du site.",
      detail: (
        <>
          Première étape&nbsp;: connecter Supabase (<Code>SUPABASE_URL</Code> et <Code>SUPABASE_SERVICE_ROLE_KEY</Code> dans Vercel).
        </>
      ),
    };
  }
  if (stats.error) {
    return {
      tone: "error",
      label: "Lecture impossible",
      headline: "Je n’arrive pas à lire les demandes du site en ce moment.",
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
    return {
      tone: "urgent",
      label: rappels > 1 ? "Rappels en attente" : "Rappel en attente",
      headline: `${count(rappels, "demande")} de rappel sur 7${NBSP}jours${NBSP}: c’est ta priorité, rappelle avant midi.`,
      detail: audits > 0 ? `Ensuite${NBSP}: ${count(audits, "audit")} ${plural(audits, "reçu", "reçus")} à traiter.` : undefined,
    };
  }
  if (audits > 0) {
    return audits === 1
      ? {
          tone: "focus",
          label: "Audit à traiter",
          headline: `1${NBSP}audit reçu sur 7${NBSP}jours${NBSP}: appelle ce dirigeant en premier.`,
          detail: "Nina préparera les fiches d’appel une fois entraînée. Pour l’instant, retrouve sa demande juste en dessous.",
        }
      : {
          tone: "focus",
          label: "Audits à traiter",
          headline: `${audits}${NBSP}audits reçus sur 7${NBSP}jours${NBSP}: appelle d’abord les plus urgents.`,
          detail: `Commence par les échéances «${NBSP}Dès que possible${NBSP}». Nina préparera les fiches d’appel une fois entraînée.`,
        };
  }
  return {
    tone: "calm",
    label: "Journée de prospection",
    headline: `Aucune demande sur 7${NBSP}jours. Priorité du jour${NBSP}: 10${NBSP}emails de prospection.`,
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

/** Focus visible sur fond bleu nuit (le contour global est bleu nuit, donc invisible ici). */
const focusOnDark = "focus-visible:outline-white! focus-visible:rounded-full!";

/** « Le point d’Alma » : la grande carte bleu nuit en haut du QG. */
export function AlmaBrief({ stats }: { stats: StudioStats }) {
  const alma = manager;
  const p = almaPriority(stats);

  return (
    <section
      aria-labelledby="point-alma"
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
          <span className="shrink-0 rounded-full bg-white/10 p-1.5">
            <AgentAvatar agent={{ name: alma.name, avatar: alma.avatar }} size={88} animated />
          </span>
          <div className="min-w-0">
            <h2 id="point-alma" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-powder">
              Le point d’Alma
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
              className={`inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-white/25 px-5 text-[15px] font-semibold text-white transition-colors duration-200 hover:border-white/45 hover:bg-white/10 motion-reduce:transition-none ${focusOnDark}`}
            >
              <ChatIcon />
              Discuter avec Alma
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-powder">Bientôt</span>
            </Link>
          </div>

          <p className="mt-6 max-w-[62ch] border-t border-white/10 pt-4 text-[13px] leading-[1.55] text-white/60">
            Point calculé par des règles simples à partir des demandes du site. Alma n’est pas encore entraînée&nbsp;: la discussion avec elle arrive bientôt.
          </p>
        </div>
      </div>
    </section>
  );
}
