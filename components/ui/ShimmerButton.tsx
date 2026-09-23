/* Adapté du « Shimmer Button » de Magic UI (dillionverma, 21st.dev). Keyframes dans globals.css. */

import type { CSSProperties, ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function ShimmerButton({ className, children, ...props }: ComponentProps<"button">) {
  return (
    <button
      style={{ "--spread": "90deg", "--shimmer-color": "#ffffff", "--speed": "3s", "--cut": "0.06em", "--bg": "var(--color-violet)" } as CSSProperties}
      className={cn(
        "group relative z-0 inline-flex h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-white/10 px-6 text-[15px] font-semibold tracking-[-0.01em] text-white [background:var(--bg)]",
        "shadow-[0_10px_24px_-12px_rgba(70,54,240,0.7)] transform-gpu transition-transform duration-300 ease-out active:translate-y-px",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="absolute inset-0 -z-30 overflow-visible blur-[2px] [container-type:size]">
        <span className="shimmer-slide absolute inset-0 aspect-square h-[100cqh]">
          <span className="spin-around absolute -inset-full w-auto [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </span>
      </span>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      <span aria-hidden className="absolute inset-0 rounded-full shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]" />
      <span aria-hidden className="absolute -z-20 rounded-full [background:var(--bg)] [inset:var(--cut)]" />
    </button>
  );
}
