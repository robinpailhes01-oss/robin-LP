/* Adapté des marquees de 21st.dev (7ovr « Logo Cloud Marquee », serafimcloud « Testimonials with Marquee »). */

import { cn } from "@/lib/utils";

export function Marquee({
  children,
  duration = 32,
  reverse = false,
  className,
  gapClass = "gap-6",
}: {
  children: React.ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
  gapClass?: string;
}) {
  return (
    <div className={cn("marquee group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]", className)}>
      <div
        className={cn("marquee-track flex w-max items-stretch", gapClass, reverse && "marquee-reverse")}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className={cn("flex shrink-0 items-stretch", gapClass)}>{children}</div>
        <div className={cn("flex shrink-0 items-stretch", gapClass)} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
