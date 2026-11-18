import { describe, expect, it } from "vitest";
import { describeWeather } from "./weatherCodes";

describe("describeWeather", () => {
  it("traduce códigos WMO conocidos", () => {
    expect(describeWeather(0)).toEqual({ label: "Despejado", kind: "clear" });
    expect(describeWeather(63)).toEqual({ label: "Lluvia", kind: "rain" });
  });

  it("no rompe con códigos desconocidos", () => {
    expect(describeWeather(42).label).toBe("Sin datos");
  });
});
