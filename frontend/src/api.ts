export type Health = {
  status: string;
  database: string;
  ollama: string;
  model: string;
  model_ready: boolean;
};

export type ConversationSummary = {
  id: string;
  title: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  role: string;
  content: string;
};

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: unknown };
    if (typeof body.detail === "string") {
      return body.detail;
    }
  } catch {
    // La respuesta no traía JSON.
  }
  return `La petición ha fallado (${response.status}).`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function getHealth(): Promise<Health> {
  return request<Health>("/health");
}

export function listConversations(): Promise<ConversationSummary[]> {
  return request<ConversationSummary[]>("/api/v1/conversations");
}

export function getConversation(
  id: string,
): Promise<{ id: string; title: string; messages: ChatMessage[] }> {
  return request(`/api/v1/conversations/${id}`);
}

export function deleteConversation(id: string): Promise<void> {
  return request<void>(`/api/v1/conversations/${id}`, { method: "DELETE" });
}

export function sendMessage(
  message: string,
  conversationId: string | null,
): Promise<{ conversation_id: string; message: string; title: string }> {
  return request("/api/v1/chat", {
    method: "POST",
    body: JSON.stringify({
      conversation_id: conversationId,
      message,
    }),
  });
}
