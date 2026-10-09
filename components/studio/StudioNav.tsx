"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/studio", label: "QG" },
  { href: "/studio/departements/prospection", label: "Prospection" },
  { href: "/studio/agents/alma", label: "Manager" },
];

export function StudioNav() {
  const path = usePathname();
  return (
    <nav aria-label="Studio" className="hidden items-center gap-1 sm:flex">
      {LINKS.map((l) => {
        const on = l.href === "/studio" ? path === "/studio" : path.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} aria-current={on ? "page" : undefined} className={`min-h-11 rounded-full px-4 py-2.5 text-[14px] font-medium ${on ? "bg-mist text-night" : "text-ink hover:text-night"}`}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
