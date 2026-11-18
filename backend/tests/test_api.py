from datetime import UTC, datetime

import httpx
import pytest
from app.core.config import Settings
from app.core.errors import AssistantError
from app.db.models import Conversation
from app.llm.base import LLMMessage, ModelProbe
from app.main import create_app
from fastapi.testclient import TestClient


class FakeLLM:
    def __init__(self, reply: str = "Respuesta de prueba") -> None:
        self.reply = reply
        self.fail: AssistantError | None = None
        self.seen: list[list[LLMMessage]] = []
        self.probe_result = ModelProbe(
            reachable=True,
            model_ready=True,
            models=["qwen3:4b"],
        )

    def complete(self, messages: list[LLMMessage]) -> str:
        self.seen.append(messages)
        if self.fail is not None:
            raise self.fail
        return self.reply

    def probe(self) -> ModelProbe:
        return self.probe_result

    def close(self) -> None:
        return None


@pytest.fixture
def fake_llm() -> FakeLLM:
    return FakeLLM()


@pytest.fixture
def client(tmp_path, fake_llm: FakeLLM) -> TestClient:
    database = tmp_path / "test.db"
    settings = Settings(
        _env_file=None,
        database_url=f"sqlite:///{database}",
        ollama_model="qwen3:4b",
        max_history_messages=4,
    )
    app = create_app(settings)
    original = app.state.llm
    original.close()
    app.state.llm = fake_llm
    with TestClient(app) as test_client:
        yield test_client


def test_health_ok(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["database"] == "ok"
    assert body["model"] == "qwen3:4b"
    assert body["model_ready"] is True


def test_health_when_ollama_is_down(client: TestClient, fake_llm: FakeLLM) -> None:
    fake_llm.probe_result = ModelProbe(reachable=False, model_ready=False, models=[])
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "degraded"
    assert response.json()["ollama"] == "unavailable"


def test_models_reports_unavailable_ollama(client: TestClient, fake_llm: FakeLLM) -> None:
    fake_llm.probe_result = ModelProbe(reachable=False, model_ready=False, models=[])
    response = client.get("/api/v1/models")
    assert response.status_code == 503
    assert "Ollama" in response.json()["detail"]


def test_chat_creates_conversation_and_keeps_history(client: TestClient, fake_llm: FakeLLM) -> None:
    first = client.post("/api/v1/chat", json={"message": "Hola, ¿quién eres?"})
    assert first.status_code == 200
    created = first.json()
    assert created["message"] == "Respuesta de prueba"
    assert created["title"] == "Hola, ¿quién eres?"

    second = client.post(
        "/api/v1/chat",
        json={"conversation_id": created["conversation_id"], "message": "¿Y ahora?"},
    )
    assert second.status_code == 200
    assert len(fake_llm.seen) == 2
    roles = [item.role for item in fake_llm.seen[1]]
    assert roles == ["system", "user", "assistant", "user"]

    detail = client.get(f"/api/v1/conversations/{created['conversation_id']}")
    assert detail.status_code == 200
    assert [item["role"] for item in detail.json()["messages"]] == [
        "user",
        "assistant",
        "user",
        "assistant",
    ]


def test_failed_model_does_not_store_the_message(client: TestClient, fake_llm: FakeLLM) -> None:
    fake_llm.fail = AssistantError("Ollama está apagado.", 503)
    response = client.post("/api/v1/chat", json={"message": "Hola"})
    assert response.status_code == 503
    assert response.json()["detail"] == "Ollama está apagado."
    assert client.get("/api/v1/conversations").json() == []


def test_empty_and_too_long_messages_are_rejected(client: TestClient) -> None:
    empty = client.post("/api/v1/chat", json={"message": "   "})
    assert empty.status_code == 422
    huge = client.post("/api/v1/chat", json={"message": "a" * 8001})
    assert huge.status_code == 422


def test_unknown_conversation_returns_404(client: TestClient) -> None:
    response = client.post(
        "/api/v1/chat",
        json={"conversation_id": "no-existe", "message": "Hola"},
    )
    assert response.status_code == 404


def test_delete_conversation(client: TestClient) -> None:
    created = client.post("/api/v1/chat", json={"message": "Bórrame"}).json()
    deleted = client.delete(f"/api/v1/conversations/{created['conversation_id']}")
    assert deleted.status_code == 204
    missing = client.get(f"/api/v1/conversations/{created['conversation_id']}")
    assert missing.status_code == 404


def test_other_owner_is_hidden(client: TestClient) -> None:
    factory = client.app.state.session_factory
    db = factory()
    now = datetime.now(UTC)
    db.add(
        Conversation(
            id="ajena",
            owner_id="otra-persona",
            title="Privado",
            created_at=now,
            updated_at=now,
        )
    )
    db.commit()
    db.close()

    listed = client.get("/api/v1/conversations")
    assert listed.json() == []
    hidden = client.get("/api/v1/conversations/ajena")
    assert hidden.status_code == 404


def test_ollama_connection_error_is_a_clear_message() -> None:
    from app.llm.ollama import OllamaProvider

    def fail(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("rechazado", request=request)

    settings = Settings(_env_file=None, ollama_base_url="http://127.0.0.1:11434")
    provider = OllamaProvider(
        settings,
        client=httpx.Client(
            base_url="http://127.0.0.1:11434",
            transport=httpx.MockTransport(fail),
        ),
    )
    with pytest.raises(AssistantError) as caught:
        provider.complete([LLMMessage(role="user", content="Hola")])
    assert caught.value.status_code == 503
    assert "Ollama" in caught.value.detail
    provider.close()


def test_ollama_reads_the_reply_and_disables_thinking() -> None:
    from app.llm.ollama import OllamaProvider

    seen: dict[str, object] = {}

    def respond(request: httpx.Request) -> httpx.Response:
        seen["body"] = request.read().decode()
        return httpx.Response(
            200,
            json={"message": {"role": "assistant", "content": "pensando</think>\n\nSoy NEXUS."}},
        )

    settings = Settings(_env_file=None, ollama_model="qwen3:4b", ollama_num_ctx=2048)
    provider = OllamaProvider(
        settings,
        client=httpx.Client(
            base_url="http://127.0.0.1:11434",
            transport=httpx.MockTransport(respond),
        ),
    )
    reply = provider.complete([LLMMessage(role="user", content="Hola")])
    assert reply == "Soy NEXUS."
    assert '"think": false' in str(seen["body"]) or '"think":false' in str(seen["body"])
    assert "qwen3:4b" in str(seen["body"])
    provider.close()
