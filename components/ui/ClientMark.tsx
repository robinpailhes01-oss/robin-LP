import Image from "next/image";
import type { CaseStudy } from "@/lib/content";

const sizes = {
  sm: { tile: "h-10 px-2.5", img: "h-6", initials: "size-10 text-[12px]" },
  md: { tile: "h-12 px-3", img: "h-7", initials: "size-12 text-[13px]" },
  lg: { tile: "h-16 px-4", img: "h-10", initials: "size-16 text-[16px]" },
} as const;

/** Marque du client : son logo sur fond blanc, ou ses initiales si aucun logo n’a été fourni. */
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
    <span role="img" className={`inline-flex items-center justify-center rounded-xl bg-mist text-night font-display font-bold ${sz.initials} ${className}`} aria-label={c.client}>
      {c.initials}
    </span>
  );
}
