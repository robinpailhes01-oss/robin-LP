"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Arrow, Button } from "@/components/ui/Button";
import { useContact } from "@/components/contact/ContactContext";
import { nav, cta } from "@/lib/content";
export function Nav() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [menu, setMenu] = useState(false);
  const { openContact } = useContact();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    setMenu(false);
    dialog.current?.close();
  }, [path]);
  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const media = window.matchMedia("(min-width: 1180px)");
    const close = () => {
      if (media.matches) {
        dialog.current?.close();
        setMenu(false);
      }
    };
    media.addEventListener("change", close);
    return () => {
      document.body.style.overflow = prev;
      media.removeEventListener("change", close);
    };
  }, [menu]);
  function close() {
    dialog.current?.close();
    setMenu(false);
    toggle.current?.focus();
  }
  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="site-nav container">
          <Link href="/" aria-label="Luma, accueil" className="brand-link">
            <Logo />
          </Link>
          <nav className="desktop-nav" aria-label="Navigation principale">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={path === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Button className="nav-cta" onClick={openContact}>
            {cta.primary}
            <Arrow />
          </Button>
          <button
            ref={toggle}
            className="menu-toggle"
            aria-label="Ouvrir le menu"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            onClick={() => {
              dialog.current?.showModal();
              setMenu(true);
            }}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className="mobile-dialog"
        onCancel={() => setMenu(false)}
        onClose={() => setMenu(false)}
      >
        <div className="mobile-menu-top">
          <Link href="/" onClick={close} className="brand-link">
            <Logo />
          </Link>
          <button
            className="close-button"
            aria-label="Fermer le menu"
            onClick={close}
          >
            ×
          </button>
        </div>
        <nav aria-label="Navigation mobile">
          {nav.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              aria-current={path === l.href ? "page" : undefined}
            >
              <span className="menu-index">0{i + 1}</span>
              {l.label}
              <Arrow />
            </Link>
          ))}
        </nav>
        <Button
          onClick={() => {
            close();
            openContact();
          }}
        >
          {cta.primary}
          <Arrow />
        </Button>
        <p className="micro">Un premier échange. Sans engagement.</p>
      </dialog>
    </>
  );
}
