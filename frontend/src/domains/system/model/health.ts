import type { Tone } from "../../../design-system/lib/tone";

/** Respuesta de GET /api/v1/health. */
export type Health = {
  status: "ok" | "degraded";
  database: string;
  ollama: "ok" | "unavailable";
  model: string;
  model_ready: boolean;
};

export type AssistantState = "checking" | "ready" | "offline" | "llm-down" | "model-missing";

export type AssistantStatus = {
  state: AssistantState;
  tone: Tone;
  label: string;
  /** Qué ha pasado y cómo arreglarlo. Vacío cuando todo va bien. */
  hint: string;
};

export function deriveAssistantStatus(health: Health | null, error: Error | null): AssistantStatus {
  if (error) {
    return {
      state: "offline",
      tone: "danger",
      label: "Sin conexión",
      hint: "No hay respuesta del servidor de NEXUS. Arráncalo con: cd backend && uv run uvicorn app.main:app --port 8000",
    };
  }
  if (!health) {
    return { state: "checking", tone: "neutral", label: "Comprobando", hint: "" };
  }
  if (health.ollama !== "ok") {
    return {
      state: "llm-down",
      tone: "warning",
      label: "Ollama apagado",
      hint: "Ollama no responde. Ábrelo o ejecuta: ollama serve",
    };
  }
  if (!health.model_ready) {
    return {
      state: "model-missing",
      tone: "warning",
      label: "Falta el modelo",
      hint: `El modelo ${health.model} no está descargado. Ejecuta: ollama pull ${health.model}`,
    };
  }
  return { state: "ready", tone: "success", label: "Disponible", hint: "" };
}
