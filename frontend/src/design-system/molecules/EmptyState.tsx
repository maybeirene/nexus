import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type EmptyStateProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  size?: "sm" | "lg";
  className?: string;
};

export function EmptyState({ title, description, children, size = "sm", className }: EmptyStateProps) {
  const large = size === "lg";
  return (
    <div className={cn("flex h-full flex-col items-center justify-center text-center", large ? "gap-2" : "gap-1 py-6", className)}>
      <p className={cn("font-semibold text-fg", large ? "text-title" : "text-body")}>{title}</p>
      {description ? <p className={cn("text-muted", large ? "text-body" : "text-caption")}>{description}</p> : null}
      {children ? <div className={large ? "mt-4" : "mt-2"}>{children}</div> : null}
    </div>
  );
}
