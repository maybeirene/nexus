import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "../../../shared/api/http";
import { deleteConversation, listConversations } from "../api/chatApi";
import type { ConversationSummary } from "../model/types";

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setConversations(await listConversations());
      setError(null);
    } catch (caught) {
      setError(errorMessage(caught, "No he podido cargar el historial."));
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    try {
      await deleteConversation(id);
      setConversations((current) => current.filter((item) => item.id !== id));
      setError(null);
      return true;
    } catch (caught) {
      setError(errorMessage(caught, "No he podido borrar la conversación."));
      return false;
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { conversations, error, refresh, remove };
}
