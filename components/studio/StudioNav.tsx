"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Section = "qg" | "prospection" | "manager";

const LINKS: { href: string; label: string; section: Section }[] = [
  { href: "/studio", label: "QG", section: "qg" },
  { href: "/studio/departements/prospection", label: "Prospection", section: "prospection" },
  { href: "/studio/agents/alma", label: "Manager", section: "manager" },
];

/** Rubrique active : le département d’un agent vient de `agentDept` (calculé côté serveur depuis agents.ts). */
function activeSection(path: string, agentDept: Record<string, string>): Section | null {
  if (path === "/studio") return "qg";
  const deptId = /^\/studio\/departements\/([^/]+)/.exec(path)?.[1];
  const agentId = /^\/studio\/agents\/([^/]+)/.exec(path)?.[1];
  const dept = deptId ?? (agentId && Object.hasOwn(agentDept, agentId) ? agentDept[agentId] : undefined);
  if (dept === "prospection") return "prospection";
  // La direction n’a qu’un agent, la manager : sa page département relève aussi de « Manager ».
  if (dept === "direction") return "manager";
  return null;
}

/**
 * Menu du studio. Deux instances dans l’en-tête : une dans la barre du haut (à partir de sm),
 * une en rangée dessous sur mobile. Une seule est visible (et donc présente pour les lecteurs d’écran) à la fois.
 */
export function StudioNav({ agentDept, className = "" }: { agentDept: Record<string, string>; className?: string }) {
  const path = usePathname();
  const active = activeSection(path, agentDept);
  return (
    <nav aria-label="Studio" className={className}>
      {LINKS.map((l) => {
        const on = active === l.section;
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={on ? (path === l.href ? "page" : "true") : undefined}
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-[14px] font-medium ${on ? "bg-mist text-night" : "text-ink hover:text-night"}`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
