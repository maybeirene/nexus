import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type PanelHeaderProps = {
  title: string;
  titleId: string;
  action?: ReactNode;
  /** Cabecera destacada con separador inferior, para el módulo protagonista. */
  prominent?: boolean;
};

export function PanelHeader({ title, titleId, action, prominent = false }: PanelHeaderProps) {
  return (
    <header
      className={cn(
        "flex min-h-7 shrink-0 items-center justify-between gap-2",
        prominent ? "border-b border-line px-5 py-3" : "px-3 pt-3",
      )}
    >
      <h2
        id={titleId}
        className={prominent ? "text-body font-semibold text-fg" : "text-caption font-medium text-muted"}
      >
        {title}
      </h2>
      {action ? <div className="flex items-center gap-1">{action}</div> : null}
    </header>
  );
}
