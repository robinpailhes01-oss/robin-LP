import { notFound } from "next/navigation";
import Link from "next/link";
import { articles } from "@/lib/resources";
import { FinalCta } from "@/components/sections/Sections";
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((a) => a.slug === slug);
  return { title: a?.title ?? "Ressource introuvable" };
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((a) => a.slug === slug);
  if (!a) notFound();
  return (
    <>
      <article className="article-page container">
        <Link href="/ressources" className="back-link">
          ← Toutes les ressources
        </Link>
        <p className="t-kicker">{a.category}</p>
        <h1 className="t-h1">{a.title}</h1>
        <p className="t-lead">{a.intro}</p>
        {a.sections.map((s, i) => (
          <section key={s.title}>
            <span className="t-kicker">0{i + 1}</span>
            <h2>{s.title}</h2>
            <p className="t-body">{s.text}</p>
          </section>
        ))}
      </article>
      <FinalCta />
    </>
  );
}
