import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../design-system/atoms/Button";
import { IconButton } from "../../../design-system/atoms/IconButton";
import { cn } from "../../../design-system/lib/cn";
import { formatRelative } from "../../../shared/lib/date";
import type { ConversationSummary } from "../model/types";

type ConversationItemProps = {
  conversation: ConversationSummary;
  active: boolean;
  now: Date | null;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ConversationItem({ conversation, active, now, onOpen, onDelete }: ConversationItemProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <li className="flex items-center justify-between gap-2 rounded-control bg-elevated px-3 py-2">
        <span className="truncate text-caption text-fg">¿Borrar esta conversación?</span>
        <div className="flex shrink-0 gap-1">
          <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
            Cancelar
          </Button>
          <Button size="sm" className="text-danger" onClick={() => onDelete(conversation.id)}>
            Borrar
          </Button>
        </div>
      </li>
    );
  }

  return (
    <li className="group relative">
      <button
        type="button"
        aria-current={active ? "true" : undefined}
        onClick={() => onOpen(conversation.id)}
        className={cn(
          "flex w-full cursor-pointer flex-col gap-0.5 rounded-control border-l-2 px-3 py-2 pr-9 text-left transition-colors hover:bg-elevated",
          active ? "border-accent bg-elevated" : "border-transparent",
        )}
      >
        <span className="truncate text-fg">{conversation.title}</span>
        {now ? (
          <span className="text-caption text-muted tabular-nums">{formatRelative(conversation.updatedAt, now)}</span>
        ) : null}
      </button>
      <IconButton
        icon={Trash2}
        aria-label={`Borrar «${conversation.title}»`}
        onClick={() => setConfirming(true)}
        className="absolute top-2 right-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100"
      />
    </li>
  );
}
