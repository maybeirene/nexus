import { useNow } from "../../../shared/hooks/useNow";
import { formatLongDate, toIsoDate } from "../../../shared/lib/date";
import { AssistantStatus } from "./AssistantStatus";

export function StatusBar() {
  const now = useNow(60_000);
  return (
    <header className="flex h-7 shrink-0 items-center justify-between gap-4 px-1">
      <div className="flex items-center gap-3">
        <h1 className="text-body font-semibold tracking-[0.08em] text-fg">NEXUS</h1>
        <AssistantStatus />
      </div>
      {now ? (
        <time dateTime={toIsoDate(now)} className="text-caption text-muted tabular-nums">
          {formatLongDate(now)}
        </time>
      ) : null}
    </header>
  );
}
