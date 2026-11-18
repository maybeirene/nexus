import { ApiError, request } from "../../../shared/api/http";
import type { Location, Weather } from "../model/types";

type ForecastDto = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

const ENDPOINT = "https://api.open-meteo.com/v1/forecast";
const FORECAST_DAYS = 3;

/** "2026-11-19" en hora local, sin desfase de zona horaria. */
function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export async function fetchWeather(location: Location, signal?: AbortSignal): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: location.timezone,
    current: "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    forecast_days: String(FORECAST_DAYS + 1),
  });

  let dto: ForecastDto;
  try {
    dto = await request<ForecastDto>(`${ENDPOINT}?${params}`, { signal });
  } catch (caught) {
    if (caught instanceof ApiError) {
      throw new ApiError("Open-Meteo no responde. Comprueba la conexión a internet.", caught.status);
    }
    throw caught;
  }

  const { current, daily } = dto;
  return {
    current: {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      code: current.weather_code,
    },
    // El índice 0 es hoy: la previsión empieza mañana.
    forecast: daily.time.slice(1, FORECAST_DAYS + 1).map((day, offset) => {
      const index = offset + 1;
      return {
        date: parseLocalDate(day),
        max: daily.temperature_2m_max[index],
        min: daily.temperature_2m_min[index],
        code: daily.weather_code[index],
      };
    }),
  };
}
