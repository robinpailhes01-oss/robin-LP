import Link from "next/link";

export default function Introuvable() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[36rem] flex-col justify-center px-4">
      <p className="repere">Introuvable</p>
      <h1 className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-ink">Ce lead n&apos;existe pas, ou plus.</h1>
      <Link href="/leads" className="mt-6 text-[15px] font-medium text-accent hover:text-accent-strong">
        Revenir aux leads
      </Link>
    </main>
  );
}
