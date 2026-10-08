/** Conteneur de section : marges généreuses, fond blanc, blanc doux ou bleu très clair. */
export function Section({
  id,
  tone = "white",
  className = "",
  children,
}: {
  id?: string;
  tone?: "white" | "paper" | "mist";
  className?: string;
  children: React.ReactNode;
}) {
  const bg = tone === "mist" ? "bg-mist" : tone === "paper" ? "bg-paper" : "bg-white";
  return (
    <section id={id} className={`${bg} py-20 md:py-28 lg:py-32 scroll-mt-20 ${className}`}>
      <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
