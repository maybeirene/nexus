import { formatShortWeekday } from "@/shared/lib/date";
import type { DailyForecast } from "../model/types";
import { describeWeather } from "../model/weatherCodes";
import { WeatherIcon } from "./WeatherIcon";

export function ForecastDay({ day }: { day: DailyForecast }) {
  const { label, kind } = describeWeather(day.code);
  const max = Math.round(day.max);
  const min = Math.round(day.min);

  return (
    <li
      className="flex flex-col items-center gap-1.5"
      aria-label={`${formatShortWeekday(day.date)}: ${label}, máxima ${max}°, mínima ${min}°`}
    >
      <span className="text-caption text-muted" aria-hidden="true">
        {formatShortWeekday(day.date)}
      </span>
      <WeatherIcon kind={kind} className="text-muted" />
      <span className="text-caption tabular-nums" aria-hidden="true">
        <span className="font-medium text-fg">{max}°</span> <span className="text-muted">{min}°</span>
      </span>
    </li>
  );
}
