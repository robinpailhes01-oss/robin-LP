import Link from "next/link";
import type { CSSProperties } from "react";
import { agentsOf, departments, statusLabel, type Agent, type Department } from "@/lib/studio/agents";
import { CharacterCard } from "@/components/studio/CharacterCard";
import { AgentAvatar, PlannedAvatar } from "@/components/studio/AgentAvatar";
import { FadeIn } from "@/components/studio/fx/FadeIn";
import { LiveDot } from "@/components/studio/fx/LiveDot";
import { DEPT_GLOW, deptGlow } from "@/components/studio/fx/tokens";
import { ProspectionCircuit } from "./ProspectionCircuit";
import { ArrowUpRightIcon, ChevronRightIcon, ClockIcon, LockIcon, TargetIcon } from "./icons";
import { count, typo } from "./format";

/**
 * Les pièces du plan de l’agence (AgencyFloor). Chaque pièce est un département ; toute la pièce mène à sa page
 * (lien étiré sur le titre), les cartes personnages et le bureau d’Alma, posés au-dessus (z-[2]), mènent aux fiches.
 *
 * Ordre du plan (floorDepartments) : d’abord les pièces ouvertes, la plus grande équipe en tête (la prospection), puis les pièces à ouvrir.
 * L’ordre du DOM suit l’ordre affiché (lecture et tabulation dans le même sens que l’œil).
 * Placement (grille du plan, voir AgencyFloor) :
 *  - xl (4 colonnes égales) : Prospection sur toute la première rangée, ses quatre cartes à environ 300 px et le circuit dessous ;
 *    deuxième rangée : le bureau compact de la Direction, puis les trois pièces à ouvrir.
 *  - md à xl (3 colonnes) : Prospection, puis Direction sur toute la largeur ; les trois pièces à ouvrir côte à côte.
 *  - mobile : Prospection, Direction, puis les pièces à ouvrir en lignes compactes dans un seul bloc (ClosedRoomsCompact).
 */
const PLACEMENT: Record<string, string> = {
  prospection: "md:col-span-3 xl:col-span-4",
  direction: "md:col-span-3 xl:col-span-1",
};

/** Départements dans l’ordre du plan. */
export function floorDepartments(): Department[] {
  const open = departments.filter((d) => d.open).sort((a, b) => agentsOf(b.id).length - agentsOf(a.id).length);
  return [...open, ...departments.filter((d) => !d.open)];
}

function roomNumber(d: Department) {
  return `Pièce ${String(floorDepartments().indexOf(d) + 1).padStart(2, "0")}`;
}

/** Lien étiré : toute la pièce mène au département. Contour de focus dessiné sur la pièce entière. */
const STRETCHED =
  "after:absolute after:inset-0 after:z-[1] after:rounded-[28px] focus-visible:outline-none! focus-visible:after:[outline:2px_solid_#CADFED] focus-visible:after:[outline-offset:-2px]";

function RoomTitle({ department, closed = false }: { department: Department; closed?: boolean }) {
  return (
    <h3
      id={`piece-${department.id}`}
      className={`mt-2 font-display font-bold leading-[1.08] tracking-[-0.03em] text-balance ${closed ? "text-[19px] text-white/90" : "text-[23px] text-white sm:text-[26px]"}`}
    >
      <Link href={`/studio/departements/${department.id}`} data-room-link className={STRETCHED}>
        {department.name}
        {closed && <span className="sr-only"> (pas encore ouvert)</span>}
      </Link>
    </h3>
  );
}

