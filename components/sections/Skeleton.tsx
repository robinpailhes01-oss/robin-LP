import Image from "next/image";
import { OpenContactButton } from "@/components/contact/OpenContactButton";
import { faq, finalCta, flow, forWho, infrastructure, method, proof, promise, useCases } from "@/lib/content";

/*
 * Sections hors périmètre initial (BRIEF.md) : copy du fichier posée sans animation.
 * Chacune sera finie dans une itération dédiée.
 */

function Wrap({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-24 md:py-40 ${className}`}>
      <div className="mx-auto max-w-luma px-6">{children}</div>
    </section>
  );
}

export function PromiseSection() {
  return (
    <section id="promesse" className="min-h-svh flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-[880px]">
        <h2 className="t-hero">{promise.title}</h2>
        <p className="t-sub mt-8 max-w-[600px] mx-auto">{promise.text}</p>
      </div>
    </section>
  );
}

export function Flow() {
  return (
    <Wrap id="fonctionnement">
      <p className="t-kicker mb-6">{flow.title}</p>
      <ol className="relative grid gap-10 md:grid-cols-3 md:gap-6">
        <span aria-hidden className="hidden md:block absolute left-0 right-0 top-[7px] h-px bg-accent/40" />
        {flow.steps.map((s, i) => (
          <li key={s} className="relative md:pt-8">
            <span aria-hidden className="hidden md:block absolute top-0 left-0 size-[15px] rounded-full bg-surface border-2 border-accent" />
            <span className="block text-[13px] text-muted mb-2 md:hidden">{String(i + 1).padStart(2, "0")}</span>
            <p className={`${i === 1 ? "text-accent" : ""} text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] leading-[1.1]`}>{s}</p>
          </li>
        ))}
      </ol>
    </Wrap>
  );
}

export function Infrastructure() {
  return (
    <Wrap id="infrastructure">
      <div className="grid gap-12 md:grid-cols-12">
        <h2 className="t-section md:col-span-7">{infrastructure.title}</h2>
        <div className="md:col-start-9 md:col-span-4 self-end">
          <ul className="flex flex-col divide-y divide-surface-alt border-y border-surface-alt">
            {infrastructure.items.map((it) => (
              <li key={it} className="py-3 text-[22px] font-medium tracking-[-0.01em]">
                {it}
              </li>
            ))}
          </ul>
          <p className="t-sub mt-8">{infrastructure.text}</p>
        </div>
      </div>
    </Wrap>
  );
}

export function UseCases() {
  return (
    <Wrap id="cas-usage" className="scroll-mt-16">
      <p className="t-kicker mb-6">Cas d’usage</p>
      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 border-t border-surface-alt">
        {useCases.map((u) => (
          <li key={u.title} className="py-8 border-b border-surface-alt">
            <h3 className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.1]">{u.title}</h3>
            <p className="t-body text-muted mt-3">{u.text}</p>
          </li>
        ))}
      </ul>
    </Wrap>
  );
}

export function Proof() {
  return (
    <Wrap id="preuves">
      <h2 className="t-section max-w-[900px]">{proof.title}</h2>
      <div className="grid gap-10 md:grid-cols-2 mt-16">
        <div>
          <p className="t-kicker mb-4">Avant Luma</p>
          <ul className="divide-y divide-surface-alt border-y border-surface-alt">
            {proof.before.map((b) => (
              <li key={b} className="py-3 text-[20px] text-muted">
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="t-kicker mb-4 text-accent">Avec Luma</p>
          <ul className="divide-y divide-surface-alt border-y border-surface-alt">
            {proof.after.map((a) => (
              <li key={a} className="py-3 text-[20px] font-medium">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Résultats réels à venir : placeholders volontairement visibles, aucun chiffre inventé. */}
      <dl className="grid gap-8 sm:grid-cols-3 mt-20">
        {proof.metrics.map((m) => (
          <div key={m.label}>
            <dt className="text-[40px] md:text-[48px] font-semibold tracking-[-0.03em] leading-none text-muted">{m.value}</dt>
            <dd className="t-body text-muted mt-2">{m.label}</dd>
          </div>
        ))}
      </dl>
      {proof.logos.length > 0 && (
        <ul className="flex flex-wrap gap-10 mt-16 opacity-70">
          {proof.logos.map((l) => (
            <li key={l.name}>
              <Image src={l.src} alt={l.name} width={120} height={40} />
            </li>
          ))}
        </ul>
      )}
    </Wrap>
  );
}

export function Method() {
  return (
    <Wrap id="methode" className="scroll-mt-16">
      <h2 className="t-section max-w-[900px]">{method.title}</h2>
      <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mt-16 border-t border-surface-alt">
        {method.steps.map((s, i) => (
          <li key={s.name} className="pt-6">
            <span className="text-[13px] text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-[28px] font-semibold tracking-[-0.02em] mt-3">{s.name}</h3>
            <p className="t-body text-muted mt-2">{s.text}</p>
          </li>
        ))}
      </ol>
    </Wrap>
  );
}

export function ForWho() {
  return (
    <Wrap id="pour-qui">
      <div className="grid gap-12 md:grid-cols-12">
        <h2 className="t-section md:col-span-7">{forWho.title}</h2>
        <p className="md:col-start-9 md:col-span-4 self-end text-[22px] leading-[1.5] text-muted">
          {forWho.sectors.map((s, i) => (
            <span key={s}>
              <span className="text-ink">{s}</span>
              {i < forWho.sectors.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </div>
    </Wrap>
  );
}

export function Faq() {
  return (
    <Wrap id="faq" className="scroll-mt-16">
      <div className="grid gap-12 md:grid-cols-12">
        <h2 className="t-section md:col-span-4">Questions fréquentes</h2>
        <div className="md:col-start-6 md:col-span-7 border-t border-surface-alt">
          {faq.map((f) => (
            <details key={f.q} className="group border-b border-surface-alt">
              <summary className="flex items-center justify-between gap-6 py-5 text-[19px] md:text-[21px] font-medium tracking-[-0.01em]">
                {f.q}
                <span aria-hidden className="faq-icon shrink-0 size-6 inline-flex items-center justify-center text-muted">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="t-body text-muted pb-6 max-w-[560px]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

export function FinalCta() {
  return (
    <section id="a-propos" className="min-h-svh flex items-center justify-center px-6 py-24 scroll-mt-16">
      <div className="text-center max-w-[880px] flex flex-col items-center">
        <Image
          src="/images/portrait-fondateur.jpg"
          alt="Portrait du fondateur de Luma"
          width={96}
          height={96}
          sizes="96px"
          className="rounded-full object-cover size-20 md:size-24 mb-10"
          priority={false}
        />
        <h2 className="t-hero">{finalCta.title}</h2>
        <p className="t-sub mt-8 max-w-[600px]">{finalCta.text}</p>
        <div className="mt-10">
          <OpenContactButton />
        </div>
      </div>
    </section>
  );
}
