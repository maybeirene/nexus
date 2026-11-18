import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  type LucideIcon,
  Sun,
} from "lucide-react";
import type { WeatherKind } from "../model/types";

const ICONS: Record<WeatherKind, LucideIcon> = {
  clear: Sun,
  "partly-cloudy": CloudSun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
};

type WeatherIconProps = {
  kind: WeatherKind;
  size?: number;
  className?: string;
};

/** Decorativo: el estado siempre se acompaña de su descripción en texto. */
export function WeatherIcon({ kind, size = 16, className }: WeatherIconProps) {
  const Icon = ICONS[kind];
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" className={className} />;
}
