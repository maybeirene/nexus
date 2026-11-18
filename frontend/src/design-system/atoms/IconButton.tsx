import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

type IconButtonSize = "sm" | "md";

const sizes: Record<IconButtonSize, { box: string; icon: number }> = {
  sm: { box: "size-6 rounded-inner", icon: 14 },
  md: { box: "size-10 rounded-control border border-line bg-elevated", icon: 18 },
};

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icon: LucideIcon;
  /** Obligatorio: un botón sin texto necesita nombre accesible. */
  "aria-label": string;
  size?: IconButtonSize;
};

export function IconButton({
  icon: Icon,
  size = "sm",
  type = "button",
  className,
  ...props
}: IconButtonProps) {
  const { box, icon } = sizes[size];
  return (
    <button
      type={type}
      title={props["aria-label"]}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center text-muted transition-colors hover:bg-elevated hover:text-fg disabled:cursor-not-allowed disabled:opacity-40",
        box,
        className,
      )}
      {...props}
    >
      <Icon size={icon} aria-hidden="true" />
    </button>
  );
}
