import { Button } from "../../../design-system/atoms/Button";
import { EmptyState } from "../../../design-system/molecules/EmptyState";
import { CHAT_SUGGESTIONS } from "../model/suggestions";

type ChatWelcomeProps = {
  onPick: (prompt: string) => void;
  disabled?: boolean;
};

export function ChatWelcome({ onPick, disabled }: ChatWelcomeProps) {
  return (
    <EmptyState size="lg" title="¿En qué te ayudo?" description="Pregunta por tus tareas, tu agenda o el tiempo.">
      <ul className="flex max-w-md flex-wrap justify-center gap-2">
        {CHAT_SUGGESTIONS.map((prompt) => (
          <li key={prompt}>
            <Button size="sm" className="h-8 px-3 font-normal" disabled={disabled} onClick={() => onPick(prompt)}>
              {prompt}
            </Button>
          </li>
        ))}
      </ul>
    </EmptyState>
  );
}
