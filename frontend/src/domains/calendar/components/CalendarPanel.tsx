import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "../../../design-system/atoms/IconButton";
import { Panel } from "../../../design-system/organisms/Panel";
import { useNow } from "../../../shared/hooks/useNow";
import { formatMonthYear, isSameDay } from "../../../shared/lib/date";
import { useCalendarMonth } from "../hooks/useCalendarMonth";
import { hasEvent } from "../model/events";
import { WEEKDAY_LABELS } from "../model/monthGrid";
import { CalendarDayCell } from "./CalendarDayCell";

export function CalendarPanel() {
  const today = useNow(60_000);
  const { month, weeks, previous, next } = useCalendarMonth(today);
  const title = month ? formatMonthYear(month) : "Calendario";

  return (
    <Panel
      title={title}
      className="shrink-0"
      action={
        <>
          <IconButton icon={ChevronLeft} aria-label="Mes anterior" onClick={previous} />
          <IconButton icon={ChevronRight} aria-label="Mes siguiente" onClick={next} />
        </>
      }
    >
      <table className="w-full table-fixed border-separate border-spacing-y-1" aria-live="polite" aria-label={title}>
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((weekday) => (
              <th key={weekday.short} scope="col" abbr={weekday.long} className="pb-1 text-caption font-normal text-muted">
                {weekday.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0].date.toISOString()}>
              {week.map((day) => (
                <CalendarDayCell
                  key={day.date.toISOString()}
                  day={day}
                  isToday={today !== null && isSameDay(day.date, today)}
                  hasEvent={day.inMonth && hasEvent(day.date)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
