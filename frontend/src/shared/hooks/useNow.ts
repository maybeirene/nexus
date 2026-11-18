import { useEffect, useState } from "react";

/**
 * Hora actual, refrescada cada `intervalMs`.
 * Devuelve `null` hasta montar para que servidor y cliente pinten lo mismo.
 */
export function useNow(intervalMs = 1000): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
