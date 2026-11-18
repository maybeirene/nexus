import { cn } from "../lib/cn";
import { type Tone, toneBg } from "../lib/tone";

export type StatusDotProps = {
  tone: Tone;
  className?: string;
};

/** Punto decorativo. Siempre debe ir junto a un texto que diga lo mismo. */
export function StatusDot({ tone, className }: StatusDotProps) {
  return (
    <span aria-hidden="true" className={cn("inline-block size-2 shrink-0 rounded-full", toneBg[tone], className)} />
  );
}
