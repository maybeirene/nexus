import type { WeatherKind } from "./types";

type WeatherDescription = { label: string; kind: WeatherKind };

/** Códigos WMO que devuelve Open-Meteo. */
const CODES: Record<number, WeatherDescription> = {
  0: { label: "Despejado", kind: "clear" },
  1: { label: "Casi despejado", kind: "partly-cloudy" },
  2: { label: "Parcialmente nuboso", kind: "partly-cloudy" },
  3: { label: "Nublado", kind: "cloudy" },
  45: { label: "Niebla", kind: "fog" },
  48: { label: "Niebla con escarcha", kind: "fog" },
  51: { label: "Llovizna débil", kind: "drizzle" },
  53: { label: "Llovizna", kind: "drizzle" },
  55: { label: "Llovizna intensa", kind: "drizzle" },
  56: { label: "Llovizna helada", kind: "drizzle" },
  57: { label: "Llovizna helada", kind: "drizzle" },
  61: { label: "Lluvia débil", kind: "rain" },
  63: { label: "Lluvia", kind: "rain" },
  65: { label: "Lluvia fuerte", kind: "rain" },
  66: { label: "Lluvia helada", kind: "rain" },
  67: { label: "Lluvia helada", kind: "rain" },
  71: { label: "Nieve débil", kind: "snow" },
  73: { label: "Nieve", kind: "snow" },
  75: { label: "Nieve intensa", kind: "snow" },
  77: { label: "Granizo fino", kind: "snow" },
  80: { label: "Chubascos", kind: "rain" },
  81: { label: "Chubascos", kind: "rain" },
  82: { label: "Chubascos fuertes", kind: "rain" },
  85: { label: "Chubascos de nieve", kind: "snow" },
  86: { label: "Chubascos de nieve", kind: "snow" },
  95: { label: "Tormenta", kind: "storm" },
  96: { label: "Tormenta con granizo", kind: "storm" },
  99: { label: "Tormenta con granizo", kind: "storm" },
};

const UNKNOWN: WeatherDescription = { label: "Sin datos", kind: "cloudy" };

export function describeWeather(code: number): WeatherDescription {
  return CODES[code] ?? UNKNOWN;
}
