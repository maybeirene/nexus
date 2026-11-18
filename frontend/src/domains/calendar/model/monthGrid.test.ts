import { describe, expect, it } from "vitest";
import { addMonths, buildMonthGrid } from "./monthGrid";

describe("buildMonthGrid", () => {
  const weeks = buildMonthGrid(new Date(2026, 10, 1));

  it("genera seis semanas de siete días", () => {
    expect(weeks).toHaveLength(6);
    weeks.forEach((week) => expect(week).toHaveLength(7));
  });

  it("empieza en lunes con los días del mes anterior en gris", () => {
    const first = weeks[0][0];
    expect(first.date.getDay()).toBe(1);
    expect(first.date.getDate()).toBe(26);
    expect(first.inMonth).toBe(false);
    expect(weeks[0][6]).toMatchObject({ inMonth: true });
    expect(weeks[0][6].date.getDate()).toBe(1);
  });

  it("acaba con los días del mes siguiente", () => {
    const last = weeks[5][6];
    expect(last.date.getMonth()).toBe(11);
    expect(last.date.getDate()).toBe(6);
  });
});

describe("addMonths", () => {
  it("cruza el cambio de año", () => {
    const next = addMonths(new Date(2026, 11, 31), 1);
    expect([next.getFullYear(), next.getMonth(), next.getDate()]).toEqual([2027, 0, 1]);
  });
});
