from fastapi import APIRouter, Depends, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.agent.chat_service import send_message
from app.api.deps import get_db, get_llm, get_settings_from_app
from app.core.config import Settings
from app.core.errors import AssistantError
from app.db.models import Conversation, Message
from app.llm.base import LLMProvider
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ConversationDetail,
    ConversationSummary,
    MessageView,
)

router = APIRouter(prefix="/api/v1", tags=["chat"])


@router.get("/conversations", response_model=list[ConversationSummary])
def list_conversations(
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_from_app),
) -> list[Conversation]:
    statement = (
        select(Conversation)
        .where(Conversation.owner_id == settings.local_owner_id)
        .order_by(Conversation.updated_at.desc())
        .limit(50)
    )
    return list(db.scalars(statement))


@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
def get_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_from_app),
) -> ConversationDetail:
    conversation = db.get(Conversation, conversation_id)
    if conversation is None or conversation.owner_id != settings.local_owner_id:
        raise AssistantError("No encuentro esa conversación.", 404)
    messages = db.scalars(
        select(Message)
        .where(
            Message.conversation_id == conversation.id,
            Message.owner_id == settings.local_owner_id,
        )
        .order_by(Message.created_at.asc(), Message.id.asc())
    )
    return ConversationDetail(
        id=conversation.id,
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        messages=[
            MessageView(
                id=item.id,
                role=item.role,
                content=item.content,
                created_at=item.created_at,
            )
            for item in messages
        ],
    )


@router.delete("/conversations/{conversation_id}", status_code=204)
def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_from_app),
) -> Response:
    conversation = db.get(Conversation, conversation_id)
    if conversation is None or conversation.owner_id != settings.local_owner_id:
        raise AssistantError("No encuentro esa conversación.", 404)
    db.delete(conversation)
    db.commit()
    return Response(status_code=204)


@router.post("/chat", response_model=ChatResponse)
def chat(
    body: ChatRequest,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_from_app),
    llm: LLMProvider = Depends(get_llm),
) -> ChatResponse:
    return send_message(db, settings, llm, body.conversation_id, body.message)
