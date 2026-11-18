import logging

import httpx

from app.core.config import Settings
from app.core.errors import AssistantError
from app.llm.base import LLMMessage, ModelProbe

logger = logging.getLogger(__name__)


class OllamaProvider:
    """Cliente de la API local de Ollama. No registra el texto de la conversación."""

    def __init__(self, settings: Settings, client: httpx.Client | None = None) -> None:
        self._settings = settings
        self._owns_client = client is None
        self._client = client or httpx.Client(
            base_url=settings.ollama_base_url.rstrip("/"),
            timeout=httpx.Timeout(settings.ollama_timeout_seconds, connect=5.0),
        )

    def close(self) -> None:
        if self._owns_client:
            self._client.close()

    def probe(self) -> ModelProbe:
        try:
            names = self._list_models()
        except AssistantError:
            logger.warning("Ollama no responde en %s", self._settings.ollama_base_url)
            return ModelProbe(reachable=False, model_ready=False, models=[])
        ready = _model_is_installed(self._settings.ollama_model, names)
        return ModelProbe(reachable=True, model_ready=ready, models=names)

    def complete(self, messages: list[LLMMessage]) -> str:
        payload = {
            "model": self._settings.ollama_model,
            "messages": [{"role": item.role, "content": item.content} for item in messages],
            "stream": False,
            "think": False,
            "options": {"temperature": 0.7, "num_ctx": self._settings.ollama_num_ctx},
        }
        try:
            response = self._client.post("/api/chat", json=payload)
        except httpx.ConnectError:
            raise AssistantError(
                "No puedo conectar con Ollama en "
                f"{self._settings.ollama_base_url}. Ábrelo o ejecuta ollama serve.",
                503,
            ) from None
        except httpx.TimeoutException:
            raise AssistantError(
                "El modelo ha tardado demasiado en responder. Prueba con un mensaje más corto.",
                504,
            ) from None

        self._raise_for_status(response)
        body = response.json()
        message = body.get("message") if isinstance(body, dict) else None
        content = ""
        if isinstance(message, dict):
            content = str(message.get("content") or "").strip()
            if not content:
                content = str(message.get("thinking") or "").strip()
        content = _visible_reply(content)
        if not content:
            raise AssistantError("El modelo ha respondido vacío. Prueba a enviarlo otra vez.", 502)
        return content

    def _list_models(self) -> list[str]:
        try:
            response = self._client.get("/api/tags")
        except httpx.ConnectError:
            raise AssistantError(
                "No puedo conectar con Ollama en "
                f"{self._settings.ollama_base_url}. Ábrelo o ejecuta ollama serve.",
                503,
            ) from None
        except httpx.TimeoutException:
            raise AssistantError("Ollama no ha respondido a tiempo.", 504) from None
        self._raise_for_status(response)
        body = response.json()
        models = body.get("models", []) if isinstance(body, dict) else []
        names: list[str] = []
        for item in models:
            if isinstance(item, dict) and item.get("name"):
                names.append(str(item["name"]))
        return names

    def _raise_for_status(self, response: httpx.Response) -> None:
        if response.status_code < 400:
            return
        detail = "Ollama ha devuelto un error."
        try:
            payload = response.json()
            if isinstance(payload, dict) and payload.get("error"):
                detail = str(payload["error"])[:300]
        except ValueError:
            if response.text:
                detail = response.text[:300]
        lowered = detail.lower()
        if response.status_code == 404 or "not found" in lowered:
            model = self._settings.ollama_model
            raise AssistantError(
                f"El modelo {model} no está descargado. Ejecuta: ollama pull {model}",
                503,
            )
        raise AssistantError(detail, 502)


def _model_is_installed(configured: str, installed: list[str]) -> bool:
    wanted = configured.strip()
    for name in installed:
        if name == wanted or name.startswith(f"{wanted}:"):
            return True
    return False


def _visible_reply(content: str) -> str:
    """Qwen 3 a veces escribe el razonamiento y lo cierra con </think>."""
    text = content.strip()
    if "</think>" in text:
        text = text.split("</think>")[-1].strip()
    return text
