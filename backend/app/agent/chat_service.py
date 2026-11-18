import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.agent.prompts import SYSTEM_PROMPT
from app.core.config import Settings
from app.core.errors import AssistantError
from app.db.models import Conversation, Message
from app.llm.base import LLMMessage, LLMProvider
from app.schemas.chat import ChatResponse


def send_message(
    db: Session,
    settings: Settings,
    llm: LLMProvider,
    conversation_id: str | None,
    text: str,
) -> ChatResponse:
    if len(text) > settings.max_message_chars:
        raise AssistantError(
            f"El mensaje supera los {settings.max_message_chars} caracteres.",
            422,
        )

    now = datetime.now(UTC)
    created_now = False
    if conversation_id is None:
        conversation = Conversation(
            id=str(uuid.uuid4()),
            owner_id=settings.local_owner_id,
            title=_title_from(text),
            created_at=now,
            updated_at=now,
        )
        db.add(conversation)
        created_now = True
    else:
        conversation = _owned_conversation(db, settings, conversation_id)

    history = _recent_messages(db, settings, conversation.id)
    prompt = [LLMMessage(role="system", content=SYSTEM_PROMPT)]
    prompt.extend(LLMMessage(role=item.role, content=item.content) for item in history)
    prompt.append(LLMMessage(role="user", content=text))

    try:
        reply = llm.complete(prompt)
    except AssistantError:
        db.rollback()
        raise

    answered_at = datetime.now(UTC)
    if created_now or conversation.title == "Nueva conversación":
        conversation.title = _title_from(text)
    conversation.updated_at = answered_at
    db.add(
        Message(
            id=str(uuid.uuid4()),
            conversation_id=conversation.id,
            owner_id=settings.local_owner_id,
            role="user",
            content=text,
            created_at=answered_at,
        )
    )
    db.add(
        Message(
            id=str(uuid.uuid4()),
            conversation_id=conversation.id,
            owner_id=settings.local_owner_id,
            role="assistant",
            content=reply,
            created_at=answered_at + timedelta(microseconds=1),
        )
    )
    db.commit()
    db.refresh(conversation)
    return ChatResponse(
        conversation_id=conversation.id,
        message=reply,
        title=conversation.title,
    )


def _owned_conversation(db: Session, settings: Settings, conversation_id: str) -> Conversation:
    conversation = db.get(Conversation, conversation_id)
    if conversation is None or conversation.owner_id != settings.local_owner_id:
        raise AssistantError("No encuentro esa conversación.", 404)
    return conversation


def _recent_messages(db: Session, settings: Settings, conversation_id: str) -> list[Message]:
    statement = (
        select(Message)
        .where(
            Message.conversation_id == conversation_id,
            Message.owner_id == settings.local_owner_id,
        )
        .order_by(Message.created_at.desc(), Message.id.desc())
        .limit(settings.max_history_messages)
    )
    rows = list(db.scalars(statement))
    rows.reverse()
    return rows


def _title_from(text: str) -> str:
    compact = " ".join(text.split())
    if len(compact) <= 80:
        return compact
    return compact[:77] + "..."
