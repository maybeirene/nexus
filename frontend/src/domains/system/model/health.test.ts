import { describe, expect, it } from "vitest";
import { deriveAssistantStatus, type Health } from "./health";

const healthy: Health = { status: "ok", database: "ok", ollama: "ok", model: "qwen3:4b", model_ready: true };

describe("deriveAssistantStatus", () => {
  it("está disponible cuando Ollama y el modelo responden", () => {
    expect(deriveAssistantStatus(healthy, null)).toMatchObject({ state: "ready", label: "Disponible" });
  });

  it("avisa de que falta el modelo con el comando para descargarlo", () => {
    const status = deriveAssistantStatus({ ...healthy, status: "degraded", model_ready: false }, null);
    expect(status.state).toBe("model-missing");
    expect(status.hint).toContain("ollama pull qwen3:4b");
  });

  it("detecta Ollama apagado", () => {
    const status = deriveAssistantStatus({ ...healthy, ollama: "unavailable", model_ready: false }, null);
    expect(status.state).toBe("llm-down");
  });

  it("prioriza el error de red sobre datos anteriores", () => {
    expect(deriveAssistantStatus(healthy, new Error("x")).state).toBe("offline");
  });
});
