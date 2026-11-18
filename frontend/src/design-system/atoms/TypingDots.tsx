import { cn } from "../lib/cn";

export type TypingDotsProps = {
  label?: string;
  className?: string;
};

export function TypingDots({ label = "Escribiendo", className }: TypingDotsProps) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-1", className)}>
      <span className="sr-only">{label}</span>
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          aria-hidden="true"
          className="size-1.5 animate-typing rounded-full bg-muted"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}
