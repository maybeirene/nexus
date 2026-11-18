from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

REPO_ROOT = Path(__file__).resolve().parents[3]
BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """Configuración leída de variables de entorno y del .env de la raíz."""

    app_env: str = "development"
    app_host: str = "127.0.0.1"
    app_port: int = 8000
    log_level: str = "INFO"
    database_url: str = "sqlite:///./data/nexus.db"
    llm_provider: str = "ollama"
    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_model: str = "qwen3:4b"
    ollama_timeout_seconds: float = 180
    ollama_num_ctx: int = 2048
    ollama_num_predict: int = 128
    max_message_chars: int = 8000
    max_history_messages: int = 12
    local_owner_id: str = "local"
    secret_key: str = ""

    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://127.0.0.1:5173",
            "http://localhost:5173",
        ]
    )

    model_config = SettingsConfigDict(
        env_file=REPO_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def resolved_database_url(self) -> str:
        """Convierte una ruta SQLite relativa a la raíz del repositorio."""
        prefix = "sqlite:///./"
        if self.database_url.startswith(prefix):
            relative = self.database_url.removeprefix(prefix)
            path = (REPO_ROOT / relative).resolve()
            path.parent.mkdir(parents=True, exist_ok=True)
            return f"sqlite:///{path.as_posix()}"
        if self.database_url.startswith("sqlite:///"):
            raw = self.database_url.removeprefix("sqlite:///")
            if raw and raw != ":memory:":
                Path(raw).parent.mkdir(parents=True, exist_ok=True)
        return self.database_url


@lru_cache
def get_settings() -> Settings:
    return Settings()
