import { type FormEvent, useEffect, useState } from "react";
import {
  type ChatMessage,
  type ConversationSummary,
  type Health,
  deleteConversation,
  getConversation,
  getHealth,
  listConversations,
  sendMessage,
} from "./api";

export function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [healthError, setHealthError] = useState("");
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  async function refreshHealth() {
    try {
      setHealth(await getHealth());
      setHealthError("");
    } catch (caught) {
      setHealth(null);
      setHealthError(caught instanceof Error ? caught.message : "Sin conexión con el servidor");
    }
  }

  async function refreshList() {
    setConversations(await listConversations());
  }

  async function openConversation(id: string) {
    const detail = await getConversation(id);
    setSelectedId(detail.id);
    setMessages(detail.messages);
    setError("");
  }

  useEffect(() => {
    void refreshHealth();
    void refreshList().catch((caught: unknown) => {
      setError(caught instanceof Error ? caught.message : "No pude cargar las conversaciones");
    });
  }, []);

  async function onSend(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || sending) {
      return;
    }
    setSending(true);
    setError("");
    try {
      const reply = await sendMessage(text, selectedId);
      setDraft("");
      setSelectedId(reply.conversation_id);
      await openConversation(reply.conversation_id);
      await refreshList();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No pude enviar el mensaje");
    } finally {
      setSending(false);
    }
  }

  async function onDelete(id: string) {
    if (pendingDelete !== id) {
      setPendingDelete(id);
      return;
    }
    setError("");
    try {
      await deleteConversation(id);
      setPendingDelete(null);
      if (selectedId === id) {
        setSelectedId(null);
        setMessages([]);
      }
      await refreshList();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No pude borrar la conversación");
    }
  }

  const modelLine = health
    ? `Servidor: ${health.status}. Base de datos: ${health.database}. Ollama: ${health.ollama}. Modelo: ${health.model}. ${
        health.model_ready ? "Modelo listo." : "Modelo no descargado o no disponible."
      }`
    : healthError || "Comprobando el servidor…";

  return (
    <main>
      <h1>NEXUS</h1>
      <p>{modelLine}</p>
      <p>
        <button type="button" onClick={() => void refreshHealth()}>
          Comprobar estado
        </button>
      </p>

      <h2>Conversaciones</h2>
      <p>
        <button
          type="button"
          onClick={() => {
            setSelectedId(null);
            setMessages([]);
            setError("");
          }}
        >
          Nueva
        </button>
      </p>
      {conversations.length === 0 ? <p>Todavía no hay conversaciones.</p> : null}
      <ul>
        {conversations.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => void openConversation(item.id)}>
              {item.title}
            </button>{" "}
            <button type="button" onClick={() => void onDelete(item.id)}>
              {pendingDelete === item.id ? "Confirmar borrado" : "Borrar"}
            </button>
            {pendingDelete === item.id ? (
              <button type="button" onClick={() => setPendingDelete(null)}>
                Cancelar
              </button>
            ) : null}
          </li>
        ))}
      </ul>

      <h2>{selectedId ? "Conversación" : "Nueva conversación"}</h2>
      {messages.length === 0 ? <p>Escribe un mensaje para probar el modelo.</p> : null}
      {messages.map((item) => (
        <p key={item.id}>
          <strong>{item.role === "user" ? "Tú" : "NEXUS"}:</strong> {item.content}
        </p>
      ))}

      <form onSubmit={(event) => void onSend(event)}>
        <p>
          <textarea
            value={draft}
            rows={4}
            cols={60}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Escribe a NEXUS"
          />
        </p>
        <p>
          <button type="submit" disabled={sending}>
            {sending ? "Esperando al modelo…" : "Enviar"}
          </button>
        </p>
      </form>
      {sending ? (
        <p>La primera respuesta en un equipo de 8 GB puede tardar un minuto, mientras carga el modelo.</p>
      ) : null}
      {error ? <p>Error: {error}</p> : null}
    </main>
  );
}
