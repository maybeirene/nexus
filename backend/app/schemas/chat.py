from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ChatRequest(BaseModel):
    conversation_id: str | None = None
    message: str = Field(min_length=1, max_length=8000)

    @field_validator("conversation_id", mode="before")
    @classmethod
    def blank_conversation(cls, value: object) -> str | None:
        if value is None:
            return None
        text = str(value).strip()
        return text or None

    @field_validator("message")
    @classmethod
    def strip_message(cls, value: str) -> str:
        text = value.strip()
        if not text:
            raise ValueError("El mensaje está vacío")
        return text


class ChatResponse(BaseModel):
    conversation_id: str
    message: str
    title: str


class MessageView(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime


class ConversationSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    created_at: datetime
    updated_at: datetime


class ConversationDetail(ConversationSummary):
    messages: list[MessageView]


class HealthResponse(BaseModel):
    status: str
    database: str
    ollama: str
    model: str
    model_ready: bool


class ModelsResponse(BaseModel):
    configured_model: str
    models: list[str]
