/* Adapté du « Border Beam » de gooseui (21st.dev). Les keyframes et @property sont dans globals.css. */

import { cn } from "@/lib/utils";

export function BorderBeam({
  className,
  duration = 10,
  delay = 0,
  colorFrom = "#c9c4ff",
  colorTo = "#4636f0",
  borderWidth = 1.5,
}: {
  className?: string;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 rounded-[inherit]", className)} aria-hidden>
      <div
        className="border-beam absolute inset-0 rounded-[inherit]"
        style={
          {
            padding: `${borderWidth}px`,
            background: `linear-gradient(var(--angle, 0deg), transparent 0%, transparent 35%, ${colorFrom} 50%, ${colorTo} 65%, transparent 80%, transparent 100%)`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            animationDuration: `${duration}s`,
            animationDelay: `-${delay}s`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
