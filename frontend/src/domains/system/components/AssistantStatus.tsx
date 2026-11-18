import { StatusIndicator } from "../../../design-system/molecules/StatusIndicator";
import { useHealth } from "../context/useHealth";

export function AssistantStatus() {
  const { health, status } = useHealth();
  const hint = status.hint || (health ? `Modelo ${health.model}` : undefined);
  return <StatusIndicator tone={status.tone} label={status.label} hint={hint} />;
}
