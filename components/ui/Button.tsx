import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * primary : fond bleu nuit, texte blanc.
 * secondary : fond blanc, bordure discrète, texte bleu nuit.
 * onDark : fond blanc sur une surface bleu nuit.
 */
type Variant = "primary" | "secondary" | "onDark";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 min-h-12 text-[15px] font-semibold tracking-[-0.005em] transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-luma)] active:translate-y-px whitespace-nowrap focus-visible:outline-offset-4 disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-night text-white hover:bg-night-hover",
  secondary: "bg-white text-night border border-powder hover:border-night/40 hover:bg-paper",
  onDark: "bg-white text-night hover:bg-mist",
};

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={`transition-transform duration-200 ease-[var(--ease-luma)] group-hover:translate-x-0.5 ${className}`}>
      <path d="M3 8h10M8.5 3.5L13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-200 ease-[var(--ease-luma)] group-hover:translate-y-0.5">
      <path d="M8 3v10M3.5 8.5L8 13l4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; children?: ReactNode };
type LinkProps = ComponentProps<typeof Link> & { variant?: Variant; children?: ReactNode };

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={`group ${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({ variant = "primary", className = "", ...props }: LinkProps) {
  return <Link className={`group ${base} ${variants[variant]} ${className}`} {...props} />;
}

/** Lien texte avec flèche, pour les actions tertiaires. */
export function TextLink({ className = "", children, ...props }: LinkProps) {
  return (
    <Link className={`group inline-flex items-center gap-2 min-h-11 text-[15px] font-semibold text-night underline decoration-powder decoration-2 underline-offset-[6px] hover:decoration-night transition-[text-decoration-color] ${className}`} {...props}>
      {children}
      <Arrow />
    </Link>
  );
}
