import { request } from "../../../shared/api/http";
import type { ChatMessage, ConversationSummary, MessageRole } from "../model/types";

type ConversationSummaryDto = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

type MessageDto = {
  id: string;
  role: MessageRole;
  content: string;
  created_at: string;
};

type ConversationDetailDto = ConversationSummaryDto & { messages: MessageDto[] };

type ChatResponseDto = {
  conversation_id: string;
  message: string;
  title: string;
};

const BASE = "/api/v1";

const toSummary = (dto: ConversationSummaryDto): ConversationSummary => ({
  id: dto.id,
  title: dto.title,
  updatedAt: new Date(dto.updated_at),
});

const toMessage = (dto: MessageDto): ChatMessage => ({
  id: dto.id,
  role: dto.role,
  content: dto.content,
  status: "sent",
});

export async function listConversations(signal?: AbortSignal): Promise<ConversationSummary[]> {
  const items = await request<ConversationSummaryDto[]>(`${BASE}/conversations`, { signal });
  return items.map(toSummary);
}

export async function getConversationMessages(id: string, signal?: AbortSignal): Promise<ChatMessage[]> {
  const detail = await request<ConversationDetailDto>(`${BASE}/conversations/${encodeURIComponent(id)}`, { signal });
  return detail.messages.map(toMessage);
}

export function deleteConversation(id: string): Promise<void> {
  return request<void>(`${BASE}/conversations/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function sendChatMessage(
  message: string,
  conversationId: string | null,
): Promise<{ conversationId: string; reply: string }> {
  const response = await request<ChatResponseDto>(`${BASE}/chat`, {
    method: "POST",
    body: JSON.stringify({ conversation_id: conversationId, message }),
  });
  return { conversationId: response.conversation_id, reply: response.message };
}
