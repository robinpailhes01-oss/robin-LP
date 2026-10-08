const pourcent = new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 0 });
const nombre = new Intl.NumberFormat("fr-FR");
const jour = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" });
const jourHeure = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});
const heure = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

export const fmtPct = (x: number | null) => (x === null ? "—" : pourcent.format(x));
export const fmtNb = (n: number) => nombre.format(n);
export const fmtJour = (iso: string) => jour.format(new Date(iso));
export const fmtJourHeure = (iso: string) => jourHeure.format(new Date(iso));
export const fmtHeure = (d: Date) => heure.format(d);

export function pluriel(n: number, singulier: string, plurielForme = `${singulier}s`) {
  return `${fmtNb(n)} ${n > 1 ? plurielForme : singulier}`;
}
