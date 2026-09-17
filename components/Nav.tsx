"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useContact } from "@/components/contact/ContactContext";
import { cta, nav } from "@/lib/content";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { openContact } = useContact();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-[background-color,border-color,backdrop-filter] duration-300 ease-[var(--ease-luma)] border-b ${
          scrolled || menu ? "bg-surface/85 backdrop-blur-md border-surface-alt" : "bg-transparent border-transparent"
        }`}
      >
        <div className="mx-auto max-w-luma px-6 h-16 md:h-[72px] flex items-center justify-between gap-6">
          <Link href="/" className="text-[20px] font-semibold tracking-[-0.03em]" aria-label="Luma, accueil">
            Luma
          </Link>

          <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-8">
            {nav.map((l) => (
              <Link key={l.href} href={l.href} className="text-[15px] text-muted hover:text-ink transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button onClick={openContact} className="h-10 px-5 text-[14px]">
              {cta.primary}
            </Button>
            <button
              type="button"
              className="md:hidden size-10 -mr-2 inline-flex items-center justify-center rounded-full"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setMenu((m) => !m)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                {menu ? (
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                ) : (
                  <path d="M3 6h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-20 bg-surface pt-24 px-6 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav aria-label="Navigation mobile" className="flex flex-col">
              {nav.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMenu(false)}
                    className="block py-4 text-[32px] font-semibold tracking-[-0.02em] border-b border-surface-alt"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
