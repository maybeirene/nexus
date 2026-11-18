import { cn } from "../../../design-system/lib/cn";
import { formatDayMonth, toIsoDate } from "../../../shared/lib/date";
import type { CalendarDay } from "../model/monthGrid";

type CalendarDayCellProps = {
  day: CalendarDay;
  isToday: boolean;
  hasEvent: boolean;
};

export function CalendarDayCell({ day, isToday, hasEvent }: CalendarDayCellProps) {
  const label = [formatDayMonth(day.date), isToday && "hoy", hasEvent && "con evento"].filter(Boolean).join(", ");

  return (
    <td className="p-0 text-center">
      <time
        dateTime={toIsoDate(day.date)}
        aria-label={label}
        aria-current={isToday ? "date" : undefined}
        className={cn(
          "relative mx-auto flex size-6 items-center justify-center rounded-inner text-caption tabular-nums",
          isToday ? "bg-accent font-semibold text-on-accent" : day.inMonth ? "text-fg" : "text-muted/50",
        )}
      >
        {day.date.getDate()}
        {hasEvent && !isToday ? (
          <span aria-hidden="true" className="absolute -bottom-0.5 size-1 rounded-full bg-muted" />
        ) : null}
      </time>
    </td>
  );
}
