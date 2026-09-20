"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.IntersectionObserver) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.reveal = "visible";
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    if (el.getBoundingClientRect().top > window.innerHeight)
      el.dataset.reveal = "pending";
    observer.observe(el);
    const show = () => {
      if (media.matches) {
        el.dataset.reveal = "visible";
        observer.disconnect();
      }
    };
    media.addEventListener("change", show);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", show);
    };
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
