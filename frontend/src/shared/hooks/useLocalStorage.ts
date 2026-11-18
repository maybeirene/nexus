import { useCallback, useEffect, useState } from "react";

function read<T>(key: string, fallback: () => T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback() : (JSON.parse(raw) as T);
  } catch {
    return fallback();
  }
}

export function useLocalStorage<T>(key: string, initial: () => T) {
  const [value, setValue] = useState<T>(() => read(key, initial));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Almacenamiento lleno o bloqueado: el estado sigue en memoria.
    }
  }, [key, value]);

  const update = useCallback((next: T | ((previous: T) => T)) => setValue(next), []);

  return [value, update] as const;
}
