import { useMemo, useState } from "react";
import { addMonths, buildMonthGrid } from "../model/monthGrid";

/** Mes visible, desplazado `offset` meses respecto al de hoy. */
export function useCalendarMonth(today: Date | null) {
  const [offset, setOffset] = useState(0);
  const year = today?.getFullYear();
  const monthIndex = today?.getMonth();

  const month = useMemo(
    () => (year === undefined || monthIndex === undefined ? null : addMonths(new Date(year, monthIndex, 1), offset)),
    [year, monthIndex, offset],
  );
  const weeks = useMemo(() => (month ? buildMonthGrid(month) : []), [month]);

  return {
    month,
    weeks,
    previous: () => setOffset((value) => value - 1),
    next: () => setOffset((value) => value + 1),
  };
}