/** Pastille flèche en haut à droite : s’allume quand on survole la pièce. */
function RoomArrow() {
  return (
    <span
      aria-hidden
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-[background-color,border-color,color] duration-300 pointer-fine:group-has-[[data-room-link]:hover]/room:border-white/30 pointer-fine:group-has-[[data-room-link]:hover]/room:bg-white pointer-fine:group-has-[[data-room-link]:hover]/room:text-[#0A1324] motion-reduce:transition-none"
    >
      <ArrowUpRightIcon className="size-4" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Pièce ouverte                                                       */
/* ------------------------------------------------------------------ */

/**
 * Bureau compact d’un agent seul (Direction) : portrait de 56 px dans son halo glacier, prénom et statut, rôle,
 * puis routine et livrable en filets. Pas de grande carte personnage : Alma a déjà sa carte de commandement plus haut.
 * md à xl (pièce sur toute la largeur) : identité | routine | livrable sur une rangée ; ailleurs, empilés.
 */
function SoloOffice({ agent, glow }: { agent: Agent; glow: string }) {
  const status = statusLabel[agent.status];
  return (
    <div className="relative mt-5 grid gap-4 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,1fr)] md:items-start md:gap-8 xl:grid-cols-1 xl:gap-0">
      <Link
        href={`/studio/agents/${agent.id}`}
        aria-label={`${agent.name}, ${agent.role}, ${status.toLowerCase()} : ouvrir sa fiche`}
        className="group/desk relative z-[2] -m-2 flex min-h-11 items-center gap-3.5 rounded-[18px] p-2 transition-colors duration-300 hover:bg-white/[0.045] motion-reduce:transition-none"
      >
        <AgentAvatar agent={{ name: agent.name, avatar: agent.avatar }} size={56} ring={glow} decorative />
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-display text-[22px] font-extrabold leading-none tracking-[-0.035em] text-white">{agent.name}</span>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold leading-none text-white/75">
              <LiveDot status={agent.status} size={6} />
              {status}
            </span>
          </span>
          <span className="mt-1.5 block text-[13px] leading-[1.35] text-white/65">{agent.role}</span>
        </span>
      </Link>

      {/* Repères : routine et livrable en filets fins, pas d’encadré dans la pièce. */}
      <dl className="divide-y divide-white/[0.07] border-y border-white/[0.07] md:contents xl:mt-5 xl:block">
        <div className="py-3.5 md:border-l md:border-white/[0.07] md:py-0 md:pl-7 xl:border-l-0 xl:py-3.5 xl:pl-0">
          <dt className="studio-kicker flex items-center gap-2">
            <ClockIcon className="size-3.5 text-[#CADFED]" />
            Routine prévue
          </dt>
          <dd className="mt-1.5 text-[13.5px] leading-[1.5] text-white/82 text-pretty">{typo(agent.routine)}</dd>
        </div>
        <div className="py-3.5 md:border-l md:border-white/[0.07] md:py-0 md:pl-7 xl:border-l-0 xl:py-3.5 xl:pl-0">
          <dt className="studio-kicker flex items-center gap-2">
            <TargetIcon className="size-3.5 text-[#CADFED]" />
            Livrable
          </dt>
          <dd className="mt-1.5 text-[13.5px] leading-[1.5] text-white/82 text-pretty">{typo(agent.deliverable)}</dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * Équipe : carrousel à défilement accrocheur tant que la pièce est étroite (mobile, tablette),
 * grille de quatre dès que la pièce dépasse 42rem (requête de conteneur). Pas de fondu-montée ici :
 * chaque carte joue son entrée « sélection de personnage » (portrait qui se pose, puis un balayage de lumière), en cascade (--ci).
 */
function TeamDeck({ team, glow, label }: { team: Agent[]; glow: string; label: string }) {
  return (
    <div className="@container relative z-[2] mt-6">
      <ul
        aria-label={label}
        className="-mx-4 -my-2 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 py-2 pb-4 [scroll-padding-inline:1rem] [scrollbar-color:rgb(255_255_255/0.16)_transparent] [scrollbar-width:thin] sm:-mx-5 sm:px-5 sm:[scroll-padding-inline:1.25rem] @2xl:mx-0 @2xl:my-0 @2xl:grid @2xl:grid-cols-4 @2xl:gap-4 @2xl:overflow-visible @2xl:p-0"
      >
        {team.map((a, i) => (
          <li key={a.id} className="w-[min(15rem,74%)] shrink-0 snap-start @2xl:w-auto" style={{ "--ci": i } as CSSProperties}>
            <CharacterCard
              agent={{ id: a.id, name: a.name, role: a.role, status: a.status, avatar: a.avatar }}
              accent={glow}
              size="md"
              as="h4"
              roleLines={2}
              sizes="(min-width: 1280px) 320px, (min-width: 1024px) 240px, 240px"
            />
          </li>
        ))}
      </ul>
      <p className="mt-1 flex items-center gap-2 text-[12.5px] text-white/62 @2xl:hidden">
        <span aria-hidden className="h-px w-5 bg-white/25" />
        Fais défiler pour voir toute l’équipe
      </p>
    </div>
  );
}

export function OpenRoom({ department, delay }: { department: Department; delay: number }) {
  const team = agentsOf(department.id);
  const glow = deptGlow(department.id);
  const solo = team.length === 1 ? team[0] : null;
  const isProspection = department.id === "prospection";

  return (
    <FadeIn
      as="li"
      trigger="inView"
      delay={delay}
      y={24}
      duration={0.85}
      className={`group/room studio-glass relative isolate flex flex-col rounded-[28px] p-4 transition-[border-color] duration-300 pointer-fine:has-[[data-room-link]:hover]:border-white/[0.18] motion-reduce:transition-none sm:p-6 ${PLACEMENT[department.id] ?? "md:col-span-3"}`}
      style={{ "--glow": glow } as CSSProperties}
    >
      {/* Lumière de la pièce, découpée dans ses coins arrondis. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <span className="studio-halo absolute -left-24 -top-28 size-80 opacity-55" style={{ "--halo": glow } as CSSProperties} />
        {isProspection && <span className="studio-halo absolute -right-32 top-1/3 size-[28rem] opacity-25" style={{ "--halo": glow } as CSSProperties} />}
      </span>

      {/* Liseré lumineux du département, posé sur la bordure haute (immobile : le mouvement de la pièce, c’est son circuit). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-10 -top-px h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${glow}, transparent)`, boxShadow: `0 0 12px ${glow}` }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="studio-kicker flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-full" style={{ background: glow, boxShadow: `0 0 10px ${glow}` }} />
            {roomNumber(department)}
            <span aria-hidden className="text-white/25">
              ·
            </span>
            <span>{count(team.length, "agent")}</span>
          </p>
          <RoomTitle department={department} />
        </div>
        <RoomArrow />
      </div>

      {solo ? (
        <SoloOffice agent={solo} glow={glow} />
      ) : (
        <>
          <p className="studio-body relative mt-2.5 max-w-[62ch] text-white/70">{typo(department.description)}</p>
          {team.length > 0 ? (
            <TeamDeck team={team} glow={glow} label={`Équipe ${department.name}`} />
          ) : (
            <p className="mt-5 rounded-[14px] border border-dashed border-white/15 p-4 text-[13px] text-white/62">Aucun poste pourvu pour l’instant.</p>
          )}
          {isProspection && (
            <div className="relative mt-auto pt-5">
              <ProspectionCircuit color={glow} />
            </div>
          )}
        </>
      )}
    </FadeIn>
  );
}

/* ------------------------------------------------------------------ */
/* Pièce à ouvrir : verre assombri (sans flou d’arrière-plan), cadenas, postes prévus */
/* ------------------------------------------------------------------ */

/** Pièce à ouvrir en carte (dès 768 px ; sur mobile, ClosedRoomsCompact la remplace). */
export function ClosedRoom({ department, delay }: { department: Department; delay: number }) {
  const glow = deptGlow(department.id);
  const roles = department.plannedRoles ?? [];

  return (
    <FadeIn
      as="li"
      trigger="inView"
      delay={delay}
      y={24}
      duration={0.85}
      className="group/room studio-glass relative isolate hidden flex-col rounded-[28px] border-white/[0.07] bg-[rgb(5_12_26/0.62)] p-4 shadow-none backdrop-filter-none transition-[border-color,background-color] duration-300 pointer-fine:has-[[data-room-link]:hover]:border-white/[0.16] pointer-fine:has-[[data-room-link]:hover]:bg-[rgb(8_17_34/0.6)] motion-reduce:transition-none sm:p-5 md:flex"
    >
      {/* Hachures très fines (pièce fermée) et lueur froide (bleu électrique très doux : une teinte sourde ferait une tache grise). */}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <span className="absolute inset-0 [background-image:repeating-linear-gradient(135deg,rgb(255_255_255/0.028)_0_1px,transparent_1px_12px)]" />
        <span className="studio-halo absolute -right-20 -top-24 size-60 opacity-[0.22]" style={{ "--halo": DEPT_GLOW.prospection } as CSSProperties} />
      </span>

      <div className="relative flex items-center justify-between gap-3">
        <span
          aria-hidden
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-[border-color,box-shadow] duration-300 pointer-fine:group-has-[[data-room-link]:hover]/room:border-white/25 motion-reduce:transition-none"
          style={{ color: glow }}
        >
          <LockIcon className="size-[18px]" />
        </span>
        <span className="studio-chip border-white/10 bg-white/[0.04] text-white/75">À ouvrir</span>
      </div>

      <p className="studio-kicker relative mt-5">{roomNumber(department)}</p>
      <RoomTitle department={department} closed />
      <p className="relative mt-2 text-[13px] leading-[1.55] text-white/62 text-pretty">{typo(department.description)}</p>

      {roles.length > 0 && (
        <div className="relative mt-auto pt-5">
          <p className="studio-kicker">Postes prévus</p>
          <ul className="mt-3 space-y-2.5">
            {roles.map((role) => (
              <li key={role} className="flex items-center gap-3">
                <PlannedAvatar size={36} />
                <span className="text-[13px] font-medium leading-[1.35] text-white/80">{typo(role)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </FadeIn>
  );
}

/**
 * Sous 768 px : les pièces à ouvrir en lignes compactes de 64 px dans un seul bloc de verre assombri
 * (cadenas de 36 px, nom, nombre de postes prévus, chevron ; toute la ligne est un lien, cible de 64 px de haut).
 */
export function ClosedRoomsCompact({ rooms }: { rooms: Department[] }) {
  if (rooms.length === 0) return null;
  return (
    <FadeIn
      as="li"
      trigger="inView"
      y={18}
      aria-labelledby="pieces-a-ouvrir"
      className="relative isolate overflow-hidden rounded-[24px] border border-white/[0.07] bg-[rgb(5_12_26/0.62)] md:hidden"
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(135deg,rgb(255_255_255/0.028)_0_1px,transparent_1px_12px)]" />
      <h3 id="pieces-a-ouvrir" className="studio-kicker relative flex items-center gap-2 px-4 pb-1.5 pt-4">
        <LockIcon className="size-3.5 text-[#9CC3FF]" />
        {count(rooms.length, "pièce à ouvrir", "pièces à ouvrir")}
      </h3>
      <ul className="relative divide-y divide-white/[0.06]">
        {rooms.map((d) => {
          const roles = d.plannedRoles?.length ?? 0;
          return (
            <li key={d.id}>
              <Link
                href={`/studio/departements/${d.id}`}
                className="flex min-h-16 items-center gap-3.5 px-4 py-2.5 transition-colors duration-200 active:bg-white/[0.04] motion-reduce:transition-none"
              >
                <span
                  aria-hidden
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]"
                  style={{ color: deptGlow(d.id) }}
                >
                  <LockIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold leading-[1.3] text-white/90">
                    {d.name}
                    <span className="sr-only"> (pas encore ouvert)</span>
                  </span>
                  <span className="mt-0.5 block text-[12.5px] leading-[1.35] text-white/62">{count(roles, "poste prévu", "postes prévus")}</span>
                </span>
                <ChevronRightIcon className="size-4 shrink-0 text-white/50" />
              </Link>
            </li>
          );
        })}
      </ul>
    </FadeIn>
  );
}

