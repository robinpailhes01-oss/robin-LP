"use client";

import { LayoutGroup, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";

type Section = "qg" | "prospection" | "direction";

const LINKS: { href: string; label: string; section: Section }[] = [
  { href: "/studio", label: "QG", section: "qg" },
  { href: "/studio/departements/prospection", label: "Prospection", section: "prospection" },
  { href: "/studio/departements/direction", label: "Direction", section: "direction" },
];

/** Rubrique active : le département d’un agent vient de `agentDept` (calculé côté serveur depuis agents.ts). */
function activeSection(path: string, agentDept: Record<string, string>): Section | null {
  if (path === "/studio") return "qg";
  const deptId = /^\/studio\/departements\/([^/]+)/.exec(path)?.[1];
  const agentId = /^\/studio\/agents\/([^/]+)/.exec(path)?.[1];
  const dept = deptId ?? (agentId && Object.hasOwn(agentDept, agentId) ? agentDept[agentId] : undefined);
  if (dept === "prospection") return "prospection";
  // Même nom partout (menu, fil d’Ariane, titre, pièce du QG) : la fiche d’Alma relève aussi de « Direction ».
  if (dept === "direction") return "direction";
  return null;
}

/**
 * Menu du studio, dans la barre du haut à toutes les tailles (pilules compactes sous 640 px, cibles de 44 px).
 * La pastille de la rubrique active glisse d’un lien à l’autre (layoutId de motion) ;
 * en mouvement réduit, elle change de place sans glisser.
 */
export function StudioNav({ agentDept, className = "" }: { agentDept: Record<string, string>; className?: string }) {
  const path = usePathname();
  const active = activeSection(path, agentDept);
  const group = useId();
  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id={group}>
        <nav aria-label="Studio" className={className}>
          {LINKS.map((l) => {
            const on = active === l.section;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={on ? (path === l.href ? "page" : "true") : undefined}
                className={`relative inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-2.5 text-[13px] font-medium transition-colors duration-200 sm:px-4 sm:text-[14px] ${
                  on ? "text-white" : "text-white/65 hover:text-white"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="studio-nav-pill"
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-white/12 bg-white/[0.08] shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_6px_20px_-8px_rgb(76_141_255/0.55)]"
                    transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.8 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </nav>
      </LayoutGroup>
    </MotionConfig>
  );
}
