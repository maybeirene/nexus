import { Droplets, Wind } from "lucide-react";
import type { CurrentWeather } from "../model/types";
import { describeWeather } from "../model/weatherCodes";
import { WeatherIcon } from "./WeatherIcon";
import { WeatherMetric } from "./WeatherMetric";

export function WeatherCurrent({ current }: { current: CurrentWeather }) {
  const { label, kind } = describeWeather(current.code);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-display font-semibold text-fg tabular-nums">{Math.round(current.temperature)}°</p>
          <p className="mt-1 text-caption text-muted">{label}</p>
        </div>
        <WeatherIcon kind={kind} size={32} className="mt-1 text-muted" />
      </div>
      <dl className="flex items-center gap-4">
        <WeatherMetric icon={Droplets} label="Humedad" value={`${Math.round(current.humidity)}%`} />
        <WeatherMetric icon={Wind} label="Viento" value={`${Math.round(current.windSpeed)} km/h`} />
      </dl>
    </div>
  );
}
