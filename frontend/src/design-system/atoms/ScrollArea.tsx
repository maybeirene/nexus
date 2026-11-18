import { type HTMLAttributes, type Ref } from "react";
import { cn } from "../lib/cn";

export type ScrollAreaProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
};

/** Único sitio donde se permite scroll: dentro de las listas de cada módulo. */
export function ScrollArea({ className, ...props }: ScrollAreaProps) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", className)} {...props} />;
}
