import { ToolIcon } from "@/components/ui/ToolIcons";

type Msg = { from: "client" | "agent"; text: string };

/** Exemple de conversation, présenté comme tel. */
export function ConversationCard({ title, sector, time, messages, action }: { title: string; sector: string; time: string; messages: Msg[]; action: string }) {
  return (
    <article className="h-full flex flex-col rounded-[20px] bg-white border border-line overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-line">
        <div className="flex items-center gap-2.5 min-w-0">
          <ToolIcon name="WhatsApp" size={22} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold leading-tight text-night">{title}</p>
            <p className="text-[12px] text-muted leading-tight mt-0.5">{sector}</p>
          </div>
        </div>
        <span className="text-[12px] text-muted tabular-nums">{time}</span>
      </header>
      <div className="flex-1 flex flex-col gap-2.5 px-4 sm:px-5 py-5 bg-paper">
        {messages.map((m, i) => (
          <p
            key={i}
            className={
              m.from === "agent"
                ? "self-end max-w-[88%] rounded-[16px] rounded-br-[5px] bg-night text-white px-3.5 py-2.5 text-[14px] leading-[1.45]"
                : "self-start max-w-[88%] rounded-[16px] rounded-bl-[5px] bg-white border border-line text-night px-3.5 py-2.5 text-[14px] leading-[1.45]"
            }
          >
            <span className="sr-only">{m.from === "agent" ? "Agent : " : "Client : "}</span>
            {m.text}
          </p>
        ))}
      </div>
      <footer className="flex items-start gap-2 px-5 py-3.5 border-t border-line text-[13px] font-medium text-ink">
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden className="mt-0.5 shrink-0 text-night">
          <path d="M2 6.5l2.6 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {action}
      </footer>
    </article>
  );
}
