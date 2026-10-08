import type { Metadata } from "next";
import { MiniAudit } from "@/components/audit/MiniAudit";
import { Kicker } from "@/components/ui/Logo";
import { miniAudit } from "@/lib/miniAudit";

export const metadata: Metadata = {
  title: miniAudit.meta.title,
  description: miniAudit.meta.description,
};

export default function AuditPage() {
  return (
    <section className="min-h-[100dvh] bg-white pb-24 pt-28 sm:pt-32 lg:pt-36">
      <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-[44rem]">
          <Kicker>{miniAudit.kicker}</Kicker>
          <h1 className="t-h1 mt-5 text-[clamp(2rem,1.2rem+3vw,3.25rem)]">{miniAudit.title}</h1>
          <p className="t-lead mt-4">{miniAudit.text}</p>
        </div>
        <MiniAudit />
      </div>
    </section>
  );
}
