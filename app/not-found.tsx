import { ButtonLink } from "@/components/ui/Button";
export default function NotFound() {
  return (
    <section className="page-intro container">
      <p className="t-kicker">404</p>
      <h1 className="t-h1">Cette page n’existe pas.</h1>
      <p className="t-lead">Retrouvons le bon chemin.</p>
      <ButtonLink href="/">Revenir à l’accueil</ButtonLink>
    </section>
  );
}
