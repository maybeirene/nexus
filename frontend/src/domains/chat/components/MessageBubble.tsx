import type { ReactNode } from "react";
import { Button } from "../../../design-system/atoms/Button";
import { cn } from "../../../design-system/lib/cn";
import type { ChatMessage } from "../model/types";

const ASSISTANT_NAME = "NEXUS";

export function AssistantBlock({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-[85%] flex-col gap-1">
      <span className="text-caption font-medium tracking-[0.08em] text-muted">{ASSISTANT_NAME}</span>
      {children}
    </div>
  );
}

type MessageBubbleProps = {
  message: ChatMessage;
  onRetry: (id: string) => void;
  canRetry: boolean;
};

export function MessageBubble({ message, onRetry, canRetry }: MessageBubbleProps) {
  if (message.role === "assistant") {
    return (
      <li className="flex">
        <AssistantBlock>
          <p className="whitespace-pre-wrap break-words text-fg">{message.content}</p>
        </AssistantBlock>
      </li>
    );
  }

  const failed = message.status === "failed";
  return (
    <li className="flex flex-col items-end gap-1">
      <p
        className={cn(
          "max-w-[80%] whitespace-pre-wrap break-words rounded-control bg-elevated px-3 py-2 text-fg",
          message.status === "sending" && "opacity-70",
          failed && "border border-danger/50",
        )}
      >
        {message.content}
      </p>
      {failed ? (
        <div className="flex max-w-[80%] items-center gap-2 text-caption">
          <span className="text-danger">No enviado: {message.error}</span>
          <Button variant="ghost" size="sm" disabled={!canRetry} onClick={() => onRetry(message.id)}>
            Reintentar
          </Button>
        </div>
      ) : null}
    </li>
  );
}
