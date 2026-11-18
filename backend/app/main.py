import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import sessionmaker

from app.api.routes import chat, health
from app.core.config import Settings, get_settings
from app.core.errors import AssistantError
from app.core.logging import configure_logging
from app.db.migrate import create_engine_for, upgrade_database
from app.llm.ollama import OllamaProvider

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings: Settings = app.state.settings
    configure_logging(settings.log_level)
    upgrade_database(settings.resolved_database_url)
    engine = create_engine_for(settings.resolved_database_url)
    app.state.engine = engine
    app.state.session_factory = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    try:
        yield
    finally:
        engine.dispose()
        app.state.llm.close()


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    app = FastAPI(title="NEXUS AI", version="0.1.0", lifespan=lifespan)
    app.state.settings = settings
    app.state.llm = OllamaProvider(settings)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=False,
        allow_methods=["GET", "POST", "DELETE"],
        allow_headers=["*"],
    )
    app.include_router(health.router)
    app.include_router(chat.router)

    @app.exception_handler(AssistantError)
    async def assistant_error(_request: Request, exc: AssistantError) -> JSONResponse:
        logger.warning("Petición rechazada con %s", exc.status_code)
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(RequestValidationError)
    async def validation_error(_request: Request, _exc: RequestValidationError) -> JSONResponse:
        return JSONResponse(
            status_code=422,
            content={
                "detail": (
                    "El mensaje no es válido. Escribe un texto "
                    f"de hasta {settings.max_message_chars} caracteres."
                )
            },
        )

    return app


app = create_app()
