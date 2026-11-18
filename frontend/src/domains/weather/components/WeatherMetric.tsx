import type { LucideIcon } from "lucide-react";

type WeatherMetricProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function WeatherMetric({ icon: Icon, label, value }: WeatherMetricProps) {
  return (
    <div className="flex items-center gap-1.5 text-caption text-muted">
      <Icon size={14} aria-hidden="true" />
      <dt className="sr-only">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
