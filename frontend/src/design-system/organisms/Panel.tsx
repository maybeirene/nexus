import { type ReactNode, useId } from "react";
import { cn } from "../lib/cn";
import { PanelHeader } from "../molecules/PanelHeader";

export type PanelProps = {
  title: string;
  action?: ReactNode;
  prominent?: boolean;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

/** Tarjeta común a todos los módulos. El cuerpo se ajusta al alto disponible. */
export function Panel({ title, action, prominent, children, className, bodyClassName }: PanelProps) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className={cn("flex min-h-0 flex-col overflow-hidden rounded-control border border-line bg-surface", className)}
    >
      <PanelHeader title={title} titleId={titleId} action={action} prominent={prominent} />
      <div className={cn("flex min-h-0 flex-1 flex-col", prominent ? "" : "p-3", bodyClassName)}>{children}</div>
    </section>
  );
}
