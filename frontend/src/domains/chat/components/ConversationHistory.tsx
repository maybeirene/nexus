import { X } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef } from "react";
import { Alert } from "../../../design-system/molecules/Alert";
import { EmptyState } from "../../../design-system/molecules/EmptyState";
import { IconButton } from "../../../design-system/atoms/IconButton";
import { ScrollArea } from "../../../design-system/atoms/ScrollArea";
import { useNow } from "../../../shared/hooks/useNow";
import type { ConversationSummary } from "../model/types";
import { ConversationItem } from "./ConversationItem";

type ConversationHistoryProps = {
  id: string;
  conversations: ConversationSummary[];
  activeId: string | null;
  error: string | null;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

export function ConversationHistory({
  id,
  conversations,
  activeId,
  error,
  onOpen,
  onDelete,
  onClose,
}: ConversationHistoryProps) {
  const now = useNow(60_000);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") onClose();
  };

  return (
    <aside
      id={id}
      ref={containerRef}
      tabIndex={-1}
      aria-label="Historial de conversaciones"
      onKeyDown={onKeyDown}
      className="absolute inset-y-0 left-0 z-10 flex w-72 max-w-full flex-col border-r border-line bg-surface focus-visible:outline-none"
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <h3 className="text-caption font-medium text-muted">Historial</h3>
        <IconButton icon={X} aria-label="Cerrar historial" onClick={onClose} />
      </div>
      {error ? <Alert className="mx-3 mb-2" title={error} /> : null}
      <ScrollArea className="px-2 pb-2">
        {conversations.length === 0 ? (
          <EmptyState title="Sin conversaciones" description="Lo que hables con NEXUS se guarda aquí." />
        ) : (
          <ul className="flex flex-col gap-1">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                active={conversation.id === activeId}
                now={now}
                onOpen={onOpen}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </ScrollArea>
    </aside>
  );
}
