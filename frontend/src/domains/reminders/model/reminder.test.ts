import { describe, expect, it } from "vitest";
import { countPending, createReminder, removeReminder, seedReminders, toggleReminder } from "./reminder";

describe("reminder", () => {
  it("ignora textos vacíos y recorta espacios", () => {
    expect(createReminder("   ")).toBeNull();
    expect(createReminder("  Revisar motores ", "a")).toEqual({ id: "a", text: "Revisar motores", done: false });
  });

  it("cuenta solo los pendientes", () => {
    const list = seedReminders();
    expect(countPending(list)).toBe(2);
    expect(countPending(toggleReminder(list, "seed-1"))).toBe(1);
  });

  it("borra por id sin tocar el resto", () => {
    const list = removeReminder(seedReminders(), "seed-2");
    expect(list.map((item) => item.id)).toEqual(["seed-1", "seed-3"]);
  });
});
