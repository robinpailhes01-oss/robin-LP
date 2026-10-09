import Link from "next/link";
import { agentsOf, departments, type Department, type DepartmentId } from "@/lib/studio/agents";
import { PlannedAvatar } from "@/components/studio/AgentAvatar";
import { Workstation } from "./Workstation";
import { ArrowDownIcon, ArrowRightIcon, DoorIcon, LockIcon } from "./icons";
import { count } from "./format";

/**
 * Plan d’étage de l’agence, vu de dessus. Le sol est une trame de points, chaque pièce est un département.
 * Desktop : Direction en haut à gauche, Prospection au centre, les pièces à ouvrir autour.
 * Tablette : deux colonnes, Prospection sur toute la largeur. Mobile : les pièces s’empilent.
 */
const placement: Record<DepartmentId, string> = {
  direction: "md:[grid-area:1/1]",
  contenu: "md:[grid-area:1/2] lg:[grid-area:2/1]",
  prospection: "md:[grid-area:2/1/3/-1] lg:[grid-area:1/2/3/3]",
  clients: "md:[grid-area:3/1] lg:[grid-area:1/3]",
  production: "md:[grid-area:3/2] lg:[grid-area:2/3]",
};

function roomNumber(d: Department) {
  return `Pièce ${String(departments.indexOf(d) + 1).padStart(2, "0")}`;
}

function OpenRoom({ department, delay }: { department: Department; delay: number }) {
  const team = agentsOf(department.id);
  const solo = team.length === 1 ? team[0] : null;
  const titleId = `piece-${department.id}`;

  return (
    <li
      className={`hero-in group/room relative flex flex-col rounded-[26px] border border-line bg-white p-4 shadow-[0_1px_2px_rgba(23,38,61,0.04)] transition-[box-shadow,border-color] duration-200 ease-luma has-[[data-room-link]:hover]:border-powder has-[[data-room-link]:hover]:shadow-[0_20px_44px_-26px_rgba(23,38,61,0.38)] motion-reduce:transition-none sm:p-5 ${placement[department.id]}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Liseré d’accent du département, en haut de la pièce */}
      <span aria-hidden className="absolute inset-x-6 top-0 h-[3px] rounded-b-full" style={{ background: department.accent }} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{roomNumber(department)}</p>
          <h3 id={titleId} className="mt-1 font-display text-[18px] font-bold leading-tight tracking-[-0.015em] text-night">
            {/* Lien étiré : toute la pièce mène au département ; les postes, au-dessus, mènent aux fiches. */}
            <Link
              href={`/studio/departements/${department.id}`}
              data-room-link
              className="after:absolute after:inset-0 after:rounded-[25px] focus-visible:outline-none! focus-visible:after:[outline:2px_solid_var(--color-night)] focus-visible:after:[outline-offset:3px]"
            >
              {department.name}
              <span className="sr-only">, ouvrir le département</span>
            </Link>
          </h3>
          <p className="mt-1 text-[13px] text-muted">{count(team.length, "agent")}</p>
        </div>
        <span
          aria-hidden
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-night transition-colors duration-200 group-has-[[data-room-link]:hover]/room:border-night group-has-[[data-room-link]:hover]/room:bg-night group-has-[[data-room-link]:hover]/room:text-white motion-reduce:transition-none"
        >
          <ArrowRightIcon />
        </span>
      </div>

      {team.length > 0 ? (
        <ul className={`mt-5 grid gap-3 ${solo ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4 lg:grid-cols-2"}`}>
          {team.map((a) => (
            <li key={a.id}>
              <Workstation agent={{ id: a.id, name: a.name, role: a.role, status: a.status, avatar: a.avatar }} accent={department.accent} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 rounded-[18px] border border-dashed border-line p-4 text-[13px] text-muted">Aucun poste pourvu pour l’instant.</p>
      )}

      {/* Seul dans son bureau : sa présentation, en une phrase. */}
      {solo && (
        <p className="mt-4 px-1 text-[14px] leading-[1.55] text-ink text-pretty">
          «&nbsp;{solo.tagline}&nbsp;»
        </p>
      )}
    </li>
  );
}

function ClosedRoom({ department, delay }: { department: Department; delay: number }) {
  const titleId = `piece-${department.id}`;
  return (
    <li
      className={`hero-in relative flex flex-col rounded-[26px] border-2 border-dashed border-powder bg-white/45 p-4 sm:p-5 ${placement[department.id]}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span aria-hidden className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-mist text-slate">
            <LockIcon />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{roomNumber(department)}</p>
            <h3 id={titleId} className="mt-1 font-display text-[17px] font-bold leading-tight tracking-[-0.015em] text-ink">
              {department.name}
            </h3>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-line bg-paper px-2.5 py-1 text-[12px] font-semibold text-muted">À ouvrir</span>
      </div>

      <p className="mt-3 text-[13px] leading-[1.5] text-muted text-pretty">{department.description}</p>

      {department.plannedRoles && department.plannedRoles.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Postes prévus</p>
          <ul className="mt-2.5 space-y-2.5">
            {department.plannedRoles.map((role) => (
              <li key={role} className="flex items-center gap-3">
                <PlannedAvatar size={36} />
                <span className="text-[13px] font-medium leading-[1.35] text-ink">{role}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted" aria-label="Légende du plan">
      <li className="flex items-center gap-2">
        <span aria-hidden className="size-3.5 rounded-[5px] border border-line bg-white shadow-[0_1px_2px_rgba(23,38,61,0.08)]" />
        Pièce ouverte
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden className="size-3.5 rounded-[5px] border-[1.5px] border-dashed border-powder" />
        À ouvrir
      </li>
    </ul>
  );
}

/** « L’agence » : le cœur visuel du QG. */
export function AgencyFloor() {
  return (
    <section aria-labelledby="agence-titre">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">Plan de l’agence</p>
          <h2 id="agence-titre" className="mt-1 font-display text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em] text-night sm:text-[34px]">
            L’agence
          </h2>
          <p className="mt-2 max-w-[56ch] text-[15px] leading-[1.55] text-ink text-pretty">
            Ouvre une pièce pour voir un département, ou un poste pour la fiche d’un agent.
          </p>
        </div>
        <Legend />
      </div>

      {/* Le sol : bleu très clair et fine trame de points */}
      <div
        className="mt-5 rounded-[30px] border border-line bg-mist/50 p-3 sm:p-4 lg:p-5"
        style={{ backgroundImage: "radial-gradient(rgb(113 135 154 / 0.24) 1px, transparent 1.3px)", backgroundSize: "16px 16px" }}
      >
        <ul className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]">
          {departments.map((d, i) =>
            d.open ? <OpenRoom key={d.id} department={d} delay={180 + i * 60} /> : <ClosedRoom key={d.id} department={d} delay={180 + i * 60} />,
          )}
        </ul>

        {/* L’entrée de l’agence : c’est par là qu’arrivent les demandes du site. */}
        <div className="mt-3 flex justify-center sm:mt-4">
          <a
            href="#demandes"
            className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line bg-white px-4 text-[13px] font-medium text-ink transition-colors duration-200 hover:border-powder hover:text-night focus-visible:rounded-full! motion-reduce:transition-none"
          >
            <DoorIcon className="size-4 text-slate" />
            <span>Entrée des demandes du site</span>
            <ArrowDownIcon className="size-4 text-slate" />
          </a>
        </div>
      </div>
    </section>
  );
}
