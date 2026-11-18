import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full border border-line bg-elevated px-2 text-caption text-fg tabular-nums",
        className,
      )}
    >
      {children}
    </span>
  );
}
