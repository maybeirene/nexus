import { type TextareaHTMLAttributes, useLayoutEffect, useRef } from "react";
import { cn } from "../lib/cn";
import { fieldClass } from "./Input";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Altura máxima en píxeles al crecer con el contenido. */
  maxHeight?: number;
};

export function Textarea({ className, maxHeight = 160, value, ...props }: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = "auto";
    const borders = element.offsetHeight - element.clientHeight;
    const target = element.scrollHeight + borders;
    element.style.height = `${Math.min(target, maxHeight)}px`;
    element.style.overflowY = target > maxHeight ? "auto" : "hidden";
  }, [value, maxHeight]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      className={cn(fieldClass, "block resize-none py-[9px] leading-5", className)}
      {...props}
    />
  );
}
