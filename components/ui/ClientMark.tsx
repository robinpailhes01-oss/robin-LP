import Image from "next/image";
import type { CaseStudy } from "@/lib/content";

const sizes = {
  sm: { tile: "h-9 px-2", img: "h-6", initials: "size-9 text-[12px]" },
  md: { tile: "h-11 px-2.5", img: "h-7", initials: "size-11 text-[13px]" },
  lg: { tile: "h-14 px-3.5", img: "h-9", initials: "size-14 text-[16px]" },
} as const;

/** Marque du client : son logo sur une tuile blanche, ou ses initiales si aucun logo n’est fourni. */
export function ClientMark({ c, size = "md", className = "" }: { c: Pick<CaseStudy, "client" | "initials" | "logo">; size?: keyof typeof sizes; className?: string }) {
  const sz = sizes[size];
  if (c.logo) {
    return (
      <span className={`inline-flex items-center justify-center rounded-xl bg-white border border-line ${sz.tile} ${className}`}>
        <Image src={c.logo} alt={`Logo ${c.client}`} width={200} height={100} className={`${sz.img} w-auto object-contain`} />
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center justify-center rounded-xl bg-navy text-white font-bold ${sz.initials} ${className}`} aria-label={c.client}>
      {c.initials}
    </span>
  );
}

/** Variables CSS d’accent d’un cas, à poser en style sur le conteneur. */
export function caseVars(c: Pick<CaseStudy, "accent" | "accentInk">): React.CSSProperties {
  return { ["--case-accent" as string]: c.accent ?? "#8f7dff", ["--case-ink" as string]: c.accentInk ?? "#4636f0" };
}
