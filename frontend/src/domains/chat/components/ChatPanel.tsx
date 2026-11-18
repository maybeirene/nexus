import { History, SquarePen } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { Alert } from "../../../design-system/molecules/Alert";
import { Panel } from "../../../design-system/organisms/Panel";
import { IconButton } from "../../../design-system/atoms/IconButton";
import { AssistantStatus } from "../../system/components/AssistantStatus";
import { useChat } from "../hooks/useChat";
import { useConversations } from "../hooks/useConversations";
import { AssistantNotice } from "./AssistantNotice";
import { ChatComposer } from "./ChatComposer";
import { ChatWelcome } from "./ChatWelcome";
import { ConversationHistory } from "./ConversationHistory";
import { MessageList } from "./MessageList";

export function ChatPanel() {
  const historyId = useId();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const history = useConversations();
  const refreshHistory = history.refresh;
  const onPersisted = useCallback(() => void refreshHistory(), [refreshHistory]);
  const chat = useChat({ onPersisted });

  const submit = (text: string) => {
    if (chat.send(text)) setDraft("");
  };

  const openConversation = (id: string) => {
    setHistoryOpen(false);
    setDraft("");
    void chat.open(id);
  };

  const startNew = () => {
    setHistoryOpen(false);
    setDraft("");
    chat.startNew();
  };

  const deleteConversation = async (id: string) => {
    const deleted = await history.remove(id);
    if (deleted && id === chat.conversationId) chat.startNew();
  };

  const isEmpty = chat.messages.length === 0;

  return (
    <Panel
      title="Chat"
      prominent
      className="h-full"
      action={
        <>
          <AssistantStatus />
          <span aria-hidden="true" className="mx-2 h-4 w-px bg-line" />
          <IconButton
            icon={History}
            aria-label={historyOpen ? "Cerrar historial" : "Ver historial"}
            aria-expanded={historyOpen}
            aria-controls={historyId}
            onClick={() => setHistoryOpen((open) => !open)}
          />
          <IconButton icon={SquarePen} aria-label="Nueva conversación" onClick={startNew} disabled={isEmpty && !chat.conversationId} />
        </>
      }
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        {historyOpen ? (
          <ConversationHistory
            id={historyId}
            conversations={history.conversations}
            activeId={chat.conversationId}
            error={history.error}
            onOpen={openConversation}
            onDelete={(id) => void deleteConversation(id)}
            onClose={() => setHistoryOpen(false)}
          />
        ) : null}

        {chat.loadError ? (
          <div className="mx-auto w-full max-w-[720px] px-5 py-6">
            <Alert title={chat.loadError} />
          </div>
        ) : null}

        {isEmpty && !chat.loadError ? (
          <div className="flex min-h-0 flex-1 items-center justify-center px-5">
            <ChatWelcome onPick={submit} disabled={chat.pending} />
          </div>
        ) : (
          <MessageList messages={chat.messages} pending={chat.pending} onRetry={chat.retry} />
        )}

        <AssistantNotice />
        <ChatComposer value={draft} onChange={setDraft} onSubmit={submit} busy={chat.pending} />
      </div>
    </Panel>
  );
}
