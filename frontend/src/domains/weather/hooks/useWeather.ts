import { useCallback } from "react";
import { usePolledResource } from "../../../shared/hooks/usePolledResource";
import { fetchWeather } from "../api/openMeteo";
import { type Location, MADRID } from "../model/types";

const WEATHER_INTERVAL_MS = 15 * 60_000;

export function useWeather(location: Location = MADRID) {
  const fetcher = useCallback((signal: AbortSignal) => fetchWeather(location, signal), [location]);
  return usePolledResource(fetcher, WEATHER_INTERVAL_MS);
}
