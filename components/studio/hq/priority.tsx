import type { ReactNode } from "react";
import type { StudioStats } from "@/lib/studio/data";
import type { LiveTone } from "@/components/studio/fx/tokens";
import { count, plural } from "./format";

const NBSP = " ";

export type AlmaPriority = {
  tone: "setup" | "error" | "urgent" | "focus" | "calm";
  /** Étiquette courte, lisible d’un coup d’œil. */
  label: string;
  /** Texte brut : il est saisi lettre à lettre (TypeText). */
  headline: string;
  detail?: ReactNode;
  /** Marche à suivre détaillée, sous « Comment brancher » dans le module Branchement, ouverte d’emblée (mise en route). */
  howTo?: ReactNode;
};

/** Ton du point lumineux de l’étiquette. */
export const PRIORITY_TONE: Record<AlmaPriority["tone"], LiveTone> = {
  setup: "info",
  error: "error",
  urgent: "warn",
  focus: "live",
  calm: "ok",
};

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-white/10 bg-white/[0.07] px-1.5 py-0.5 font-mono text-[0.86em] text-white [overflow-wrap:anywhere]">{children}</code>
  );
}

/**
 * La priorité du jour, par des règles simples et honnêtes, à partir des seules données réelles.
 * Alma n’est pas encore entraînée : ce n’est pas elle qui « pense » ni qui parle. Les titres sont donc
 * écrits de façon neutre (jamais « je… »), et la carte le dit.
 * Les comptes portent sur toutes les demandes des 7 derniers jours, sans regarder leur statut :
 * on dit « reçues », jamais « en attente ». (Plus tard : compter seulement status = "nouveau".)
 */
export function almaPriority(stats: Pick<StudioStats, "connected" | "error" | "leadsWeek" | "rappelsWeek" | "auditsWeek">): AlmaPriority {
  if (!stats.connected) {
    return {
      tone: "setup",
      label: "Mise en route",
      headline: "Les demandes du site ne sont pas encore branchées.",
      detail: `Pour les brancher${NBSP}: connecter Supabase dans Vercel.`,
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
          detail: "Nina préparera les fiches d’appel une fois entraînée. En attendant, c’est toi qui appelles.",
        }
      : {
          tone: "focus",
          label: "Audits reçus",
          headline: `${audits}${NBSP}audits reçus sur 7${NBSP}jours${NBSP}: appelle d’abord les plus urgents.`,
          detail: `Commence par les échéances «${NBSP}Dès que possible${NBSP}». Nina préparera les fiches d’appel une fois entraînée.`,
        };
  }
  // Autres demandes (messages de l’assistant, demandes de l’ancien formulaire) : jamais « aucune demande » s’il y en a.
  const leads = stats.leadsWeek ?? 0;
  if (leads > 0) {
    return {
      tone: "focus",
      label: leads > 1 ? "Demandes reçues" : "Demande reçue",
      headline: `${count(leads, "demande")} ${plural(leads, "reçue", "reçues")} sur 7${NBSP}jours${NBSP}: ${leads > 1 ? "lis-les" : "lis-la"} dans les demandes entrantes.`,
      // Pas de « t’attendent » : les comptes ignorent le statut (voir plus haut). Ici, toutes les demandes de la fenêtre sont de ce type,
      // donc les plus récentes sont bien celles listées dans les demandes entrantes.
      detail: `Messages de l’assistant du site ou demandes de l’ancien formulaire${NBSP}: les plus récentes sont listées plus bas, dans les demandes entrantes.`,
    };
  }
  return {
    tone: "calm",
    label: "Journée de prospection",
    headline: `Aucune demande sur 7${NBSP}jours${NBSP}: 10${NBSP}emails de prospection aujourd’hui.`,
    detail: `Léo et Inès s’en chargeront une fois entraînés. En attendant, c’est toi qui écris.`,
  };
}

export type DataSource = { name: string; tone: LiveTone; state: string };

/** Les sources d’Alma et leur état réel. Une seule est branchable à l’étape 1 : les demandes du site. */
export function almaSources(stats: Pick<StudioStats, "connected" | "error">): DataSource[] {
  return [
    {
      name: "Demandes du site",
      tone: !stats.connected ? "idle" : stats.error ? "error" : "ok",
      state: !stats.connected ? "Pas encore branchées" : stats.error ? "Lecture impossible" : "Branchées (Supabase)",
    },
    { name: "Résultats de l’équipe", tone: "idle", state: "Après l’entraînement des agents" },
    { name: "Agenda", tone: "idle", state: "Pas encore branché" },
  ];
}
