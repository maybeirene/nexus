from collections.abc import Iterator

from fastapi import Request
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.llm.base import LLMProvider


def get_settings_from_app(request: Request) -> Settings:
    settings = request.app.state.settings
    if not isinstance(settings, Settings):
        raise RuntimeError("La aplicación no tiene configuración")
    return settings


def get_llm(request: Request) -> LLMProvider:
    llm = request.app.state.llm
    if not hasattr(llm, "complete") or not hasattr(llm, "probe"):
        raise RuntimeError("La aplicación no tiene un proveedor de modelo")
    return llm


def get_db(request: Request) -> Iterator[Session]:
    factory = request.app.state.session_factory
    db: Session = factory()
    try:
        yield db
    finally:
        db.close()
