import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "light" | "white" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 h-12 text-[15px] font-semibold tracking-[-0.01em] transition-[background-color,color,transform,box-shadow] duration-200 ease-[var(--ease-luma)] active:scale-[0.98] whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-violet text-white hover:bg-violet-dark shadow-[0_10px_24px_-12px_rgba(70,54,240,0.7)]",
  light: "bg-white text-navy border border-line hover:border-navy/30",
  white: "bg-white text-navy hover:bg-[#f1f0ff]",
  ghost: "bg-transparent text-navy hover:bg-card",
};

export function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10M8.5 3.5L13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <span className="inline-flex size-7 items-center justify-center rounded-full bg-violet text-white" aria-hidden>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
        <path d="M2 1.5v7l6-3.5-6-3.5z" />
      </svg>
    </span>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; children?: ReactNode };
type LinkProps = ComponentProps<typeof Link> & { variant?: Variant; children?: ReactNode };

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({ variant = "primary", className = "", ...props }: LinkProps) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
