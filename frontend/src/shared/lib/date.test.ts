import { describe, expect, it } from "vitest";
import { formatClock, formatLongDate, formatMonthYear, formatRelative, formatWeekdayDate } from "./date";

const date = new Date(2026, 10, 18, 13, 2, 9);

describe("date", () => {
  it("formatea fechas en español", () => {
    expect(formatLongDate(date)).toBe("18 de noviembre de 2026");
    expect(formatWeekdayDate(date)).toBe("Miércoles, 18 de noviembre");
    expect(formatMonthYear(date)).toBe("Noviembre 2026");
  });

  it("separa la hora de los segundos con ceros a la izquierda", () => {
    expect(formatClock(date)).toEqual({ hoursMinutes: "13:02", seconds: "09" });
  });

  it("expresa tiempos relativos cortos", () => {
    const minutesAgo = (value: number) => new Date(date.getTime() - value * 60_000);
    expect(formatRelative(minutesAgo(0), date)).toBe("Ahora");
    expect(formatRelative(minutesAgo(2), date)).toBe("Hace 2 min");
    expect(formatRelative(minutesAgo(180), date)).toBe("Hace 3 h");
    expect(formatRelative(minutesAgo(60 * 49), date)).toBe("Hace 2 d");
  });
});
