const LOCALE = "es-ES";

const longDate = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "long", year: "numeric" });
const weekdayDate = new Intl.DateTimeFormat(LOCALE, { weekday: "long", day: "numeric", month: "long" });
const dayMonth = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "long" });
const shortWeekday = new Intl.DateTimeFormat(LOCALE, { weekday: "short" });
const monthName = new Intl.DateTimeFormat(LOCALE, { month: "long" });

export function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase(LOCALE) + text.slice(1);
}

const pad = (value: number) => String(value).padStart(2, "0");

/** 18 de noviembre de 2026 */
export function formatLongDate(date: Date): string {
  return longDate.format(date);
}

/** Miércoles, 18 de noviembre */
export function formatWeekdayDate(date: Date): string {
  return capitalize(weekdayDate.format(date));
}

/** 18 de noviembre */
export function formatDayMonth(date: Date): string {
  return dayMonth.format(date);
}

/** Jue */
export function formatShortWeekday(date: Date): string {
  return capitalize(shortWeekday.format(date).replace(".", ""));
}

/** Noviembre 2026 */
export function formatMonthYear(date: Date): string {
  return `${capitalize(monthName.format(date))} ${date.getFullYear()}`;
}

export function formatClock(date: Date): { hoursMinutes: string; seconds: string } {
  return {
    hoursMinutes: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
    seconds: pad(date.getSeconds()),
  };
}

/** Ahora · Hace 2 min · Hace 3 h · Hace 4 d */
export function formatRelative(from: Date, now: Date): string {
  const minutes = Math.floor((now.getTime() - from.getTime()) / 60_000);
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return `Hace ${Math.floor(hours / 24)} d`;
}

/** 2026-11-18 en hora local, para el atributo dateTime. */
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
