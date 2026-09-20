import { CalendarMock } from "@/components/ui/CalendarMock";
import { FormMock } from "@/components/ui/FormMock";
import { PhoneMock } from "@/components/ui/PhoneMock";
import type { CaseStudy } from "@/lib/content";

/** Choisit le visuel d’un cas : téléphone avec l’agent, ou document numérique. */
export function CaseVisual({ c }: { c: CaseStudy }) {
  if (c.visual === "calendar") return <CalendarMock initials={c.initials} name={c.client} title={c.greeting} chips={c.chips} />;
  if (c.visual === "form") return <FormMock initials={c.initials} name={c.client} title={c.greeting} chips={c.chips} />;
  return <PhoneMock initials={c.initials} name={c.client} greeting={c.greeting} chips={c.chips} />;
}
