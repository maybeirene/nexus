import { describe, expect, it } from "vitest";
import { countUnread, dismiss, markAllRead, markRead, seedNotifications } from "./notification";

const seed = seedNotifications(new Date(2026, 10, 18, 13, 0));

describe("notification", () => {
  it("marca como leído solo el aviso indicado", () => {
    expect(countUnread(seed)).toBe(2);
    expect(countUnread(markRead(seed, "n-1"))).toBe(1);
  });

  it("marca todos como leídos", () => {
    expect(countUnread(markAllRead(seed))).toBe(0);
  });

  it("descarta un aviso", () => {
    expect(dismiss(seed, "n-2").some((item) => item.id === "n-2")).toBe(false);
  });
});
