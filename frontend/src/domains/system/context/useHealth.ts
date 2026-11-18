import { useContext } from "react";
import { HealthContext } from "./HealthContext";

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) throw new Error("useHealth debe usarse dentro de <HealthProvider>");
  return context;
}
