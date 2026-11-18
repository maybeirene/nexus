export type CalendarDay = {
  date: Date;
  inMonth: boolean;
};

export const WEEKDAY_LABELS = [
  { short: "L", long: "Lunes" },
  { short: "M", long: "Martes" },
  { short: "X", long: "Miércoles" },
  { short: "J", long: "Jueves" },
  { short: "V", long: "Viernes" },
  { short: "S", long: "Sábado" },
  { short: "D", long: "Domingo" },
] as const;

const CELLS = 42;

/** Seis semanas que empiezan en lunes y contienen el mes de `month`. */
export function buildMonthGrid(month: Date): CalendarDay[][] {
  const year = month.getFullYear();
  const index = month.getMonth();
  const mondayOffset = (new Date(year, index, 1).getDay() + 6) % 7;

  const days = Array.from({ length: CELLS }, (_, cell) => {
    const date = new Date(year, index, cell - mondayOffset + 1);
    return { date, inMonth: date.getMonth() === index };
  });

  return Array.from({ length: CELLS / 7 }, (_, week) => days.slice(week * 7, week * 7 + 7));
}

export function addMonths(month: Date, amount: number): Date {
  return new Date(month.getFullYear(), month.getMonth() + amount, 1);
}
