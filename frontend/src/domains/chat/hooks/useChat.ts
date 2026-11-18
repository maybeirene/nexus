import { useCallback, useRef, useState } from "react";
import { errorMessage } from "../../../shared/api/http";
import { getConversationMessages, sendChatMessage } from "../api/chatApi";
import type { ChatMessage } from "../model/types";

type UseChatOptions = {
  /** Se llama cuando el backend guarda un intercambio nuevo. */
  onPersisted?: () => void;
};

export function useChat({ onPersisted }: UseChatOptions = {}) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const conversationRef = useRef<string | null>(null);
  // Cambia al abrir otra conversación para descartar respuestas que lleguen tarde.
  const sessionRef = useRef(0);

  const selectConversation = (id: string | null) => {
    conversationRef.current = id;
    setConversationId(id);
  };

  const patchMessage = (id: string, patch: Partial<ChatMessage>) =>
    setMessages((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const deliver = useCallback(
    async (message: ChatMessage) => {
      const session = sessionRef.current;
      setPending(true);
      try {
        const result = await sendChatMessage(message.content, conversationRef.current);
        if (session !== sessionRef.current) return;
        selectConversation(result.conversationId);
        setMessages((current) => [
          ...current.map((item) => (item.id === message.id ? { ...item, status: "sent" as const } : item)),
          { id: crypto.randomUUID(), role: "assistant", content: result.reply, status: "sent" },
        ]);
        onPersisted?.();
      } catch (caught) {
        if (session !== sessionRef.current) return;
        patchMessage(message.id, { status: "failed", error: errorMessage(caught, "No he podido enviar el mensaje.") });
      } finally {
        if (session === sessionRef.current) setPending(false);
      }
    },
    [onPersisted],
  );

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || pending) return false;
      const message: ChatMessage = { id: crypto.randomUUID(), role: "user", content, status: "sending" };
      setMessages((current) => [...current, message]);
      void deliver(message);
      return true;
    },
    [deliver, pending],
  );

  const retry = useCallback(
    (id: string) => {
      const message = messages.find((item) => item.id === id);
      if (!message || message.status !== "failed" || pending) return;
      patchMessage(id, { status: "sending", error: undefined });
      void deliver(message);
    },
    [deliver, messages, pending],
  );

  const startNew = useCallback(() => {
    sessionRef.current += 1;
    selectConversation(null);
    setMessages([]);
    setPending(false);
    setLoadError(null);
  }, []);

  const open = useCallback(async (id: string) => {
    sessionRef.current += 1;
    const session = sessionRef.current;
    selectConversation(id);
    setPending(false);
    setLoadError(null);
    try {
      const loaded = await getConversationMessages(id);
      if (session === sessionRef.current) setMessages(loaded);
    } catch (caught) {
      if (session !== sessionRef.current) return;
      setMessages([]);
      setLoadError(errorMessage(caught, "No he podido abrir la conversación."));
    }
  }, []);

  return { conversationId, messages, pending, loadError, send, retry, open, startNew };
}
