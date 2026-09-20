import { Pill } from "@/components/ui/Logo";
export function PageIntro({
  kicker,
  title,
  accent,
  text,
}: {
  kicker: string;
  title: string;
  accent?: string;
  text: string;
}) {
  return (
    <section className="page-intro container entrance">
      <Pill>{kicker}</Pill>
      <h1 className="t-h1">
        {title}
        {accent && (
          <>
            <br />
            <span className="accent">{accent}</span>
          </>
        )}
      </h1>
      <p className="t-lead">{text}</p>
    </section>
  );
}
