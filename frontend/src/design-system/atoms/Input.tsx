import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export const fieldClass =
  "w-full min-w-0 rounded-control border border-line bg-elevated px-3 text-body text-fg placeholder:text-muted transition-colors focus-visible:border-accent focus-visible:outline-none disabled:opacity-50";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return <input className={cn(fieldClass, "h-10", className)} {...props} />;
}
