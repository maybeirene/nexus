import { Panel } from "../../../design-system/organisms/Panel";
import { useNow } from "../../../shared/hooks/useNow";
import { formatClock, formatWeekdayDate } from "../../../shared/lib/date";

export function ClockPanel() {
  const now = useNow(1000);
  const clock = now ? formatClock(now) : null;

  return (
    <Panel title="Reloj" className="shrink-0">
      <time dateTime={now?.toISOString()} className="flex flex-col gap-1">
        <span className="flex items-baseline gap-1.5 tabular-nums">
          <span className="text-display font-semibold text-fg">{clock?.hoursMinutes ?? "--:--"}</span>
          <span className="text-caption text-muted" aria-hidden="true">
            {clock?.seconds ?? "--"}
          </span>
        </span>
        <span className="text-caption text-muted">{now ? formatWeekdayDate(now) : "\u00a0"}</span>
      </time>
    </Panel>
  );
}
