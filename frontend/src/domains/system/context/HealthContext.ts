import { createContext } from "react";
import type { AssistantStatus, Health } from "../model/health";

export type HealthContextValue = {
  health: Health | null;
  status: AssistantStatus;
  refresh: () => Promise<void>;
};

export const HealthContext = createContext<HealthContextValue | null>(null);
