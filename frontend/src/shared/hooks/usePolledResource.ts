import { useCallback, useEffect, useRef, useState } from "react";

type ResourceState<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

/** Carga un recurso al montar y lo refresca cada `intervalMs`. */
export function usePolledResource<T>(fetcher: (signal: AbortSignal) => Promise<T>, intervalMs: number) {
  const [state, setState] = useState<ResourceState<T>>({ data: null, error: null, loading: true });
  const fetcherRef = useRef(fetcher);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const reload = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setState((previous) => ({ ...previous, loading: true }));
    try {
      const data = await fetcherRef.current(controller.signal);
      if (!controller.signal.aborted) setState({ data, error: null, loading: false });
    } catch (caught) {
      if (controller.signal.aborted) return;
      const error = caught instanceof Error ? caught : new Error(String(caught));
      setState((previous) => ({ data: previous.data, error, loading: false }));
    }
  }, []);

  useEffect(() => {
    void reload();
    const id = window.setInterval(() => void reload(), intervalMs);
    return () => {
      window.clearInterval(id);
      controllerRef.current?.abort();
    };
  }, [reload, intervalMs]);

  return { ...state, reload };
}
