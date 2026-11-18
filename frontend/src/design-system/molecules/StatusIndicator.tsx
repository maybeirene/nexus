import { StatusDot } from "../atoms/StatusDot";
import { cn } from "../lib/cn";
import type { Tone } from "../lib/tone";

export type StatusIndicatorProps = {
  tone: Tone;
  label: string;
  /** Explicación ampliada, visible al pasar el cursor. */
  hint?: string;
  className?: string;
};

export function StatusIndicator({ tone, label, hint, className }: StatusIndicatorProps) {
  return (
    <span title={hint} className={cn("inline-flex items-center gap-2 text-caption text-muted", className)}>
      <StatusDot tone={tone} />
      <span>{label}</span>
    </span>
  );
}
