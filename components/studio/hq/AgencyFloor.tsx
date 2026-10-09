import { FadeIn } from "@/components/studio/fx/FadeIn";
import { FlowNode, FlowStage } from "@/components/studio/fx/FlowStage";
import { DEPT_GLOW } from "@/components/studio/fx/tokens";
import { ClosedRoom, ClosedRoomsCompact, OpenRoom, floorDepartments } from "./rooms";
import { ArrowDownIcon, DoorIcon } from "./icons";

/**
 * « L’agence » : le plan d’étage, cœur visuel du QG. Un bento de pièces en verre posé sur un sol tramé.
 * Le sol n’a ni cadre ni fond (une seule épaisseur de verre en moins) : seulement une trame de points qui s’efface vers les bords.
 * Pièces ouvertes : verre clair, liseré lumineux du département, cartes personnages (prospection) ou bureau compact (direction).
 * Pièces à ouvrir : verre assombri (sans flou d’arrière-plan), cadenas, postes prévus ; sur mobile, en lignes compactes dans un seul bloc.
 *
 * Grille : 1 colonne (mobile), 3 colonnes (md), 4 colonnes égales en xl (voir PLACEMENT dans rooms.tsx).
 * Sous le plan, l’entrée de l’agence : un rail vertical (FlowStage, axe y) descend jusqu’au titre « Activité » juste dessous,
 * avec la pastille « Entrée des demandes du site » posée dessus. Une comète ne le parcourt (porte → demandes) que si
 * les demandes sont réellement lues dans Supabase (live) et que le rail est à l’écran ; sinon le rail est immobile,
 * en pointillés : aucune arrivée de demande n’est suggérée. Mouvement réduit : le rail seul, immobile.
 */
export function AgencyFloor({ live }: { live: boolean }) {
  const floor = floorDepartments();
  const closed = floor.filter((d) => !d.open);

  return (
    <section aria-labelledby="agence-titre">
      <FadeIn trigger="inView" y={18} className="min-w-0">
        <p className="studio-kicker flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-linear-to-r from-transparent to-[#4C8DFF]" />
          Plan de l’agence
        </p>
        <h2 id="agence-titre" className="studio-h2 mt-4">
          L’agence
        </h2>
        <p className="studio-body mt-3 max-w-[60ch]">Ouvre une pièce pour voir un département, ou un poste pour la fiche d’un agent. Les pièces verrouillées ouvriront plus tard.</p>
      </FadeIn>

      {/* Le sol : trame de points seule, qui déborde un peu dans la gouttière (les pièces restent alignées sur le titre). */}
      <div className="relative mt-7 rounded-[32px] sm:-mx-4 sm:mt-8 sm:p-4 lg:-mx-5 lg:p-5">
        <span
          aria-hidden
          className="studio-dots pointer-events-none absolute inset-0 rounded-[inherit] [mask-image:radial-gradient(ellipse_at_50%_30%,#000_20%,transparent_80%)]"
        />
        <ul className="relative grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {floor.map((d, idx) =>
            d.open ? <OpenRoom key={d.id} department={d} delay={idx * 0.06} /> : <ClosedRoom key={d.id} department={d} delay={(idx - 1) * 0.06} />,
          )}
          <ClosedRoomsCompact rooms={closed} />
        </ul>
      </div>

      {/* L’entrée de l’agence : c’est par là qu’arrivent les demandes du site. Le rail descend jusqu’au titre « Activité ». */}
      <FlowStage color={DEPT_GLOW.prospection} segment={1.6} tail={64} paused={!live} className="mx-auto mt-3 flex w-fit flex-col items-center sm:-mt-1 lg:-mt-2">
        <FlowNode>
          <span aria-hidden className="block size-2 rounded-full bg-[#4C8DFF] shadow-[0_0_10px_#4C8DFF]" />
        </FlowNode>
        <span aria-hidden className="block h-5 sm:h-6" />
        <a
          href="#demandes"
          className="group/door relative z-[1] inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/12 bg-[#08101F] px-4 text-[13px] font-medium text-white/80 shadow-[0_0_0_6px_rgb(6_11_22/0.9),0_10px_30px_-12px_rgb(76_141_255/0.5)] transition-colors duration-300 hover:border-white/25 hover:text-white motion-reduce:transition-none"
        >
          <DoorIcon className="size-4 text-[#CADFED]" />
          <span>Entrée des demandes du site</span>
          <ArrowDownIcon className="size-4 text-[#CADFED] transition-transform duration-300 motion-safe:group-hover/door:translate-y-0.5 motion-reduce:transition-none" />
        </a>
        <span aria-hidden className="block h-10 sm:h-12 lg:h-14" />
        <FlowNode>
          <span aria-hidden className="block size-2 rounded-full bg-[#CADFED] shadow-[0_0_10px_#9CC3FF]" />
        </FlowNode>
      </FlowStage>
    </section>
  );
}
