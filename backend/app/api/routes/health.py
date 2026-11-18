from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_llm, get_settings_from_app
from app.core.config import Settings
from app.core.errors import AssistantError
from app.llm.base import LLMProvider
from app.schemas.chat import HealthResponse, ModelsResponse

router = APIRouter(tags=["health"])


def _health(db: Session, settings: Settings, llm: LLMProvider) -> HealthResponse:
    db.execute(text("SELECT 1"))
    probe = llm.probe()
    ollama = "ok" if probe.reachable else "unavailable"
    ready = probe.reachable and probe.model_ready
    return HealthResponse(
        status="ok" if ready else "degraded",
        database="ok",
        ollama=ollama,
        model=settings.ollama_model,
        model_ready=probe.model_ready,
    )


@router.get("/health", response_model=HealthResponse)
@router.get("/api/v1/health", response_model=HealthResponse)
def health(
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_from_app),
    llm: LLMProvider = Depends(get_llm),
) -> HealthResponse:
    return _health(db, settings, llm)


@router.get("/api/v1/models", response_model=ModelsResponse)
def models(
    settings: Settings = Depends(get_settings_from_app),
    llm: LLMProvider = Depends(get_llm),
) -> ModelsResponse:
    probe = llm.probe()
    if not probe.reachable:
        raise AssistantError(
            "No puedo conectar con Ollama en "
            f"{settings.ollama_base_url}. Ábrelo o ejecuta ollama serve.",
            503,
        )
    return ModelsResponse(configured_model=settings.ollama_model, models=probe.models)
