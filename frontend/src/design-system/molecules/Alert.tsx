import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { type Tone, toneText } from "../lib/tone";

export type AlertProps = {
  tone?: Exclude<Tone, "success">;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function Alert({ tone = "danger", title, children, action, className }: AlertProps) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-control border border-line bg-elevated p-3 text-caption", className)}
    >
      <CircleAlert size={16} aria-hidden="true" className={cn("mt-px shrink-0", toneText[tone])} />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-body font-medium text-fg">{title}</p>
        {children ? <div className="text-muted">{children}</div> : null}
        {action ? <div className="pt-1">{action}</div> : null}
      </div>
    </div>
  );
}
