import { type ReactNode, useMemo } from "react";
import { usePolledResource } from "../../../shared/hooks/usePolledResource";
import { getHealth } from "../api/healthApi";
import { deriveAssistantStatus } from "../model/health";
import { HealthContext, type HealthContextValue } from "./HealthContext";

const HEALTH_INTERVAL_MS = 30_000;

/** Una sola consulta de salud compartida por la barra de estado y el chat. */
export function HealthProvider({ children }: { children: ReactNode }) {
  const { data, error, reload } = usePolledResource(getHealth, HEALTH_INTERVAL_MS);

  const value = useMemo<HealthContextValue>(
    () => ({ health: data, status: deriveAssistantStatus(data, error), refresh: reload }),
    [data, error, reload],
  );

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}
