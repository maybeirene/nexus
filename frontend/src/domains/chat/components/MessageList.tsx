import { useEffect, useRef } from "react";
import { ScrollArea } from "../../../design-system/atoms/ScrollArea";
import { TypingDots } from "../../../design-system/atoms/TypingDots";
import type { ChatMessage } from "../model/types";
import { AssistantBlock, MessageBubble } from "./MessageBubble";

type MessageListProps = {
  messages: ChatMessage[];
  pending: boolean;
  onRetry: (id: string) => void;
};

export function MessageList({ messages, pending, onRetry }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages, pending]);

  return (
    <ScrollArea ref={scrollRef}>
      <ol role="log" aria-label="Mensajes" className="mx-auto flex max-w-[720px] flex-col gap-5 px-5 py-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} onRetry={onRetry} canRetry={!pending} />
        ))}
        {pending ? (
          <li className="flex">
            <AssistantBlock>
              <TypingDots label="NEXUS está escribiendo" className="h-5" />
            </AssistantBlock>
          </li>
        ) : null}
      </ol>
    </ScrollArea>
  );
}
