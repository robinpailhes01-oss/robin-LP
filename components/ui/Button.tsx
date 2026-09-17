import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center rounded-full px-6 h-12 text-[15px] font-medium tracking-[-0.01em] transition-[background-color,color,transform] duration-200 ease-[var(--ease-luma)] active:scale-[0.98] whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-[#2a4fe0]",
  secondary: "bg-ink text-surface hover:bg-[#2a2b2f]",
  ghost: "bg-transparent text-ink border border-surface-alt hover:border-ink",
};

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };
type LinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({ variant = "primary", className = "", ...props }: LinkProps) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
