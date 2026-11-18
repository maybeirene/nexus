import { X } from "lucide-react";
import { cn } from "../../../design-system/lib/cn";
import { IconButton } from "../../../design-system/atoms/IconButton";
import { StatusDot } from "../../../design-system/atoms/StatusDot";
import { type Tone } from "../../../design-system/lib/tone";
import { formatRelative } from "../../../shared/lib/date";
import { LEVEL_LABEL, type Notification, type NotificationLevel } from "../model/notification";

const LEVEL_TONE: Record<NotificationLevel, Tone> = {
  info: "neutral",
  success: "success",
  warning: "warning",
  danger: "danger",
};

type NotificationItemProps = {
  notification: Notification;
  now: Date | null;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
};

export function NotificationItem({ notification, now, onRead, onDismiss }: NotificationItemProps) {
  const { id, title, level, createdAt, read } = notification;
  const meta = [now ? formatRelative(createdAt, now) : null, read ? null : "Sin leer"].filter(Boolean).join(" · ");

  return (
    <li className="group relative">
      <button
        type="button"
        onClick={() => onRead(id)}
        className="flex w-full cursor-pointer items-start gap-3 rounded-inner py-2 pr-7 pl-1 text-left transition-colors hover:bg-elevated/50"
      >
        <StatusDot tone={LEVEL_TONE[level]} className="mt-1.5" />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="sr-only">{LEVEL_LABEL[level]}:</span>
          <span className={cn("break-words text-fg", !read && "font-medium")}>{title}</span>
          <span className="text-caption text-muted tabular-nums">{meta}</span>
        </span>
      </button>
      <IconButton
        icon={X}
        aria-label={`Descartar «${title}»`}
        onClick={() => onDismiss(id)}
        className="absolute top-2 right-0 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100"
      />
    </li>
  );
}
