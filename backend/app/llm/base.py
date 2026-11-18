from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class LLMMessage:
    role: str
    content: str


@dataclass(frozen=True)
class ModelProbe:
    reachable: bool
    model_ready: bool
    models: list[str]


class LLMProvider(Protocol):
    def complete(self, messages: list[LLMMessage]) -> str: ...

    def probe(self) -> ModelProbe: ...

    def close(self) -> None: ...
