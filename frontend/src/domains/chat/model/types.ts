export type MessageRole = "user" | "assistant";

export type MessageStatus = "sending" | "sent" | "failed";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  error?: string;
};

export type ConversationSummary = {
  id: string;
  title: string;
  updatedAt: Date;
};
